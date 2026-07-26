import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Search, Plus, Trash2, Edit3, Pill, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface PrescriptionDraftItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  mealTiming: "Before Meal" | "After Meal" | "With Food" | "At Bedtime" | "Anytime";
  instructions: string;
}

const INITIAL_BUILDER_ITEMS: PrescriptionDraftItem[] = [
  {
    id: "b-1",
    name: "Clopidogrel Bisulfate",
    dosage: "75 mg",
    frequency: "Once Daily",
    duration: "12 Months",
    mealTiming: "After Meal",
    instructions: "Dual antiplatelet therapy for coronary stent protection.",
  },
  {
    id: "b-2",
    name: "Atorvastatin Calcium",
    dosage: "80 mg",
    frequency: "Once Daily",
    duration: "Ongoing",
    mealTiming: "At Bedtime",
    instructions: "High-intensity statin therapy for plaque stabilization.",
  },
];

export const PrescriptionBuilderWidget: React.FC = () => {
  const [items, setItems] = useState<PrescriptionDraftItem[]>(INITIAL_BUILDER_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "10 mg",
    frequency: "Once Daily",
    duration: "14 Days",
    mealTiming: "After Meal" as const,
    instructions: "Take with water as directed.",
  });

  const handleAddItem = () => {
    if (!searchTerm.trim() && !newMed.name.trim()) {
      toast.error("Please enter a medicine name.");
      return;
    }

    const added: PrescriptionDraftItem = {
      id: `b-${Date.now()}`,
      name: newMed.name || searchTerm,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      duration: newMed.duration,
      mealTiming: newMed.mealTiming,
      instructions: newMed.instructions,
    };

    setItems((prev) => [...prev, added]);
    setSearchTerm("");
    setNewMed({
      name: "",
      dosage: "10 mg",
      frequency: "Once Daily",
      duration: "14 Days",
      mealTiming: "After Meal",
      instructions: "Take with water as directed.",
    });
    toast.success(`Added ${added.name} to prescription draft.`);
  };

  const handleRemoveItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Removed ${name} from prescription draft.`);
  };

  const handleItemChange = (id: string, field: keyof PrescriptionDraftItem, val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  return (
    <section aria-label="Prescription Builder Section">
      <DoctorGlassCard variant="glow" glowColor="primary" padding="lg" className="border-primary/30 space-y-6">
        <SectionHeader
          title="Prescription Builder (Interactive Rx Composer)"
          subtitle="Compose, edit, and fine-tune patient prescription parameters before final authorization."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {items.length} Draft Items
            </span>
          }
        />

        {/* Medicine Search & Quick Add Bar */}
        <div className="p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Search & Compose New Prescription Item:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drug database (e.g., Lisinopril, Metformin)..."
                value={newMed.name || searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setNewMed({ ...newMed, name: e.target.value });
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Dosage (e.g. 75mg)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <Select value={newMed.frequency} onValueChange={(val) => setNewMed({ ...newMed, frequency: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once Daily">Once Daily</SelectItem>
                  <SelectItem value="Twice Daily (BID)">Twice Daily (BID)</SelectItem>
                  <SelectItem value="Thrice Daily (TID)">Thrice Daily (TID)</SelectItem>
                  <SelectItem value="PRN As Needed">PRN As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Select value={newMed.mealTiming} onValueChange={(val) => setNewMed({ ...newMed, mealTiming: val as any })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Meal Timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="After Meal">After Meal</SelectItem>
                  <SelectItem value="Before Meal">Before Meal</SelectItem>
                  <SelectItem value="With Food">With Food</SelectItem>
                  <SelectItem value="At Bedtime">At Bedtime</SelectItem>
                  <SelectItem value="Anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Button
                onClick={handleAddItem}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 gap-1.5 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Item</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Editable Prescription Draft Cards */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card/70 border border-border/60 backdrop-blur-xl space-y-4 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary shrink-0" />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                    className="text-base font-bold font-heading text-foreground bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Editable Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Dosage</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(item.id, "dosage", e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-background/60 border border-border/40 font-semibold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(item.id, "frequency", e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-background/60 border border-border/40 font-semibold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Duration</label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => handleItemChange(item.id, "duration", e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-background/60 border border-border/40 font-semibold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Meal Timing</label>
                  <Select value={item.mealTiming} onValueChange={(val) => handleItemChange(item.id, "mealTiming", val)}>
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
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Instructions for Patient</label>
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => handleItemChange(item.id, "instructions", e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-background/60 border border-border/40 font-medium text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PrescriptionBuilderWidget;
