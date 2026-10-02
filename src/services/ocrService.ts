/**
 * =========================================================================
 * MEDSCOPE OPTICAL CHARACTER RECOGNITION (OCR) SERVICE
 * =========================================================================
 * Single-responsibility module: turn images/documents into raw text.
 * Pipeline: canvas preprocessing (contrast/grayscale) → Tesseract.js (local,
 * offline) → OCR.space cloud fallback. Clinical analysis of the extracted
 * text lives in reportAnalysisService.ts.
 */

import Tesseract from "tesseract.js";

export const OCR_SPACE_API_KEY = import.meta.env.VITE_OCR_SPACE_API_KEY || "";

const OCR_SPACE_URL = "https://api.ocr.space/parse/image";

export interface OcrProgressUpdate {
  status: string;
  progress: number; // 0 to 1
}

/**
 * Preprocesses an image via HTML5 Canvas before passing to OCR:
 * - Scales to optimal optical dimensions (max 1800px width/height)
 * - Converts color to grayscale using ITU-R BT.709 luminance
 * - Stretches histogram contrast to cleanly separate packaging lettering from colored/metallic boxes
 */
export async function preprocessImageForOcr(file: File | Blob): Promise<Blob> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Limit maximum dimension to 1800px for speed & optimal OCR DPI
        const maxDim = 1800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Access image pixels for contrast and luminance enhancement
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Contrast enhancement coefficient (+35)
        const contrast = 35;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          // Standard perceptual luminance
          const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          // Stretch contrast to cut through packaging gradients
          const enhanced = factor * (gray - 128) + 128;
          const clamped = Math.max(0, Math.min(255, enhanced));

          data[i] = clamped;     // Red
          data[i + 1] = clamped; // Green
          data[i + 2] = clamped; // Blue
          // Alpha remains untouched
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > 0) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/png"
        );
      } catch (err) {
        console.warn("Canvas image preprocessing note:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Extracts raw textual data from an uploaded image or document file.
 * Prioritizes high-contrast client-side Tesseract.js optical scanning,
 * backed by OCR.space cloud engine.
 */
export async function extractTextFromImageFile(
  file: File | Blob,
  onProgress?: (update: OcrProgressUpdate) => void
): Promise<string> {
  // If plain text file, read directly
  if (file instanceof File && (file.type.includes("text") || file.name.endsWith(".txt"))) {
    onProgress?.({ status: "Reading text file...", progress: 1 });
    return await file.text();
  }

  onProgress?.({ status: "Enhancing packaging image contrast & resolution...", progress: 0.15 });

  let processedBlob: Blob = file;
  try {
    processedBlob = await preprocessImageForOcr(file);
  } catch {
    processedBlob = file;
  }

  onProgress?.({ status: "Scanning text contours on medicine packaging...", progress: 0.3 });

  let recognized = "";

  try {
    // Primary Engine: Preprocessed high-contrast Tesseract.js
    const result = await Tesseract.recognize(processedBlob, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          onProgress?.({
            status: `Reading package text: ${Math.round((m.progress || 0) * 100)}%`,
            progress: 0.3 + (m.progress || 0) * 0.5,
          });
        }
      },
    });

    recognized = result.data.text ? result.data.text.trim() : "";

    // If Tesseract successfully extracted meaningful text (>= 8 characters)
    if (recognized && recognized.length >= 8) {
      onProgress?.({ status: "Optical extraction successful", progress: 0.95 });
      return recognized;
    }

    console.warn("Primary OCR extracted low text volume, attempting secondary cloud engine...");
  } catch (tessErr) {
    console.warn("Tesseract engine warning:", tessErr);
  }

  // Secondary Engine: OCR.space Cloud Engine with original file
  if (file instanceof File) {
    try {
      onProgress?.({ status: "Verifying via secondary neural optical engine...", progress: 0.85 });
      const cloudText = await performOcrSpaceScan(file, (msg) => {
        onProgress?.({ status: msg, progress: 0.9 });
      });

      if (cloudText && cloudText.trim().length >= 6) {
        onProgress?.({ status: "Cloud optical recognition complete", progress: 1 });
        // If we also had some characters from Tesseract, combine them for maximum coverage
        return recognized ? `${recognized}\n${cloudText.trim()}` : cloudText.trim();
      }
    } catch (cloudErr) {
      console.warn("Secondary OCR error:", cloudErr);
    }
  }

  onProgress?.({ status: "Extraction completed", progress: 1 });
  return recognized;
}

/**
 * Sends an uploaded patient report image or PDF to the OCR.space cloud API
 * and extracts raw text. Used directly for PDFs (Tesseract cannot parse them)
 * and as the secondary engine when local Tesseract extraction is weak.
 */
export async function performOcrSpaceScan(
  file: File,
  onProgress?: (msg: string) => void
): Promise<string> {
  if (file.type.includes("text") || file.name.endsWith(".txt")) {
    onProgress?.("Reading text document...");
    return await file.text();
  }

  onProgress?.("Uploading document to OCR.space engine...");

  const formData = new FormData();
  formData.append("apikey", OCR_SPACE_API_KEY);
  formData.append("file", file, file.name);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "1");

  try {
    const response = await fetch(OCR_SPACE_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OCR.space HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.IsErroredOnProcessing && (!data.ParsedResults || data.ParsedResults.length === 0)) {
      const errorMsg = Array.isArray(data.ErrorMessage)
        ? data.ErrorMessage.join(" ")
        : data.ErrorMessage || "OCR processing failed";
      throw new Error(errorMsg);
    }

    const parsedText = data.ParsedResults?.[0]?.ParsedText?.trim();

    if (!parsedText || parsedText.length < 5) {
      throw new Error("OCR returned insufficient text. Image may be low resolution or blank.");
    }

    onProgress?.("Extracted optical text from document successfully.");
    return parsedText;
  } catch (error: any) {
    console.warn("[OCR.space] API warning/fallback:", error?.message || error);
    throw error;
  }
}
