import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { CheckCircle2, XCircle, Edit3, Sparkles, BrainCircuit, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface TreatmentDraftCard {
  id: string;
  patientName: string;
  suggestedTreatment: string;
  reasoning: string;
  alternativeOptions: string;
  doctorNotes: string;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_DRAFTS: TreatmentDraftCard[] = [
  {
    id: "draft-1",
    patientName: "Marcus Vance",
    suggestedTreatment: "Dual Antiplatelet Therapy (DAPT): Aspirin 325mg chewable + Clopidogrel 600mg loading dose immediately.",
    reasoning: "Class I ACC/AHA STEMI protocol recommendation to prevent acute coronary stent thrombosis post-presentation.",
    alternativeOptions: "Ticagrelor 90mg BID if Clopidogrel resistance or CYP2C19 loss-of-function allele is detected.",
    doctorNotes: "Approved for immediate ED administration upon bed arrival.",
    status: "pending",
  },
  {
    id: "draft-2",
    patientName: "Eleanor Vance",
    suggestedTreatment: "Warfarin dosage reduction from 5mg to 3.5mg daily + INR repeat in 72 hours.",
    reasoning: "Mitigate severe INR elevation caused by Amiodarone co-prescription CYP2C9 metabolic inhibition.",
    alternativeOptions: "Transition to DOAC (Apixaban 5mg BID) if INR remains volatile.",
    doctorNotes: "Review INR trend after 3 days.",
    status: "pending",
  },
];

export const TreatmentDraftsSection: React.FC = () => {
  const [drafts, setDrafts] = useState<TreatmentDraftCard[]>(INITIAL_DRAFTS);

  const handleNotesChange = (id: string, text: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, doctorNotes: text } : d))
    );
  };

  const handleApprove = (id: string, treatment: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d))
    );
    toast.success(`Treatment plan approved: ${treatment}`);
  };

  const handleReject = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "rejected" } : d))
    );
    toast.info("Treatment recommendation rejected.");
  };

  return (
    <section aria-label="Treatment Drafts Section">
      <DoctorGlassCard variant="glow" glowColor="primary" padding="lg" className="border-primary/30 space-y-6">
        <SectionHeader
          title="AI Treatment Plan Drafts (Review & Approve)"
          subtitle="Editable AI-generated treatment recommendations for practitioner review, modification & final sign-off."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {drafts.filter((d) => d.status === "pending").length} Drafts Awaiting Sign-off
            </span>
          }
        />

        <div className="space-y-5">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className={`p-5 rounded-3xl border backdrop-blur-xl transition-all duration-200 space-y-4 ${
                draft.status === "approved"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : draft.status === "rejected"
                  ? "bg-rose-500/10 border-rose-500/30 opacity-60"
                  : "bg-card/70 border-border/60 hover:border-primary/40 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <BrainCircuit className="h-4 w-4" />
                  <span>Suggested Treatment • Patient: {draft.patientName}</span>
                </span>

                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    draft.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
                      : draft.status === "rejected"
                      ? "bg-rose-500/20 text-rose-500 border-rose-500/40"
                      : "bg-amber-500/20 text-amber-500 border-amber-500/40"
                  }`}
                >
                  {draft.status.toUpperCase()}
                </span>
              </div>

              {/* Treatment & Reasoning Grid */}
              <div className="space-y-3 text-xs">
                <div className="bg-background/50 p-3.5 rounded-2xl border border-border/40 space-y-1">
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Suggested Treatment:
                  </span>
                  <p className="text-foreground font-semibold text-sm leading-relaxed">{draft.suggestedTreatment}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-card/60 p-3.5 rounded-2xl border border-border/40 space-y-1">
                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Clinical Reasoning:</span>
                    <p className="text-foreground/90 font-medium leading-relaxed">{draft.reasoning}</p>
                  </div>

                  <div className="bg-card/60 p-3.5 rounded-2xl border border-border/40 space-y-1">
                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Alternative Options:</span>
                    <p className="text-foreground/90 font-medium leading-relaxed">{draft.alternativeOptions}</p>
                  </div>
                </div>

                {/* Doctor Notes Input */}
                <div className="space-y-1">
                  <label className="font-bold text-foreground uppercase text-[10px] flex items-center gap-1">
                    <Edit3 className="h-3 w-3 text-primary" /> Doctor Modifications & Clinical Notes:
                  </label>
                  <textarea
                    value={draft.doctorNotes}
                    onChange={(e) => handleNotesChange(draft.id, e.target.value)}
                    rows={2}
                    className="w-full rounded-xl bg-background/60 border border-border/50 p-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                    placeholder="Add clinical notes or adjustments..."
                  />
                </div>
              </div>

              {/* Decision Action Buttons */}
              {draft.status === "pending" && (
                <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-2.5">
                  <Button
                    onClick={() => handleReject(draft.id)}
                    variant="outline"
                    className="rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold h-9 px-4 gap-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Recommendation</span>
                  </Button>

                  <Button
                    onClick={() => handleApprove(draft.id, draft.suggestedTreatment)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-5 gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Add to Chart</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default TreatmentDraftsSection;
