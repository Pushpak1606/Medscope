import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { 
  Sparkles, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Globe, 
  Search, 
  ExternalLink,
  Activity,
  HeartPulse,
  Droplet
} from "lucide-react";
import { toast } from "sonner";
import { 
  MEDINDIA_MEDICINES, 
  MEDINDIA_DISEASE_LINKS, 
  MEDINDIA_BASE_URL, 
  MedindiaMedicine 
} from "@/services/reportAnalysisService";

export interface PrescribingSuggestion {
  id: string;
  category: "suggested" | "alternative" | "contraindication" | "reasoning";
  title: string;
  drugName?: string;
  rationale: string;
  actionText: string;
}

const MOCK_SUGGESTIONS: PrescribingSuggestion[] = [
  {
    id: "sug-1",
    category: "suggested",
    title: "AI Primary Recommendation: Dual Antiplatelet Therapy",
    drugName: "Clopidogrel 75mg Daily + Aspirin 81mg Daily",
    rationale: "Class I ACC/AHA recommendation post-coronary stent & ACS presentation to prevent acute stent thrombosis.",
    actionText: "+ Add DAPT Regimen to Draft",
  },
  {
    id: "sug-2",
    category: "alternative",
    title: "Second-Line Alternative Option: Ticagrelor",
    drugName: "Ticagrelor 90mg Twice Daily",
    rationale: "Consider Ticagrelor if patient exhibits resistance or poor response to Clopidogrel (CYP2C19 loss-of-function allele).",
    actionText: "Switch to Ticagrelor",
  },
  {
    id: "sug-3",
    category: "contraindication",
    title: "Contraindication Alert: Penicillin Antibiotic Class",
    drugName: "Amoxicillin / Penicillin V / Ampicillin",
    rationale: "Patient profile flags severe anaphylactic reaction to Penicillin. Use Azithromycin or Ciprofloxacin if antibiotic needed.",
    actionText: "Flag Penicillin Class as Contraindicated",
  },
  {
    id: "sug-4",
    category: "reasoning",
    title: "Clinical Reasoning: High-Intensity Statin Benefit",
    drugName: "Atorvastatin 80mg Daily",
    rationale: "Increasing Atorvastatin from 40mg to 80mg aims for >50% LDL reduction to achieve target LDL < 50 mg/dL for secondary prevention.",
    actionText: "Apply High-Statin Protocol",
  },
];

const categoryStyles = {
  suggested: {
    cardBg: "bg-emerald-500/10 border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    badgeText: "PRIMARY SUGGESTION",
  },
  alternative: {
    cardBg: "bg-blue-500/10 border-blue-500/30",
    iconBg: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    badgeText: "SECOND-LINE ALTERNATIVE",
  },
  contraindication: {
    cardBg: "bg-rose-500/10 border-rose-500/30",
    iconBg: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    badgeText: "CONTRAINDICATION FLAG",
  },
  reasoning: {
    cardBg: "bg-violet-500/10 border-violet-500/30",
    iconBg: "bg-violet-500/20 text-violet-500 border-violet-500/30",
    badgeText: "CLINICAL RATIONALE",
  },
};

const DISEASE_OPTIONS = [
  { key: "diabetes", label: "Type 2 Diabetes", icon: Droplet, hint: "HbA1c >= 6.5%, FBS >= 126 mg/dL" },
  { key: "hypertension", label: "High Blood Pressure", icon: HeartPulse, hint: "BP >= 130/80 mmHg" },
  { key: "cholesterol", label: "Dyslipidemia / Lipids", icon: Activity, hint: "Total Chol > 200, LDL > 130 mg/dL" },
  { key: "thyroid", label: "Hypothyroidism", icon: ShieldAlert, hint: "TSH > 4.5 µIU/mL" },
  { key: "anemia", label: "Iron-Deficiency Anemia", icon: AlertTriangle, hint: "Hb < 12.0 g/dL" },
];

export const ClinicalAiPrescribingSupport: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState<string>("diabetes");

  const handleApplySuggestion = (action: string) => {
    toast.success(`Applied to prescription draft: ${action}`);
  };

  const currentDiseaseMeds: MedindiaMedicine[] = MEDINDIA_MEDICINES[selectedDisease] || [];
  const currentDiseaseLink: string = MEDINDIA_DISEASE_LINKS[selectedDisease] || MEDINDIA_BASE_URL;

  return (
    <section aria-label="Clinical AI Prescribing Support Section" className="space-y-6">
      {/* 1. SOURCED MEDINDIA DISEASE-BASED PRESCRIBING GUIDE */}
      <DoctorGlassCard
        variant="glow"
        glowColor="cyan"
        padding="lg"
        className="border-emerald-500/30 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            title="Disease-Based Prescribing Assistant (Medindia.net)"
            subtitle="Clinically validated medications, Indian brand equivalents, and direct pharmacology monographs sourced from https://www.medindia.net/."
            badge={
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Medindia Verified</span>
              </span>
            }
          />

          <a
            href={MEDINDIA_BASE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Open Medindia Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Disease Selection Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
          {DISEASE_OPTIONS.map((dis) => {
            const Icon = dis.icon;
            const isSelected = selectedDisease === dis.key;
            return (
              <button
                key={dis.key}
                onClick={() => setSelectedDisease(dis.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{dis.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Disease Header with direct Medindia Link */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/20 rounded-xl border border-border/40">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-foreground">Active Clinical Indication:</span>
            <span className="text-primary font-bold">
              {DISEASE_OPTIONS.find((d) => d.key === selectedDisease)?.label}
            </span>
            <span className="text-muted-foreground">
              ({DISEASE_OPTIONS.find((d) => d.key === selectedDisease)?.hint})
            </span>
          </div>

          <a
            href={currentDiseaseLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Medindia Clinical Protocol</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Medindia Prescribing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDiseaseMeds.map((med, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black font-heading text-foreground">
                      {med.genericName}
                    </h4>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10 inline-block mt-0.5">
                      {med.drugClass}
                    </span>
                  </div>
                </div>

                {/* Popular Brands */}
                <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-lg">
                  <span className="font-bold text-foreground">Indian Brand Names: </span>
                  {med.popularBrands.join(", ")}
                </div>

                {/* Dosage & Frequency */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-background/50 p-2.5 rounded-xl border border-border/40">
                  <div>
                    <span className="text-muted-foreground text-[10px] font-bold uppercase block">Dosage</span>
                    <span className="font-bold text-foreground">{med.standardDosage}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] font-bold uppercase block">Timing</span>
                    <span className="font-bold text-foreground">{med.frequency}</span>
                  </div>
                </div>

                {/* Administration */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">Administration: </span>
                  {med.administration}
                </p>

                {/* Mechanism */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">Mechanism: </span>
                  {med.mechanism}
                </p>

                {/* Contraindications */}
                {med.contraindications.length > 0 && (
                  <div className="text-[10px] text-rose-500 font-semibold flex items-start gap-1.5 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Contraindications: {med.contraindications.join(" • ")}</span>
                  </div>
                )}
              </div>

              {/* Links & Prescription Draft Button */}
              <div className="pt-3 border-t border-border/40 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={med.medindiaDrugUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors flex items-center gap-1 border border-emerald-500/30"
                  >
                    <Globe className="h-3 w-3" />
                    <span>Medindia Monograph</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>

                  <a
                    href={med.medindiaSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-muted/60 text-foreground hover:bg-muted transition-colors flex items-center gap-1 border border-border/50"
                  >
                    <Search className="h-3 w-3" />
                    <span>Search Medindia</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>

                  <a
                    href={med.webSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 transition-colors flex items-center gap-1 border border-blue-500/30"
                  >
                    <Search className="h-3 w-3" />
                    <span>Web Search</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                <button
                  onClick={() => handleApplySuggestion(`${med.genericName} (${med.standardDosage})`)}
                  className="w-full text-xs font-bold py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-1.5"
                >
                  <Pill className="h-3.5 w-3.5" />
                  <span>+ Prescribe {med.genericName.split(" ")[0]} to Draft</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>

      {/* 2. GENERAL AI CLINICAL REASONING & ALERTS */}
      <DoctorGlassCard
        variant="glow"
        glowColor="violet"
        padding="lg"
        className="border-violet-500/30 space-y-6"
      >
        <SectionHeader
          title="Clinical Safety & Interaction Alerts"
          subtitle="Drug interaction warnings, contraindication screening, and secondary therapy alerts."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>Safety Engine</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_SUGGESTIONS.map((item) => {
            const style = categoryStyles[item.category];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-3 ${style.cardBg}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {style.badgeText}
                    </span>
                    {item.category === "contraindication" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40">
                        CRITICAL SAFETY
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-heading text-foreground">{item.title}</h4>

                  {item.drugName && (
                    <div className="text-xs font-semibold text-primary flex items-center gap-1.5 bg-background/60 p-2 rounded-xl border border-border/40">
                      <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.drugName}</span>
                    </div>
                  )}

                  <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/30 p-2.5 rounded-xl border border-border/30">
                    {item.rationale}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <button
                    onClick={() => handleApplySuggestion(item.title)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ClinicalAiPrescribingSupport;
