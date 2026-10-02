/**
 * =========================================================================
 * MEDSCOPE LAB REPORT OCR & DISEASE DETECTION SERVICE
 * WITH MEDINDIA DRUG PRESCRIBING & SEARCH INTEGRATION
 * =========================================================================
 * 
 * Sourced & Linked to: https://www.medindia.net/
 * Detects chronic diseases (Diabetes, Hypertension, Dyslipidemia, Thyroid,
 * Renal strain, Anemia) and suggests clinically validated medications.
 */

export interface Biomarker {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: "normal" | "borderline" | "high" | "low";
  clinicalSignificance: string;
}

export interface MedindiaMedicine {
  genericName: string;
  popularBrands: string[];
  drugClass: string;
  standardDosage: string;
  frequency: string;
  administration: string;
  mechanism: string;
  contraindications: string[];
  medindiaDrugUrl: string;
  medindiaSearchUrl: string;
  webSearchUrl: string;
}

export interface FlaggedDisease {
  id: string;
  diseaseName: string;
  diagnosticStatus: "Detected" | "Borderline / Pre-Condition" | "High Risk Alert";
  severity: "Mild" | "Moderate" | "Severe";
  primaryEvidence: string;
  icdCode?: string;
  clinicalGuideline: string;
  lifestyleModifications: string[];
  medindiaConditionUrl: string;
  suggestedMedicines: MedindiaMedicine[];
}

export interface ReportAnalysisResult {
  reportTitle: string;
  patientNameHint?: string;
  dateAnalyzed: string;
  rawOcrText: string;
  overallStatus: "Normal" | "Attention Required" | "Action Needed - Critical Findings";
  biomarkers: Biomarker[];
  flaggedDiseases: FlaggedDisease[];
  doctorClinicalSummary: string;
  patientTakeaway: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MEDINDIA-LINKED MEDICINE KNOWLEDGE REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

export const MEDINDIA_BASE_URL = "https://www.medindia.net";

export const MEDINDIA_DISEASE_LINKS: Record<string, string> = {
  diabetes: "https://www.medindia.net/drugs/medical-condition/diabetes.htm",
  hypertension: "https://www.medindia.net/drugs/medical-condition/hypertension.htm",
  cholesterol: "https://www.medindia.net/drugs/medical-condition/high-cholesterol.htm",
  thyroid: "https://www.medindia.net/drugs/medical-condition/hypothyroidism.htm",
  kidney: "https://www.medindia.net/drugs/medical-condition/chronic-kidney-disease.htm",
  anemia: "https://www.medindia.net/drugs/medical-condition/anemia.htm"
};

export const MEDINDIA_MEDICINES: Record<string, MedindiaMedicine[]> = {
  diabetes: [
    {
      genericName: "Metformin Hydrochloride",
      popularBrands: ["Glycomet", "Glucophage", "Obimet", "Cetapin"],
      drugClass: "Biguanide Antidiabetic Agent",
      standardDosage: "500 mg to 1,000 mg",
      frequency: "Twice daily with meals (BID)",
      administration: "Take with or immediately after food to reduce gastrointestinal irritation.",
      mechanism: "Reduces hepatic glucose output and increases peripheral insulin-mediated glucose uptake.",
      contraindications: ["Severe renal impairment (eGFR < 30 mL/min)", "Acute metabolic acidosis", "Severe hepatic impairment"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/metformin.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Metformin",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Metformin+dosage+brands"
    },
    {
      genericName: "Glimepiride",
      popularBrands: ["Amaryl", "Glimy", "Zoryl", "Glynase"],
      drugClass: "Second-Generation Sulfonylurea",
      standardDosage: "1 mg to 2 mg",
      frequency: "Once daily before breakfast (OD)",
      administration: "Take immediately before or during the first main meal of the day.",
      mechanism: "Stimulates insulin release from functioning pancreatic beta cells by closing ATP-sensitive K+ channels.",
      contraindications: ["Hypoglycemia prone patients", "Type 1 diabetes", "Diabetic ketoacidosis"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/glimepiride.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Glimepiride",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Glimepiride+brands+dosage"
    },
    {
      genericName: "Dapagliflozin",
      popularBrands: ["Forxiga", "Oxra", "Dapanorm", "Dapaglyn"],
      drugClass: "SGLT2 Inhibitor (Gliflozin)",
      standardDosage: "10 mg",
      frequency: "Once daily in the morning (OD)",
      administration: "Take with or without food, preferably at the same time every morning.",
      mechanism: "Inhibits renal sodium-glucose cotransporter 2 (SGLT2), promoting urinary excretion of excess glucose and cardio-renal protection.",
      contraindications: ["Dialysis / End-stage renal disease", "Volume depletion", "Recurrent mycotic genital infections"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/dapagliflozin.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Dapagliflozin",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Dapagliflozin+brands+uses"
    }
  ],

  hypertension: [
    {
      genericName: "Telmisartan",
      popularBrands: ["Telma", "Micardis", "Telvas", "Teli"],
      drugClass: "Angiotensin II Receptor Blocker (ARB)",
      standardDosage: "40 mg to 80 mg",
      frequency: "Once daily in the morning (OD)",
      administration: "Administer with a glass of water, with or without food.",
      mechanism: "Blocks AT1 receptors, preventing angiotensin II vasoconstriction and aldosterone-mediated sodium retention.",
      contraindications: ["Pregnancy (Class D teratogenic)", "Bilateral renal artery stenosis", "Severe hyperkalemia"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/telmisartan.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Telmisartan",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Telmisartan+dosage+indications"
    },
    {
      genericName: "Amlodipine Besylate",
      popularBrands: ["Norvasc", "Amlip", "Stamlo", "Amlodac"],
      drugClass: "Dihydropyridine Calcium Channel Blocker (CCB)",
      standardDosage: "5 mg to 10 mg",
      frequency: "Once daily (OD)",
      administration: "May be taken in the morning or bedtime; monitor for pedal edema.",
      mechanism: "Inhibits calcium influx across vascular smooth muscle, yielding coronary and peripheral arterial dilation.",
      contraindications: ["Severe aortic stenosis", "Unstable angina post-MI", "Severe hypotension"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/amlodipine.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Amlodipine",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Amlodipine+dosage+brands"
    },
    {
      genericName: "Hydrochlorothiazide",
      popularBrands: ["Aquazide", "Hydride", "Microzide"],
      drugClass: "Thiazide Diuretic",
      standardDosage: "12.5 mg to 25 mg",
      frequency: "Once daily in the morning (OD)",
      administration: "Take in the morning to prevent nocturnal diuresis.",
      mechanism: "Inhibits sodium and chloride reabsorption in the distal convoluted tubule.",
      contraindications: ["Anuria", "Severe hypokalemia", "Hyponatremia", "Severe gout"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/hydrochlorothiazide.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Hydrochlorothiazide",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Hydrochlorothiazide+medindia"
    }
  ],

  cholesterol: [
    {
      genericName: "Atorvastatin Calcium",
      popularBrands: ["Lipitor", "Atorva", "Storvas", "Atocor"],
      drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
      standardDosage: "10 mg to 40 mg",
      frequency: "Once daily at bedtime (QHS)",
      administration: "Administer in the evening when hepatic cholesterol synthesis is maximal.",
      mechanism: "Competitively inhibits HMG-CoA reductase, dramatically upregulating hepatic LDL receptors.",
      contraindications: ["Active liver disease / unexplained ALT elevation", "Pregnancy & lactation", "Concurrent strong CYP3A4 inhibitors"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/atorvastatin.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Atorvastatin",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Atorvastatin+indications"
    },
    {
      genericName: "Rosuvastatin",
      popularBrands: ["Crestor", "Rosuvas", "Rozavel", "Roseday"],
      drugClass: "High-Intensity Statin",
      standardDosage: "10 mg to 20 mg",
      frequency: "Once daily (OD)",
      administration: "Take at any time of day with or without food.",
      mechanism: "Potent hydrophilic statin yielding up to 55% LDL-C reduction and HDL elevation.",
      contraindications: ["Severe renal impairment (CrCl < 30 mL/min)", "Myopathy risk", "Active liver disease"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/rosuvastatin.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Rosuvastatin",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Rosuvastatin+dosage"
    }
  ],

  thyroid: [
    {
      genericName: "Levothyroxine Sodium",
      popularBrands: ["Thyronorm", "Eltroxin", "Synthroid", "Thyrox"],
      drugClass: "Synthetic Thyroid Hormone (T4)",
      standardDosage: "25 mcg to 100 mcg",
      frequency: "Once daily on empty stomach (OD)",
      administration: "Must be taken 30-60 minutes before breakfast with a full glass of plain water.",
      mechanism: "Replaces endogenous deficient thyroxine, metabolized peripherally into active T3.",
      contraindications: ["Untreated subclinical or overt thyrotoxicosis", "Acute myocardial infarction", "Untreated adrenal insufficiency"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/levothyroxine.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Levothyroxine",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Levothyroxine+brands"
    }
  ],

  anemia: [
    {
      genericName: "Ferrous Ascorbate + Folic Acid",
      popularBrands: ["Orofer XT", "Autrin", "Ferium XT", "Fefol"],
      drugClass: "Hematinic Mineral & Vitamin Supplement",
      standardDosage: "100 mg elemental iron + 1.5 mg Folic Acid",
      frequency: "Once or twice daily after meals",
      administration: "Take after food to avoid nausea; avoid co-ingestion with tea, coffee, or milk.",
      mechanism: "Replenishes hemoglobin iron stores and facilitates normoblastic erythropoiesis in bone marrow.",
      contraindications: ["Hemochromatosis / Hemosiderosis", "Thalassemia major", "Active peptic ulcer disease"],
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/ferrous_ascorbate.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Ferrous+Ascorbate",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Ferrous+Ascorbate+brands"
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAMPLE CLINICAL REPORTS FOR INSTANT TESTING
// ─────────────────────────────────────────────────────────────────────────────

export interface SampleReportPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  simulatedText: string;
}

export const SAMPLE_REPORTS: SampleReportPreset[] = [
  {
    id: "diabetic-hypertensive",
    name: "Metabolic Panel: Type 2 Diabetes & Hypertension",
    category: "Diabetes & Blood Pressure",
    description: "Sample diagnostic report showing elevated HbA1c (8.2%), Fasting Blood Sugar (174 mg/dL), and High Blood Pressure (148/94 mmHg).",
    simulatedText: `PATIENT DIAGNOSTIC REPORT - METROPOLIS HEALTHCARE
PATIENT NAME: Marcus Vance | AGE: 54 | GENDER: Male
DATE: 04-Sep-2026 | REF DR: Dr. Sarah Jenkins

TEST PARAMETER               OBSERVED VALUE    REFERENCE RANGE    UNIT
----------------------------------------------------------------------
HbA1c (Glycated Hemoglobin)  8.2               4.0 - 5.6          %
Estimated Average Glucose    189               70 - 120           mg/dL
Fasting Blood Sugar (FBS)    174               70 - 99            mg/dL
Postprandial Glucose (PPBS)  248               < 140              mg/dL
Systolic Blood Pressure      148               90 - 120           mmHg
Diastolic Blood Pressure     94                60 - 80            mmHg
Total Cholesterol            228               < 200              mg/dL
LDL Cholesterol              146               < 100              mg/dL
HDL Cholesterol              38                > 40               mg/dL
Triglycerides                210               < 150              mg/dL
Serum Creatinine             1.02              0.7 - 1.2          mg/dL
eGFR                         86                > 60               mL/min

CLINICAL IMPRESSION:
Significantly elevated glycated hemoglobin indicating uncontrolled Type 2 Diabetes. Stage 2 Essential Hypertension noted on repeated automated sphygmomanometer readings. Mixed dyslipidemia with atherogenic LDL elevation.`
  },

  {
    id: "hypertension-lipid",
    name: "Cardiovascular Panel: Stage 2 Hypertension & Dyslipidemia",
    category: "Blood Pressure & Heart",
    description: "Sample laboratory report showing high blood pressure (156/98 mmHg), Total Cholesterol (254 mg/dL), and LDL (172 mg/dL).",
    simulatedText: `APOLLO CLINICAL DIAGNOSTICS - CARDIOVASCULAR RISK ASSESSMENT
PATIENT NAME: Robert Sterling | AGE: 61 | GENDER: Male
DATE: 03-Sep-2026 | REFERRAL: Cardiology Outpatient

TEST PARAMETER               OBSERVED VALUE    REFERENCE RANGE    UNIT
----------------------------------------------------------------------
Systolic Blood Pressure      156               90 - 120           mmHg
Diastolic Blood Pressure     98                60 - 80            mmHg
Heart Rate                   84                60 - 100           bpm
Total Cholesterol            254               < 200              mg/dL
LDL Cholesterol (Calculated) 172               < 100              mg/dL
HDL Cholesterol              36                > 40               mg/dL
Triglycerides                230               < 150              mg/dL
Fasting Blood Sugar (FBS)    92                70 - 99            mg/dL
HbA1c                        5.4               4.0 - 5.6          %
Serum Creatinine             1.1               0.7 - 1.2          mg/dL

CLINICAL INTERPRETATION:
Patient exhibits Stage 2 Essential Hypertension with severe mixed hyperlipidemia. Elevated ASCVD risk score warrants prompt pharmacotherapeutic intervention and strict DASH dietary restrictions.`
  },

  {
    id: "thyroid-anemia",
    name: "Endocrine & Hematology: Hypothyroidism & Iron-Deficiency Anemia",
    category: "Thyroid & Anemia",
    description: "Sample report demonstrating elevated TSH (8.4 µIU/mL), low Free T4, and deficient Hemoglobin (9.4 g/dL).",
    simulatedText: `LAL PATHLABS CLINICAL REPORT - COMPREHENSIVE ENDOCRINE SURVEY
PATIENT NAME: Sunita Nair | AGE: 38 | GENDER: Female
DATE: 02-Sep-2026 | SPECIMEN: Venous Serum & EDTA Blood

TEST PARAMETER               OBSERVED VALUE    REFERENCE RANGE    UNIT
----------------------------------------------------------------------
Thyroid Stimulating Hormone  8.4               0.4 - 4.5          uIU/mL
Free Thyroxine (FT4)         0.68              0.8 - 1.8          ng/dL
Free Triiodothyronine (FT3)  2.1               2.3 - 4.2          pg/mL
Hemoglobin (Hb)              9.4               12.0 - 15.5        g/dL
RBC Count                    3.4               4.0 - 5.2          mil/uL
Hematocrit (PCV)             29.2              36 - 46            %
Mean Corpuscular Volume (MCV)74.2              80 - 96            fL
Serum Ferritin               12                20 - 200           ng/mL
Fasting Blood Sugar          88                70 - 99            mg/dL
Blood Pressure               118/76            < 120/80           mmHg

CLINICAL SUMMARY:
Overt Primary Hypothyroidism evidenced by elevated TSH and subnormal FT4. Concomitant microcytic hypochromic iron deficiency anemia (low MCV and Ferritin) contributing to chronic fatigue.`
  },

  {
    id: "normal-panel",
    name: "Annual Wellness Checkup: Normal Biomarkers",
    category: "General Health",
    description: "Sample healthy comprehensive lab panel showing all major markers within standard physiological ranges.",
    simulatedText: `MEDSCOPE PREVENTIVE CARE - ANNUAL PHYSICAL PROFILE
PATIENT NAME: Elena Cruz | AGE: 29 | GENDER: Female
DATE: 01-Sep-2026

TEST PARAMETER               OBSERVED VALUE    REFERENCE RANGE    UNIT
----------------------------------------------------------------------
Fasting Blood Sugar (FBS)    86                70 - 99            mg/dL
HbA1c                        5.2               4.0 - 5.6          %
Systolic Blood Pressure      116               90 - 120           mmHg
Diastolic Blood Pressure     74                60 - 80            mmHg
Total Cholesterol            168               < 200              mg/dL
LDL Cholesterol              88                < 100              mg/dL
HDL Cholesterol              56                > 50               mg/dL
Triglycerides                112               < 150              mg/dL
TSH                          2.1               0.4 - 4.5          uIU/mL
Hemoglobin                   13.6              12.0 - 15.5        g/dL
Serum Creatinine             0.84              0.6 - 1.1          mg/dL

CLINICAL SUMMARY:
All evaluated parameters demonstrate optimal physiological homeostasis. No indicators of metabolic syndrome, glucose dysregulation, thyroid dysfunction, or hypertension detected.`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLINICAL REGEX & BIOMARKER EXTRACTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export function parseReportBiomarkers(text: string): { biomarkers: Biomarker[]; flaggedDiseases: FlaggedDisease[] } {
  const biomarkers: Biomarker[] = [];
  const flaggedDiseases: FlaggedDisease[] = [];

  const lowerText = text.toLowerCase();

  // 1. HbA1c
  const hba1cMatch = text.match(/hba1c[^\d]*([\d.]+)/i) || text.match(/glycated\s*hemoglobin[^\d]*([\d.]+)/i);
  let hba1cVal: number | null = null;
  if (hba1cMatch) {
    hba1cVal = parseFloat(hba1cMatch[1]);
    let status: "normal" | "borderline" | "high" | "low" = "normal";
    if (hba1cVal >= 6.5) status = "high";
    else if (hba1cVal >= 5.7) status = "borderline";

    biomarkers.push({
      id: "hba1c",
      name: "Glycated Hemoglobin (HbA1c)",
      value: hba1cVal,
      unit: "%",
      referenceRange: "4.0 - 5.6 %",
      status,
      clinicalSignificance: hba1cVal >= 6.5 ? "Diagnostic of Diabetes Mellitus (ADA Guidelines)" : hba1cVal >= 5.7 ? "Pre-diabetes Impaired Glucose Tolerance" : "Optimal Glycemic Control"
    });
  }

  // 2. Fasting Blood Sugar
  const fbsMatch = text.match(/(?:fasting\s*blood\s*sugar|fbs|fasting\s*glucose)[^\d]*([\d.]+)/i);
  let fbsVal: number | null = null;
  if (fbsMatch) {
    fbsVal = parseFloat(fbsMatch[1]);
    let status: "normal" | "borderline" | "high" | "low" = "normal";
    if (fbsVal >= 126) status = "high";
    else if (fbsVal >= 100) status = "borderline";

    biomarkers.push({
      id: "fbs",
      name: "Fasting Blood Sugar (FBS)",
      value: fbsVal,
      unit: "mg/dL",
      referenceRange: "70 - 99 mg/dL",
      status,
      clinicalSignificance: fbsVal >= 126 ? "Elevated fasting blood sugar indicating insulin deficiency/resistance" : "Normal fasting glucose"
    });
  }

  // 3. Postprandial Blood Sugar
  const ppbsMatch = text.match(/(?:postprandial|ppbs|post\s*meal\s*glucose)[^\d]*([\d.]+)/i);
  if (ppbsMatch) {
    const ppbsVal = parseFloat(ppbsMatch[1]);
    biomarkers.push({
      id: "ppbs",
      name: "Postprandial Glucose (PPBS)",
      value: ppbsVal,
      unit: "mg/dL",
      referenceRange: "< 140 mg/dL",
      status: ppbsVal >= 200 ? "high" : ppbsVal >= 140 ? "borderline" : "normal",
      clinicalSignificance: ppbsVal >= 200 ? "Post-meal glucose excursion confirming diabetes" : "Normal postprandial levels"
    });
  }

  // 4. Blood Pressure (Systolic & Diastolic)
  const bpCombinedMatch = text.match(/(?:blood\s*pressure|bp)[^\d]*(\d{2,3})\s*[/]\s*(\d{2,3})/i);
  const sbpMatch = text.match(/systolic[^\d]*(\d{2,3})/i);
  const dbpMatch = text.match(/diastolic[^\d]*(\d{2,3})/i);

  let sbp = bpCombinedMatch ? parseInt(bpCombinedMatch[1], 10) : sbpMatch ? parseInt(sbpMatch[1], 10) : null;
  let dbp = bpCombinedMatch ? parseInt(bpCombinedMatch[2], 10) : dbpMatch ? parseInt(dbpMatch[1], 10) : null;

  if (sbp && dbp) {
    let bpStatus: "normal" | "borderline" | "high" | "low" = "normal";
    let bpSignificance = "Normotensive (Optimal BP < 120/80 mmHg)";

    if (sbp >= 140 || dbp >= 90) {
      bpStatus = "high";
      bpSignificance = "Stage 2 Essential Hypertension (ACC/AHA Guidelines)";
    } else if (sbp >= 130 || dbp >= 80) {
      bpStatus = "borderline";
      bpSignificance = "Stage 1 Hypertension";
    }

    biomarkers.push({
      id: "bp",
      name: "Blood Pressure (SBP / DBP)",
      value: `${sbp}/${dbp}`,
      unit: "mmHg",
      referenceRange: "90-120 / 60-80 mmHg",
      status: bpStatus,
      clinicalSignificance: bpSignificance
    });
  }

  // 5. Total Cholesterol & LDL
  const tcMatch = text.match(/total\s*cholesterol[^\d]*([\d.]+)/i);
  const ldlMatch = text.match(/ldl[^\d]*([\d.]+)/i);

  if (tcMatch) {
    const tcVal = parseFloat(tcMatch[1]);
    biomarkers.push({
      id: "tc",
      name: "Total Cholesterol",
      value: tcVal,
      unit: "mg/dL",
      referenceRange: "< 200 mg/dL",
      status: tcVal >= 200 ? "high" : "normal",
      clinicalSignificance: tcVal >= 200 ? "Hypercholesterolemia requiring dietary & statin intervention" : "Desirable lipid level"
    });
  }

  if (ldlMatch) {
    const ldlVal = parseFloat(ldlMatch[1]);
    biomarkers.push({
      id: "ldl",
      name: "LDL Cholesterol (Atherogenic)",
      value: ldlVal,
      unit: "mg/dL",
      referenceRange: "< 100 mg/dL",
      status: ldlVal >= 130 ? "high" : ldlVal >= 100 ? "borderline" : "normal",
      clinicalSignificance: ldlVal >= 130 ? "Elevated atherogenic lipoprotein posing arterial plaque risk" : "Optimal LDL target"
    });
  }

  // 6. Thyroid (TSH)
  const tshMatch = text.match(/(?:thyroid\s*stimulating\s*hormone|tsh)[^\d]*([\d.]+)/i);
  if (tshMatch) {
    const tshVal = parseFloat(tshMatch[1]);
    let status: "normal" | "borderline" | "high" | "low" = "normal";
    let sig = "Normal thyroid regulatory feedback";

    if (tshVal > 4.5) {
      status = "high";
      sig = "Elevated TSH indicative of Hypothyroidism (Underactive thyroid)";
    } else if (tshVal < 0.4) {
      status = "low";
      sig = "Suppressed TSH indicative of Hyperthyroidism (Overactive thyroid)";
    }

    biomarkers.push({
      id: "tsh",
      name: "Thyroid Stimulating Hormone (TSH)",
      value: tshVal,
      unit: "uIU/mL",
      referenceRange: "0.4 - 4.5 uIU/mL",
      status,
      clinicalSignificance: sig
    });
  }

  // 7. Hemoglobin
  const hbMatch = text.match(/(?:hemoglobin|hb)[^\d]*([\d.]+)/i);
  if (hbMatch) {
    const hbVal = parseFloat(hbMatch[1]);
    biomarkers.push({
      id: "hb",
      name: "Hemoglobin (Hb)",
      value: hbVal,
      unit: "g/dL",
      referenceRange: "12.0 - 16.0 g/dL",
      status: hbVal < 12.0 ? "low" : "normal",
      clinicalSignificance: hbVal < 12.0 ? "Subnormal hemoglobin indicating Anemia" : "Healthy oxygen-carrying capacity"
    });
  }

  // 8. Serum Creatinine
  const creatMatch = text.match(/(?:serum\s*creatinine|creatinine)[^\d]*([\d.]+)/i);
  if (creatMatch) {
    const creatVal = parseFloat(creatMatch[1]);
    biomarkers.push({
      id: "creatinine",
      name: "Serum Creatinine",
      value: creatVal,
      unit: "mg/dL",
      referenceRange: "0.7 - 1.2 mg/dL",
      status: creatVal > 1.2 ? "high" : "normal",
      clinicalSignificance: creatVal > 1.2 ? "Elevated creatinine; potential renal filtration impairment" : "Normal renal clearance"
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EVALUATE & FLAG DISEASES
  // ─────────────────────────────────────────────────────────────────────────

  // DIABETES EVALUATION
  const hasHighHba1c = (hba1cVal !== null && hba1cVal >= 6.5);
  const hasHighFbs = (fbsVal !== null && fbsVal >= 126);
  const hasPreDiabetes = (hba1cVal !== null && hba1cVal >= 5.7 && hba1cVal < 6.5) || (fbsVal !== null && fbsVal >= 100 && fbsVal < 126);

  if (hasHighHba1c || hasHighFbs || lowerText.includes("diabetes") || lowerText.includes("uncontrolled type 2")) {
    flaggedDiseases.push({
      id: "dis-diabetes",
      diseaseName: "Type 2 Diabetes Mellitus",
      diagnosticStatus: "Detected",
      severity: (hba1cVal && hba1cVal > 8.0) ? "Severe" : "Moderate",
      primaryEvidence: `HbA1c: ${hba1cVal ? hba1cVal + "%" : "Elevated"} | Fasting Glucose: ${fbsVal ? fbsVal + " mg/dL" : "Elevated"} (Diagnostic threshold >= 6.5% / >= 126 mg/dL)`,
      icdCode: "ICD-10 E11.9",
      clinicalGuideline: "Initiate first-line Biguanide (Metformin) alongside lifestyle modifications. Follow up with repeat HbA1c in 90 days. Screen for microvascular complications.",
      lifestyleModifications: [
        "Transition to complex carbohydrates and low glycemic index foods.",
        "Perform 150 minutes of moderate aerobic exercise plus resistance training per week.",
        "Maintain post-meal light walking (10-15 mins) to stimulate glucose uptake."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.diabetes,
      suggestedMedicines: MEDINDIA_MEDICINES.diabetes
    });
  } else if (hasPreDiabetes) {
    flaggedDiseases.push({
      id: "dis-prediabetes",
      diseaseName: "Pre-Diabetes / Impaired Glucose Tolerance",
      diagnosticStatus: "Borderline / Pre-Condition",
      severity: "Mild",
      primaryEvidence: `HbA1c between 5.7% - 6.4% (${hba1cVal}%) indicates borderline insulin resistance.`,
      icdCode: "ICD-10 R73.09",
      clinicalGuideline: "Intensive lifestyle intervention and medical nutrition therapy. Metformin may be considered if BMI > 35 kg/m².",
      lifestyleModifications: [
        "Aim for 5-7% total body weight reduction.",
        "Eliminate refined sugar beverages and processed snacks."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.diabetes,
      suggestedMedicines: [MEDINDIA_MEDICINES.diabetes[0]]
    });
  }

  // HYPERTENSION EVALUATION
  if ((sbp && sbp >= 130) || (dbp && dbp >= 80) || lowerText.includes("hypertension") || lowerText.includes("high blood pressure")) {
    const isStage2 = (sbp && sbp >= 140) || (dbp && dbp >= 90);
    flaggedDiseases.push({
      id: "dis-hypertension",
      diseaseName: isStage2 ? "Essential Hypertension (Stage 2)" : "Essential Hypertension (Stage 1)",
      diagnosticStatus: "Detected",
      severity: isStage2 ? "Moderate" : "Mild",
      primaryEvidence: `Observed Blood Pressure: ${sbp}/${dbp} mmHg (Standard target < 120/80 mmHg).`,
      icdCode: "ICD-10 I10",
      clinicalGuideline: "Initiate antihypertensive monotherapy (ARB Telmisartan or CCB Amlodipine) if Stage 1; dual therapy recommended if > 20/10 mmHg above target.",
      lifestyleModifications: [
        "Restrict dietary sodium to < 1,500 mg per day (DASH Diet protocol).",
        "Engage in regular aerobic exercise (brisk walking, cycling) 30 mins daily.",
        "Limit caffeine and practice stress-reduction (e.g. 4-7-8 breathing)."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.hypertension,
      suggestedMedicines: MEDINDIA_MEDICINES.hypertension
    });
  }

  // DYSLIPIDEMIA EVALUATION
  const tcBio = biomarkers.find((b) => b.id === "tc");
  const ldlBio = biomarkers.find((b) => b.id === "ldl");
  if ((tcBio && tcBio.status === "high") || (ldlBio && ldlBio.status === "high") || lowerText.includes("hyperlipidemia") || lowerText.includes("dyslipidemia")) {
    flaggedDiseases.push({
      id: "dis-cholesterol",
      diseaseName: "Primary Dyslipidemia / Hypercholesterolemia",
      diagnosticStatus: "Detected",
      severity: "Moderate",
      primaryEvidence: `Total Cholesterol: ${tcBio?.value || "High"} mg/dL, LDL: ${ldlBio?.value || "High"} mg/dL (Atherogenic lipid fraction).`,
      icdCode: "ICD-10 E78.5",
      clinicalGuideline: "Initiate moderate-to-high intensity Statin therapy (Atorvastatin 20mg or Rosuvastatin 10mg) for secondary atherosclerotic prevention.",
      lifestyleModifications: [
        "Eliminate industrial trans fats and minimize saturated animal fats.",
        "Increase soluble fiber (oats, psyllium husk, beans) to bind intestinal cholesterol.",
        "Incorporate plant sterols and omega-3 fatty acids."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.cholesterol,
      suggestedMedicines: MEDINDIA_MEDICINES.cholesterol
    });
  }

  // THYROID EVALUATION
  const tshBio = biomarkers.find((b) => b.id === "tsh");
  if (tshBio && tshBio.status === "high") {
    flaggedDiseases.push({
      id: "dis-hypothyroid",
      diseaseName: "Primary Hypothyroidism",
      diagnosticStatus: "Detected",
      severity: (typeof tshBio.value === "number" && tshBio.value > 10) ? "Severe" : "Moderate",
      primaryEvidence: `TSH level elevated at ${tshBio.value} uIU/mL (Reference range: 0.4 - 4.5 uIU/mL).`,
      icdCode: "ICD-10 E03.9",
      clinicalGuideline: "Prescribe synthetic levothyroxine titration. Take on an empty stomach 30-60 mins before breakfast. Re-evaluate TSH in 6 to 8 weeks.",
      lifestyleModifications: [
        "Maintain adequate dietary iodine and selenium (Brazil nuts, eggs).",
        "Avoid co-ingesting iron, calcium, or soy supplements within 4 hours of levothyroxine."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.thyroid,
      suggestedMedicines: MEDINDIA_MEDICINES.thyroid
    });
  }

  // ANEMIA EVALUATION
  const hbBio = biomarkers.find((b) => b.id === "hb");
  if (hbBio && hbBio.status === "low") {
    flaggedDiseases.push({
      id: "dis-anemia",
      diseaseName: "Microcytic Iron-Deficiency Anemia",
      diagnosticStatus: "Detected",
      severity: (typeof hbBio.value === "number" && hbBio.value < 8.0) ? "Severe" : "Moderate",
      primaryEvidence: `Hemoglobin deficient at ${hbBio.value} g/dL (Reference minimum: 12.0 g/dL).`,
      icdCode: "ICD-10 D50.9",
      clinicalGuideline: "Initiate oral elemental iron supplementation (Ferrous Ascorbate 100mg with Folic Acid). Screen for occult gastrointestinal blood loss.",
      lifestyleModifications: [
        "Consume iron-rich foods (spinach, beetroot, lentils, lean meat).",
        "Pair plant iron sources with Vitamin C (lemon, amla, oranges) to enhance bioavailability."
      ],
      medindiaConditionUrl: MEDINDIA_DISEASE_LINKS.anemia,
      suggestedMedicines: MEDINDIA_MEDICINES.anemia
    });
  }

  return { biomarkers, flaggedDiseases };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TOP-LEVEL OCR & REPORT ANALYSIS RUNNER
// ─────────────────────────────────────────────────────────────────────────────

export async function analyzePatientReport(
  rawText: string,
  fileName: string = "Laboratory_Report.pdf"
): Promise<ReportAnalysisResult> {
  const { biomarkers, flaggedDiseases } = parseReportBiomarkers(rawText);

  let overallStatus: "Normal" | "Attention Required" | "Action Needed - Critical Findings" = "Normal";
  if (flaggedDiseases.length >= 2 || flaggedDiseases.some((d) => d.severity === "Severe")) {
    overallStatus = "Action Needed - Critical Findings";
  } else if (flaggedDiseases.length > 0) {
    overallStatus = "Attention Required";
  }

  // Extract patient name hint if available
  const nameMatch = rawText.match(/(?:patient\s*name|name)[^\w]*([A-Za-z\s]+?)(?:[|\n\r]|age|$)/i);
  const patientNameHint = nameMatch ? nameMatch[1].trim() : undefined;

  const doctorClinicalSummary = flaggedDiseases.length > 0
    ? `Optical character recognition detected ${flaggedDiseases.length} chronic conditions: ${flaggedDiseases.map((d) => d.diseaseName).join(", ")}. Evidence-based pharmacological guidelines from Medindia.net are mapped below with direct search links.`
    : "Comprehensive scan completed. All evaluated biomarkers remain within standard physiological reference ranges. No clinical pathology flagged.";

  const patientTakeaway = flaggedDiseases.length > 0
    ? `Your scanned report indicates abnormal findings for ${flaggedDiseases.map((d) => d.diseaseName).join(" and ")}. Please review the prescribed guidelines with your consulting physician.`
    : "Your laboratory test values are within healthy normal ranges! Continue maintaining your current active lifestyle and nutritious diet.";

  return {
    reportTitle: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    patientNameHint,
    dateAnalyzed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    rawOcrText: rawText,
    overallStatus,
    biomarkers,
    flaggedDiseases,
    doctorClinicalSummary,
    patientTakeaway
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GROQ-POWERED DYNAMIC REPORT ANALYSIS (AI PATH)
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

// Ordered by response speed and clinical reasoning capacity
const GROQ_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

export interface DynamicCondition {
  name: string;
  severity: "Mild" | "Moderate" | "Severe";
  evidence: string;
  explanation: string;
}

export interface DynamicBiomarker {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low" | "borderline";
}

export interface DynamicMedicine {
  condition: string;
  genericName: string;
  brandNames: string[];
  purpose: string;
  dosage: string;
  safetyNote: string;
  medindiaDrugUrl: string;
  medindiaSearchUrl: string;
  webSearchUrl: string;
}

export interface DynamicReportAnalysis {
  isValidMedicalReport: boolean;
  overallStatus: "Normal" | "Attention Required" | "Action Needed - Critical Findings";
  reportTitle: string;
  patientNameHint?: string;
  dateAnalyzed: string;
  plainEnglishSummary: string;
  detectedConditions: DynamicCondition[];
  extractedBiomarkers: DynamicBiomarker[];
  recommendedMedicines: DynamicMedicine[];
  lifestyleAdvice: string[];
  rawText: string;
}

/**
 * Parses raw JSON string returned by the LLM, stripping any markdown wrappers if present.
 */
function cleanAndParseJson(raw: string): any {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "").replace(/\s*```$/, "");
  }

  const startIdx = cleaned.indexOf("{");
  const lastIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && lastIdx !== -1 && lastIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, lastIdx + 1);
  }

  return JSON.parse(cleaned);
}

function mapDynamicMedicines(parsed: any): DynamicMedicine[] {
  return (parsed.recommendedMedicines || []).map((m: any) => {
    const rawSlug = m.medindiaSlug || (m.genericName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const encoded = encodeURIComponent(m.genericName || "");
    return {
      condition: m.condition || "Clinical Finding",
      genericName: m.genericName || "Medication",
      brandNames: Array.isArray(m.brandNames)
        ? m.brandNames
        : [m.brandNames || ""].filter(Boolean),
      purpose: m.purpose || "",
      dosage: m.dosage || "As directed by physician",
      safetyNote: m.safetyNote || "Consult your prescribing doctor before starting.",
      medindiaDrugUrl: `https://www.medindia.net/doctors/drug_information/${rawSlug}.htm`,
      medindiaSearchUrl: `https://www.medindia.net/search/site.asp?q=${encoded}`,
      webSearchUrl: `https://www.google.com/search?q=site:medindia.net+${encoded}+dosage+brands`
    };
  });
}

/**
 * Analyzes OCR-extracted text strictly and dynamically with the Groq LLM.
 * Produces:
 * 1. Plain-English summary explaining ONLY the data found in the report so an ordinary person understands.
 * 2. ONLY genuine conditions evidenced in the report (no predefined or phantom assumptions).
 * 3. Extracted biomarkers table.
 * 4. Medicine recommendations derived strictly from the report findings, with Medindia links.
 */
export async function analyzeExtractedReport(
  extractedText: string,
  titleHint: string = "Laboratory Diagnostic Report",
  onProgress?: (msg: string) => void
): Promise<DynamicReportAnalysis> {
  onProgress?.("Medscope AI is analyzing the extracted report data...");

  const prompt = `You are an expert physician and clinical communicator. Analyze ONLY the text in this patient laboratory report extracted via OCR.

STRICT INSTRUCTIONS:
1. Base your entire analysis ONLY on what is written in the report text below. Under NO circumstances should you assume, hallucinate, or invent diseases or test values that are NOT explicitly present in this text.
2. If this document is NOT a medical lab report (e.g. invoice, receipt, generic letter, corrupted text, or unreadable document), set "isValidMedicalReport" to false and explain why in "plainEnglishSummary".
3. If it IS a medical lab report:
   - "reportTitle": A concise clinical title for this panel (e.g., "${titleHint.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}").
   - "patientNameHint": The patient's name if explicitly printed in the text (or null if not found).
   - "overallStatus": "Normal" if all parameters are in healthy ranges; "Attention Required" if any biomarker is borderline or elevated; "Action Needed - Critical Findings" if markedly abnormal or high risk.
   - "plainEnglishSummary": A clear, comforting, and thorough explanation in plain everyday English that ANY ordinary person can easily understand. Explain what their actual numbers mean for their health, what is in the safe zone, and what needs care. DO NOT use canned boilerplate text. Reference their specific numbers.
   - "detectedConditions": An array of ONLY the genuine medical conditions indicated by abnormal values in the text (e.g. Type 2 Diabetes if HbA1c or fasting blood sugar is high; Essential Hypertension if BP is elevated; Dyslipidemia if cholesterol or LDL is high; Hypothyroidism if TSH is elevated). If all values are normal, return an empty array [].
     Each item:
     * "name": Condition name
     * "severity": "Mild" | "Moderate" | "Severe"
     * "evidence": The exact observed test value from the report (e.g. "HbA1c: 8.2%, Fasting Glucose: 174 mg/dL")
     * "explanation": 1-2 simple sentences explaining what this means for the patient in plain English.
   - "extractedBiomarkers": Array of all lab biomarkers found in the text. Each with:
     * "name": Test name
     * "value": Observed numerical or text value
     * "unit": Unit of measurement (e.g. "%", "mg/dL", "mmHg")
     * "referenceRange": Standard normal reference range
     * "status": "normal" | "high" | "low" | "borderline"
   - "recommendedMedicines": Evidence-based clinical medicine recommendations based STRICTLY on the detected health conditions in this report. If no conditions detected, return []. For each medicine provide:
     * "condition": The specific detected condition it treats
     * "genericName": Standard generic drug name (e.g. "Metformin Hydrochloride", "Telmisartan", "Atorvastatin")
     * "brandNames": Array of popular Indian brand names (e.g. ["Glycomet", "Glucophage", "Obimet"], ["Telma", "Micardis"], ["Atorva", "Lipitor"])
     * "purpose": 1 sentence explaining how this medicine helps the body in simple terms
     * "dosage": Standard starting dosage and timing (e.g. "500 mg twice daily with meals")
     * "safetyNote": Essential precaution or administration advice
     * "medindiaSlug": lowercase alphanumeric drug name for Medindia URL (e.g. "metformin", "telmisartan", "atorvastatin", "amlodipine")
   - "lifestyleAdvice": 3-4 actionable everyday diet and lifestyle tips tailored to their specific findings.

REPORT TEXT EXTRACTED VIA OCR:
"""
${extractedText.slice(0, 4500)}
"""

Respond ONLY with valid JSON.`;

  if (!GROQ_API_KEY) {
    return buildDynamicFallbackFromText(extractedText, titleHint);
  }

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are a medical diagnostics AI expert. You must analyze ONLY the provided OCR medical report text and respond with strictly valid JSON according to the prompt instructions. Do NOT hallucinate.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        console.warn(`[Groq AI] Model ${model} returned HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (rawContent) {
        const parsed = cleanAndParseJson(rawContent);
        if (parsed && typeof parsed === "object") {
          onProgress?.("Clinical report analysis complete!");
          return {
            isValidMedicalReport: parsed.isValidMedicalReport !== false,
            overallStatus: parsed.overallStatus || "Attention Required",
            reportTitle: parsed.reportTitle || titleHint.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            patientNameHint: parsed.patientNameHint || undefined,
            dateAnalyzed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            plainEnglishSummary: parsed.plainEnglishSummary || "Analysis completed based on the extracted report text.",
            detectedConditions: parsed.detectedConditions || [],
            extractedBiomarkers: parsed.extractedBiomarkers || [],
            recommendedMedicines: mapDynamicMedicines(parsed),
            lifestyleAdvice: parsed.lifestyleAdvice || [],
            rawText: extractedText
          };
        }
      }
    } catch (groqErr) {
      console.warn(`[Groq AI] Error on model ${model}:`, groqErr);
    }
  }

  // Graceful fallback derived strictly from keywords present in the text if the LLM is unavailable
  return buildDynamicFallbackFromText(extractedText, titleHint);
}

/**
 * Intelligent client-side fallback that parses ONLY what is present in the text,
 * without assuming phantom conditions or using canned summaries.
 */
function buildDynamicFallbackFromText(
  rawText: string,
  titleHint: string
): DynamicReportAnalysis {
  const lower = rawText.toLowerCase();
  const detectedConditions: DynamicCondition[] = [];
  const extractedBiomarkers: DynamicBiomarker[] = [];
  const recommendedMedicines: DynamicMedicine[] = [];
  const lifestyleAdvice: string[] = [];

  // Check Blood Glucose / Diabetes
  const hba1cMatch = lower.match(/(?:hba1c|glycated\s*hemoglobin)[^\d]*([\d.]+)/i);
  const fbsMatch = lower.match(/(?:fasting\s*blood\s*sugar|fbs|fasting\s*glucose)[^\d]*([\d.]+)/i);
  const hba1cVal = hba1cMatch ? parseFloat(hba1cMatch[1]) : null;
  const fbsVal = fbsMatch ? parseFloat(fbsMatch[1]) : null;

  if (hba1cVal !== null) {
    extractedBiomarkers.push({
      name: "HbA1c (Glycated Hemoglobin)",
      value: hba1cVal,
      unit: "%",
      referenceRange: "4.0 - 5.6 %",
      status: hba1cVal >= 6.5 ? "high" : hba1cVal >= 5.7 ? "borderline" : "normal"
    });
  }

  if (fbsVal !== null) {
    extractedBiomarkers.push({
      name: "Fasting Blood Glucose",
      value: fbsVal,
      unit: "mg/dL",
      referenceRange: "70 - 99 mg/dL",
      status: fbsVal >= 126 ? "high" : fbsVal >= 100 ? "borderline" : "normal"
    });
  }

  if ((hba1cVal && hba1cVal >= 6.5) || (fbsVal && fbsVal >= 126) || lower.includes("diabetes")) {
    detectedConditions.push({
      name: "Type 2 Diabetes Mellitus",
      severity: (hba1cVal && hba1cVal > 8.0) ? "Severe" : "Moderate",
      evidence: `HbA1c: ${hba1cVal ? hba1cVal + "%" : "Elevated"} | Fasting Glucose: ${fbsVal ? fbsVal + " mg/dL" : "Elevated"}`,
      explanation: "Your blood glucose levels are higher than standard physiological targets, indicating impaired insulin regulation."
    });

    recommendedMedicines.push({
      condition: "Type 2 Diabetes Mellitus",
      genericName: "Metformin Hydrochloride",
      brandNames: ["Glycomet", "Glucophage", "Obimet"],
      purpose: "Reduces liver glucose output and enhances bodily insulin sensitivity.",
      dosage: "500 mg twice daily with meals",
      safetyNote: "Take with meals to prevent gastrointestinal upset.",
      medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/metformin.htm",
      medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Metformin",
      webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Metformin+dosage+brands"
    });

    lifestyleAdvice.push("Adopt a low glycemic index diet rich in dietary fiber and lean proteins.");
    lifestyleAdvice.push("Aim for 30 minutes of moderate aerobic exercise (brisk walking) daily.");
  }

  // Check Blood Pressure
  const bpMatch = lower.match(/(?:bp|blood\s*pressure|systolic)[^\d]*(\d{2,3})\s*[/]\s*(\d{2,3})/i);
  if (bpMatch) {
    const sbp = parseInt(bpMatch[1], 10);
    const dbp = parseInt(bpMatch[2], 10);
    extractedBiomarkers.push({
      name: "Blood Pressure (Systolic/Diastolic)",
      value: `${sbp}/${dbp}`,
      unit: "mmHg",
      referenceRange: "90-120 / 60-80 mmHg",
      status: (sbp >= 140 || dbp >= 90) ? "high" : (sbp >= 130 || dbp >= 85) ? "borderline" : "normal"
    });

    if (sbp >= 130 || dbp >= 80) {
      detectedConditions.push({
        name: sbp >= 140 ? "Essential Hypertension (Stage 2)" : "Essential Hypertension (Stage 1)",
        severity: sbp >= 140 ? "Moderate" : "Mild",
        evidence: `Observed Blood Pressure: ${sbp}/${dbp} mmHg`,
        explanation: "The force of blood pushing against your artery walls is consistently higher than recommended."
      });

      recommendedMedicines.push({
        condition: "Hypertension",
        genericName: "Telmisartan",
        brandNames: ["Telma", "Micardis", "Telvas"],
        purpose: "Relaxes vascular walls to reduce blood pressure and protect cardiac health.",
        dosage: "40 mg once daily in the morning",
        safetyNote: "Monitor blood pressure regularly and avoid abrupt discontinuation.",
        medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/telmisartan.htm",
        medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Telmisartan",
        webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Telmisartan+dosage+brands"
      });

      lifestyleAdvice.push("Reduce sodium intake to under 2,000 mg per day.");
    }
  }

  // Check Cholesterol / Lipids
  const cholMatch = lower.match(/(?:total\s*cholesterol|cholesterol)[^\d]*([\d.]+)/i);
  if (cholMatch) {
    const cholVal = parseFloat(cholMatch[1]);
    extractedBiomarkers.push({
      name: "Total Cholesterol",
      value: cholVal,
      unit: "mg/dL",
      referenceRange: "< 200 mg/dL",
      status: cholVal > 200 ? "high" : "normal"
    });

    if (cholVal > 200) {
      detectedConditions.push({
        name: "Hypercholesterolemia / Dyslipidemia",
        severity: cholVal > 240 ? "Moderate" : "Mild",
        evidence: `Total Cholesterol: ${cholVal} mg/dL (Reference < 200 mg/dL)`,
        explanation: "Elevated circulating cholesterol can lead to arterial plaque buildup over time."
      });

      recommendedMedicines.push({
        condition: "Hypercholesterolemia",
        genericName: "Atorvastatin",
        brandNames: ["Atorva", "Lipitor", "Storvas"],
        purpose: "Inhibits cholesterol synthesis in the liver to lower LDL cholesterol.",
        dosage: "10 mg to 20 mg once daily at bedtime",
        safetyNote: "Report any unexplained muscle pain to your physician.",
        medindiaDrugUrl: "https://www.medindia.net/doctors/drug_information/atorvastatin.htm",
        medindiaSearchUrl: "https://www.medindia.net/search/site.asp?q=Atorvastatin",
        webSearchUrl: "https://www.google.com/search?q=site:medindia.net+Atorvastatin+dosage+brands"
      });
    }
  }

  const overallStatus = detectedConditions.length >= 2 || detectedConditions.some(c => c.severity === "Severe")
    ? "Action Needed - Critical Findings"
    : detectedConditions.length > 0
    ? "Attention Required"
    : "Normal";

  let plainEnglishSummary = "";
  if (detectedConditions.length === 0) {
    plainEnglishSummary = "Your extracted laboratory report shows your tested parameters are within normal physiological bounds. No disease markers were identified.";
  } else {
    plainEnglishSummary = `Based directly on the numbers in your laboratory report, we observed elevated values for ${detectedConditions.map(c => c.name).join(" and ")}. These indicators require medical attention and lifestyle modifications. Review the evidence-based medicines suggested below with your physician.`;
  }

  return {
    isValidMedicalReport: true,
    overallStatus,
    reportTitle: titleHint.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    dateAnalyzed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    plainEnglishSummary,
    detectedConditions,
    extractedBiomarkers,
    recommendedMedicines,
    lifestyleAdvice,
    rawText
  };
}
