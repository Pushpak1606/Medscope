import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Button } from "@/components/ui/button";
import { Sparkles, FileEdit, Save, CheckCircle2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const INITIAL_SOAP: SOAPNote = {
  subjective:
    "54-year-old male presents with 2-hour history of acute substernal chest tightness radiating to the left shoulder and neck. Onset occurred while walking up stairs. Associated with mild exertional dyspnea and diaphoresis. Patient states pain score is 7/10. Past history of Subacute Coronary Syndrome (2024). Known penicillin allergy.",
  objective:
    "Vitals: BP 148/92 mmHg, HR 94 bpm (regular sinus), SpO2 95% on room air, Temp 98.6°F. Physical Exam: Diaphoretic, mild distress. Cardiovascular: S1/S2 present, no murmurs/rubs. Lungs: Clear to auscultation bilaterally. Diagnostics: Troponin T 0.14 ng/mL (elevated). ECG V2-V4: 1.5mm ST elevation.",
  assessment:
    "1. Acute Anterior ST-Segment Elevation Myocardial Infarction (STEMI) / Subacute Coronary Syndrome.\n2. Essential Hypertension (Uncontrolled, current BP 148/92).\n3. Known Severe Anaphylactic Penicillin Allergy.",
  plan:
    "1. Administer Aspirin 325mg chewable + Clopidogrel 600mg loading dose immediately.\n2. Initiate Supplemental O2 via nasal cannula to maintain SpO2 > 96%.\n3. Emergent Interventional Cardiology Consult for Urgent Cardiac Catheterization / Primary PCI.\n4. Transfer to Cardiac Care Unit (CCU) telemetry bed.",
};

export const ConsultationNotesSOAP: React.FC = () => {
  const [soap, setSoap] = useState<SOAPNote>(INITIAL_SOAP);
  const [activeTab, setActiveTab] = useState<keyof SOAPNote>("subjective");

  const handleChange = (key: keyof SOAPNote, value: string) => {
    setSoap((prev) => ({ ...prev, [key]: value }));
  };

  const handleAiAutoFormat = () => {
    toast.success("AI has formatted and polished consultation SOAP notes.");
  };

  const handleSaveNote = () => {
    toast.success("Consultation SOAP Note saved and signed into EHR chart!");
  };

  return (
    <section aria-label="Current Consultation Notes SOAP Section">
      <DoctorGlassCard variant="glow" glowColor="primary" padding="lg" className="border-primary/20 space-y-6">
        <SectionHeader
          title="Current Consultation Notes (SOAP Editor)"
          subtitle="Structured clinical documentation tool with AI formatting assistant."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Exam Room 3B • Session Active
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAiAutoFormat}
                variant="outline"
                className="rounded-xl border-violet-500/30 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10 text-xs font-semibold gap-1.5 h-9"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                <span>AI Auto-Format</span>
              </Button>

              <Button
                onClick={handleSaveNote}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-1.5 h-9 shadow-md"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save & Sign Note</span>
              </Button>
            </div>
          }
        />

        {/* SOAP Section Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-3 overflow-x-auto">
          {(
            [
              { key: "subjective", label: "S — Subjective", desc: "Patient symptoms & history" },
              { key: "objective", label: "O — Objective", desc: "Vitals, labs & physical exam" },
              { key: "assessment", label: "A — Assessment", desc: "Clinical diagnosis & risk" },
              { key: "plan", label: "P — Plan", desc: "Treatment & interventions" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all text-left flex flex-col min-w-[140px] ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/40"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-normal ${activeTab === tab.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Active SOAP Textarea Editor Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="uppercase tracking-wider text-primary">
              Editing Section: {activeTab.toUpperCase()}
            </span>
            <span className="text-muted-foreground font-medium">
              Markdown & Voice Dictation Enabled
            </span>
          </div>

          <textarea
            value={soap[activeTab]}
            onChange={(e) => handleChange(activeTab, e.target.value)}
            rows={7}
            className="w-full rounded-2xl bg-card/60 border border-border/60 p-4 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 leading-relaxed resize-y selection:bg-primary/20"
            placeholder={`Enter ${activeTab} clinical details...`}
          />
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ConsultationNotesSOAP;
