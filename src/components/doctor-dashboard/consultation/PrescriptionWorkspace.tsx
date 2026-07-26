import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import { Pill, Plus, Trash2, Edit3, ShieldAlert, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useConsultation } from "@/context/ConsultationContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealTiming: "Before Meal" | "After Meal" | "With Food" | "At Bedtime" | "Anytime";
  instructions: string;
  warnings?: string;
  aiSafetyChecked?: boolean;
}

const INITIAL_MEDICATIONS: PrescriptionMedicine[] = [
  {
    id: "rx-1",
    name: "Aspirin (Chewable)",
    dosage: "325 mg",
    frequency: "Immediate Stat Dose",
    duration: "1 Day (Stat)",
    mealTiming: "Anytime",
    instructions: "Chew immediately for acute antiplatelet action.",
    warnings: "Take immediately upon chest pain evaluation.",
    aiSafetyChecked: true,
  },
  {
    id: "rx-2",
    name: "Clopidogrel Bisulfate",
    dosage: "600 mg Loading (then 75mg daily)",
    frequency: "Once Daily",
    duration: "12 Months",
    mealTiming: "After Meal",
    instructions: "Dual antiplatelet therapy for coronary stent protection.",
    warnings: "Black Box: Increased risk of bleeding. Avoid OTC NSAIDs.",
    aiSafetyChecked: true,
  },
  {
    id: "rx-3",
    name: "Atorvastatin Calcium",
    dosage: "80 mg",
    frequency: "Once Daily",
    duration: "Ongoing",
    mealTiming: "At Bedtime",
    instructions: "High-intensity statin therapy for plaque stabilization.",
    warnings: "Monitor ALT/AST liver enzymes annually.",
    aiSafetyChecked: true,
  },
  {
    id: "rx-4",
    name: "Nitroglycerin Sublingual",
    dosage: "0.4 mg",
    frequency: "PRN as needed",
    duration: "As needed",
    mealTiming: "Anytime",
    instructions: "Place 1 tablet under tongue every 5 mins for chest pain up to 3 doses.",
    warnings: "Contraindicated with PDE-5 inhibitors.",
    aiSafetyChecked: true,
  },
];

export const PrescriptionWorkspace: React.FC = () => {
  const { session, addPrescriptionItem, removePrescriptionItem, finalizePrescription } = useConsultation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "Once Daily",
    duration: "7 Days",
    mealTiming: "After Meal" as const,
    instructions: "",
    warnings: "",
  });

  const handleAddMedicine = () => {
    if (!newMed.name.trim() || !newMed.dosage.trim()) {
      toast.error("Please enter medicine name and dosage.");
      return;
    }

    const created = {
      id: `rx-${Date.now()}`,
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      duration: newMed.duration,
      mealTiming: newMed.mealTiming,
      instructions: newMed.instructions || "Take as directed by doctor.",
    };

    addPrescriptionItem(created);
    setIsAddOpen(false);
    setNewMed({
      name: "",
      dosage: "",
      frequency: "Once Daily",
      duration: "7 Days",
      mealTiming: "After Meal",
      instructions: "",
      warnings: "",
    });
  };

  const handleRemoveMedicine = (id: string, name: string) => {
    removePrescriptionItem(id);
  };

  const handleFinalize = () => {
    finalizePrescription();
  };

  const handleSignPrescription = () => {
    toast.success(`Prescription with ${session.prescriptionDraft.length} medications signed & sent to Pharmacy!`);
  };

  return (
    <section aria-label="Prescription Workspace Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Prescription Workspace (Rx Authoring)"
          subtitle="Interactive digital prescription authoring with AI drug interaction safety verification."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>{session.prescriptionDraft.length} Medicines Prescribed</span>
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddOpen(true)}
                variant="outline"
                className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-3.5 gap-1.5"
              >
                <Plus className="h-4 w-4 text-primary" />
                <span>+ Add Medicine</span>
              </Button>

              <Button
                onClick={handleFinalize}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finalize & Sync Rx</span>
              </Button>
            </div>
          }
        />

        {/* Prescription Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {session.prescriptionDraft.map((med) => (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary shrink-0" />
                      <span>{med.name}</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 mt-1 inline-block">
                      {med.dosage} • {med.frequency}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveMedicine(med.id, med.name)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-background/50 p-2.5 rounded-xl border border-border/40">
                  <div>
                    <span className="text-muted-foreground">Duration: </span>
                    <strong className="text-foreground">{med.duration}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timing: </span>
                    <strong className="text-foreground">{med.mealTiming}</strong>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 font-medium bg-background/40 p-2.5 rounded-xl border border-border/30">
                  <strong className="text-muted-foreground">Instructions: </strong>
                  {med.instructions}
                </p>

                {med.warnings && (
                  <p className="text-xs text-amber-500 font-medium flex items-center gap-1.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>{med.warnings}</span>
                  </p>
                )}
              </div>

              {med.aiSafetyChecked && (
                <div className="pt-2 text-xs font-semibold text-emerald-500 flex items-center gap-1.5 border-t border-border/40">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>AI Safety Checked: No fatal drug interactions</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Medicine Modal Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-lg bg-card/95 backdrop-blur-2xl border border-border/70 rounded-3xl p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <span>Add Prescription Medicine</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground">Medicine Name & Strength</label>
                <input
                  type="text"
                  placeholder="e.g. Clopidogrel 75mg"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-background border border-border/60 text-foreground font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 75 mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl bg-background border border-border/60 text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g. Once Daily"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl bg-background border border-border/60 text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Days"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl bg-background border border-border/60 text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground">Meal Timing</label>
                  <Select value={newMed.mealTiming} onValueChange={(val) => setNewMed({ ...newMed, mealTiming: val as any })}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Meal Timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Before Meal">Before Meal</SelectItem>
                      <SelectItem value="After Meal">After Meal</SelectItem>
                      <SelectItem value="With Food">With Food</SelectItem>
                      <SelectItem value="At Bedtime">At Bedtime</SelectItem>
                      <SelectItem value="Anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Instructions</label>
                <textarea
                  placeholder="Special instructions for patient..."
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-xl bg-background border border-border/60 text-foreground font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button onClick={() => setIsAddOpen(false)} variant="outline" className="rounded-xl text-xs h-9">
                Cancel
              </Button>
              <Button onClick={handleAddMedicine} className="rounded-xl bg-primary text-white text-xs h-9 px-4">
                Add to Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DoctorGlassCard>
    </section>
  );
};

export default PrescriptionWorkspace;
