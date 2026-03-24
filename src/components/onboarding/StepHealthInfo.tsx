import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface StepHealthInfoProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const conditionOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Thyroid",
  "Heart condition",
  "Arthritis",
  "PCOS/PCOD",
  "None",
];

const StepHealthInfo = ({ data, onChange }: StepHealthInfoProps) => {
  const conditions: string[] = data.conditions || [];

  const toggleCondition = (condition: string) => {
    if (condition === "None") {
      onChange("conditions", ["None"]);
      return;
    }
    const filtered = conditions.filter((c: string) => c !== "None");
    if (filtered.includes(condition)) {
      onChange("conditions", filtered.filter((c: string) => c !== condition));
    } else {
      onChange("conditions", [...filtered, condition]);
    }
  };

  return (
    <div className="space-y-7">
      {/* Existing conditions */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">
          Do you have any existing medical conditions?
        </Label>
        <div className="flex flex-wrap gap-2.5">
          {conditionOptions.map((cond) => {
            const isActive = conditions.includes(cond);
            return (
              <button
                key={cond}
                type="button"
                onClick={() => toggleCondition(cond)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background/50 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cond}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Select all that apply, or choose "None".</p>
      </div>

      {/* Current medications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground/80">
            Are you currently taking any medications?
          </Label>
          <Switch
            checked={data.hasMedications || false}
            onCheckedChange={(v) => onChange("hasMedications", v)}
          />
        </div>
        {data.hasMedications && (
          <Textarea
            placeholder="List your current medications..."
            value={data.medications || ""}
            onChange={(e) => onChange("medications", e.target.value)}
            className="min-h-[80px] bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl transition-all"
          />
        )}
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground/80">
            Do you have any allergies?
          </Label>
          <Switch
            checked={data.hasAllergies || false}
            onCheckedChange={(v) => onChange("hasAllergies", v)}
          />
        </div>
        {data.hasAllergies && (
          <Textarea
            placeholder="e.g., Penicillin, Peanuts, Dust..."
            value={data.allergies || ""}
            onChange={(e) => onChange("allergies", e.target.value)}
            className="min-h-[80px] bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl transition-all"
          />
        )}
      </div>

      {/* Past surgeries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground/80">
            Any major surgeries in the past?
          </Label>
          <Switch
            checked={data.hasSurgeries || false}
            onCheckedChange={(v) => onChange("hasSurgeries", v)}
          />
        </div>
        {data.hasSurgeries && (
          <Textarea
            placeholder="Briefly describe past surgeries..."
            value={data.surgeries || ""}
            onChange={(e) => onChange("surgeries", e.target.value)}
            className="min-h-[80px] bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl transition-all"
          />
        )}
      </div>

      {/* Family history */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground/80">
          Family medical history <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          placeholder="e.g., Diabetes runs in the family..."
          value={data.familyHistory || ""}
          onChange={(e) => onChange("familyHistory", e.target.value)}
          className="min-h-[80px] bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl transition-all"
        />
        <p className="text-xs text-muted-foreground">Helps us better understand potential health patterns.</p>
      </div>
    </div>
  );
};

export default StepHealthInfo;
