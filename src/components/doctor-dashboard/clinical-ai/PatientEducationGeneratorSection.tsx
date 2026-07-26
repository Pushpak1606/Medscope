import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { BookOpen, Copy, Sparkles, Edit3, CheckCircle2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface EducationMaterial {
  id: string;
  category: "disease" | "medication" | "lifestyle" | "discharge";
  title: string;
  targetAudience: string;
  content: string;
}

const INITIAL_MATERIALS: EducationMaterial[] = [
  {
    id: "edu-1",
    category: "disease",
    title: "Understanding Coronary Artery Disease & Stents",
    targetAudience: "Patient & Family Caregivers",
    content: "Coronary Artery Disease occurs when plaque narrows blood flow to your heart muscle. Your stent holds the artery open. It is vital to take your blood thinners daily to keep the stent open.",
  },
  {
    id: "edu-2",
    category: "medication",
    title: "How to Take Your Blood Thinners Safely (DAPT Guide)",
    targetAudience: "Patient Rx Companion",
    content: "Take your Aspirin and Clopidogrel daily after your morning meal. Never skip a dose. Avoid over-the-counter pain medications like Ibuprofen or Naproxen as they increase bleeding risk.",
  },
  {
    id: "edu-3",
    category: "lifestyle",
    title: "Heart-Healthy Low-Sodium Diet & Rest Protocol",
    targetAudience: "Cardiac Rehab",
    content: "Keep daily salt intake below 2,000 mg (less than 1 teaspoon). Avoid processed meats and canned soups. Engage in 30 minutes of light walking daily as cleared by your cardiologist.",
  },
  {
    id: "edu-4",
    category: "discharge",
    title: "Post-PCI Emergency Warning Signs & Discharge Summary",
    targetAudience: "Emergency Protocol",
    content: "Seek emergency medical care immediately if you experience: sudden chest pressure lasting > 5 minutes, severe shortness of breath, bleeding from catheter site, or dizziness.",
  },
];

export const PatientEducationGeneratorSection: React.FC = () => {
  const [materials, setMaterials] = useState<EducationMaterial[]>(INITIAL_MATERIALS);

  const handleCopy = (title: string, text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied patient education material to clipboard: ${title}`);
  };

  const handleGeneratePdf = (title: string) => {
    toast.success(`Generated PDF handout for: ${title}`);
  };

  return (
    <section aria-label="Patient Education Generator Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Patient Education Generator (AI Communication)"
          subtitle="Generate clear, patient-friendly medical explanations, medication guides & discharge handouts."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span>4 Handouts Ready</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {mat.category.toUpperCase()} • {mat.targetAudience}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground">{mat.title}</h4>

                <div className="bg-background/50 p-3 rounded-xl border border-border/30">
                  <textarea
                    value={mat.content}
                    onChange={(e) => {
                      const updated = e.target.value;
                      setMaterials((prev) =>
                        prev.map((m) => (m.id === mat.id ? { ...m, content: updated } : m))
                      );
                    }}
                    rows={3}
                    className="w-full text-xs text-foreground/90 font-medium leading-relaxed bg-transparent border-none focus:outline-none resize-y"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  onClick={() => handleCopy(mat.title, mat.content)}
                  variant="outline"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 px-3 gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5 text-primary" />
                  <span>Copy Text</span>
                </Button>

                <Button
                  onClick={() => handleGeneratePdf(mat.title)}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8 px-3 gap-1.5 shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Generate PDF</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PatientEducationGeneratorSection;
