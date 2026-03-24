import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Dumbbell, Moon, Brain, Pill, Stethoscope, Apple } from "lucide-react";

interface StepLifestyleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const radioCardOptions = (
  label: string,
  field: string,
  options: { value: string; label: string; emoji?: string }[],
  data: Record<string, any>,
  onChange: (f: string, v: any) => void
) => (
  <div className="space-y-3">
    <Label className="text-sm font-semibold text-foreground/80">{label}</Label>
    <div className="grid grid-cols-3 gap-2.5">
      {options.map((opt) => {
        const isActive = data[field] === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(field, opt.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const wellnessInterests = [
  { value: "nutrition", label: "Nutrition suggestions", icon: Apple },
  { value: "exercise", label: "Exercise plans", icon: Dumbbell },
  { value: "mental", label: "Mental wellness", icon: Brain },
  { value: "reminders", label: "Medicine reminders", icon: Pill },
  { value: "consultations", label: "Doctor consultations", icon: Stethoscope },
];

const StepLifestyle = ({ data, onChange }: StepLifestyleProps) => {
  const interests: string[] = data.wellnessInterests || [];

  const toggleInterest = (value: string) => {
    if (interests.includes(value)) {
      onChange("wellnessInterests", interests.filter((i) => i !== value));
    } else {
      onChange("wellnessInterests", [...interests, value]);
    }
  };

  return (
    <div className="space-y-7">
      {radioCardOptions("Activity level", "activityLevel", [
        { value: "low", label: "Low", emoji: "🧘" },
        { value: "moderate", label: "Moderate", emoji: "🚶" },
        { value: "active", label: "Active", emoji: "🏃" },
      ], data, onChange)}

      {radioCardOptions("Sleep quality", "sleepQuality", [
        { value: "poor", label: "Poor", emoji: "😴" },
        { value: "average", label: "Average", emoji: "😐" },
        { value: "good", label: "Good", emoji: "😊" },
      ], data, onChange)}

      {radioCardOptions("Stress level", "stressLevel", [
        { value: "low", label: "Low", emoji: "😌" },
        { value: "moderate", label: "Moderate", emoji: "😕" },
        { value: "high", label: "High", emoji: "😰" },
      ], data, onChange)}

      {/* Water intake */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground/80">
          Daily water intake
        </Label>
        <Select value={data.waterIntake || ""} onValueChange={(v) => onChange("waterIntake", v)}>
          <SelectTrigger className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl">
            <SelectValue placeholder="Select intake" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-4">Less than 4 glasses</SelectItem>
            <SelectItem value="4-6">4–6 glasses</SelectItem>
            <SelectItem value="6-8">6–8 glasses</SelectItem>
            <SelectItem value="more-8">More than 8 glasses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Diet preference */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Food preference</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
            { value: "non-vegetarian", label: "Non-veg", emoji: "🍗" },
            { value: "vegan", label: "Vegan", emoji: "🌱" },
            { value: "mixed", label: "Mixed", emoji: "🍽️" },
          ].map((opt) => {
            const isActive = data.diet === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("diet", opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Smoking / Alcohol */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
          <Label className="text-sm font-semibold text-foreground/80">Do you smoke?</Label>
          <Switch
            checked={data.smokes || false}
            onCheckedChange={(v) => onChange("smokes", v)}
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
          <Label className="text-sm font-semibold text-foreground/80">Consume alcohol?</Label>
          <Switch
            checked={data.alcohol || false}
            onCheckedChange={(v) => onChange("alcohol", v)}
          />
        </div>
      </div>

      {/* Wellness interests */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">
          What are you most interested in?
        </Label>
        <div className="space-y-2.5">
          {wellnessInterests.map((item) => (
            <label
              key={item.value}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                interests.includes(item.value)
                  ? "bg-primary/10 border-primary"
                  : "bg-background/50 border-border/60 hover:border-primary/40"
              )}
            >
              <Checkbox
                checked={interests.includes(item.value)}
                onCheckedChange={() => toggleInterest(item.value)}
                className="rounded-md border-muted-foreground/30 data-[state=checked]:border-primary"
              />
              <item.icon className={cn("h-4 w-4", interests.includes(item.value) ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", interests.includes(item.value) ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Helps us tailor wellness recommendations for you.</p>
      </div>
    </div>
  );
};

export default StepLifestyle;
