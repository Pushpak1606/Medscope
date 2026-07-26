import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Button } from "@/components/ui/button";
import { Sparkles, Save, FileText, CheckCircle2, Plus, Copy, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "sonner";

export interface SOAPFields {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const INITIAL_SOAP: SOAPFields = {
  subjective:
    "Patient Marcus Vance (54yo M) presents with acute 2-hour substernal chest tightness radiating to the left shoulder during exertion (climbing stairs). Associated with mild dyspnea and diaphoresis. Pain score 7/10. Past medical history of CAD (PCI 2024). Known severe penicillin allergy.",
  objective:
    "Vitals: BP 148/92 mmHg, HR 94 bpm (regular sinus), SpO2 95% on room air, Temp 98.6°F. Physical Exam: Diaphoretic, mild distress. Cardiac: S1/S2 present, no S3/S4 or rubs. Lungs: Clear bilaterally. Labs: Troponin T 0.14 ng/mL (elevated). 12-Lead ECG: ST elevation in V2-V4 (1.5mm).",
  assessment:
    "1. Acute Anterior ST-Segment Elevation Myocardial Infarction (STEMI) / ACS.\n2. Essential Hypertension (Uncontrolled, BP 148/92 mmHg).\n3. Known Severe Anaphylactic Penicillin Allergy.",
  plan:
    "1. Administer Aspirin 325mg chewable + Clopidogrel 600mg loading dose immediately.\n2. Oxygen therapy via nasal cannula to maintain SpO2 > 96%.\n3. Emergent Interventional Cardiology consult for Urgent Primary PCI.\n4. Transfer to Cardiac Care Unit (CCU) telemetry bed.",
};

const CLINICAL_PHRASES = [
  "Substernal chest pressure radiating to left shoulder",
  "Troponin T elevated at 0.14 ng/mL",
  "12-Lead ECG reveals anterior ST elevation (V2-V4)",
  "No peripheral edema or pulmonary rales",
  "Initiate dual antiplatelet therapy (DAPT)",
];

export const SOAPDocumentationEditor: React.FC = () => {
  const [soap, setSoap] = useState<SOAPFields>(INITIAL_SOAP);
  const [activeSection, setActiveSection] = useState<keyof SOAPFields>("subjective");

  const handleFieldChange = (field: keyof SOAPFields, val: string) => {
    setSoap((prev) => ({ ...prev, [field]: val }));
  };

  const handleInsertPhrase = (phrase: string) => {
    setSoap((prev) => ({
      ...prev,
      [activeSection]: `${prev[activeSection]}\n• ${phrase}`,
    }));
    toast.success(`Inserted phrase into ${activeSection.toUpperCase()} section.`);
  };

  const handleAiAutoFormat = () => {
    toast.success("AI clinical copilot formatted and structured the SOAP document!");
  };

  const handleSaveDoc = () => {
    toast.success("SOAP Clinical Documentation signed and committed to EHR chart.");
  };

  return (
    <section aria-label="Clinical Documentation Section">
      <DoctorGlassCard variant="glow" glowColor="primary" padding="lg" className="border-primary/30 space-y-6">
        <SectionHeader
          title="Clinical Documentation (SOAP Document Editor)"
          subtitle="Premium structured note editor powered by Medscope AI formatting & phrase shortcuts."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Active SOAP Note
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAiAutoFormat}
                variant="outline"
                className="rounded-xl border-violet-500/30 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10 text-xs font-semibold gap-1.5 h-9"
              >
                <Wand2 className="h-3.5 w-3.5 text-violet-500" />
                <span>AI Structure Note</span>
              </Button>

              <Button
                onClick={handleSaveDoc}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-1.5 h-9 shadow-md"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save & Sign Note</span>
              </Button>
            </div>
          }
        />

        {/* Quick Phrase Insert Shortcuts */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Quick Clinical Phrase Shortcuts:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CLINICAL_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => handleInsertPhrase(phrase)}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-card/80 hover:bg-card border border-border/50 text-foreground shrink-0 hover:border-primary/40 transition-all flex items-center gap-1.5"
              >
                <Plus className="h-3 w-3 text-primary" />
                <span>{phrase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SOAP Section Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-border/40 pb-3">
          {(
            [
              { key: "subjective", label: "Subjective (S)", desc: "Patient symptoms & history" },
              { key: "objective", label: "Objective (O)", desc: "Vitals, physical exam & labs" },
              { key: "assessment", label: "Assessment (A)", desc: "Differential diagnosis" },
              { key: "plan", label: "Plan (P)", desc: "Therapy & follow-up" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between ${
                activeSection === tab.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground border border-border/40"
              }`}
            >
              <span className="text-xs font-bold font-heading">{tab.label}</span>
              <span className={`text-[10px] ${activeSection === tab.key ? "text-white/80" : "text-muted-foreground"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="uppercase tracking-wider text-primary">
              Section Editor: {activeSection.toUpperCase()}
            </span>
            <span className="text-muted-foreground font-normal">Auto-Saved to Chart (08:44 AM)</span>
          </div>

          <textarea
            value={soap[activeSection]}
            onChange={(e) => handleFieldChange(activeSection, e.target.value)}
            rows={7}
            className="w-full rounded-2xl bg-card/80 border border-border/60 p-4 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 leading-relaxed resize-y selection:bg-primary/20 shadow-inner"
            placeholder={`Document ${activeSection} details...`}
          />
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default SOAPDocumentationEditor;
