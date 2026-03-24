import { Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StepEmergencyProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const StepEmergency = ({ data, onChange }: StepEmergencyProps) => {
  const reminders: string[] = data.reminderPreferences || [];

  const toggleReminder = (value: string) => {
    if (reminders.includes(value)) {
      onChange("reminderPreferences", reminders.filter((r) => r !== value));
    } else {
      onChange("reminderPreferences", [...reminders, value]);
    }
  };

  return (
    <div className="space-y-7">
      {/* Emergency contact */}
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emergency Contact</p>
        <div className="space-y-2.5">
          <Label htmlFor="emergencyName" className="text-sm font-semibold text-foreground/80">Contact name</Label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="emergencyName"
              placeholder="Jane Doe"
              value={data.emergencyName || ""}
              onChange={(e) => onChange("emergencyName", e.target.value)}
              className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-foreground/80">Contact phone</Label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="emergencyPhone"
              type="tel"
              placeholder="+91 98765 43210"
              value={data.emergencyPhone || ""}
              onChange={(e) => onChange("emergencyPhone", e.target.value)}
              className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Consultation type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Preferred consultation type</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: "chat", label: "Chat", emoji: "💬" },
            { value: "audio", label: "Audio call", emoji: "📞" },
            { value: "video", label: "Video call", emoji: "📹" },
            { value: "any", label: "Any", emoji: "✅" },
          ].map((opt) => {
            const isActive = data.consultationType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("consultationType", opt.value)}
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

      {/* Health focus */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Primary health focus area</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: "physical", label: "Physical", emoji: "💪" },
            { value: "mental", label: "Mental", emoji: "🧠" },
            { value: "both", label: "Both", emoji: "🌟" },
          ].map((opt) => {
            const isActive = data.healthFocus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("healthFocus", opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span className="text-lg">{opt.emoji}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reminder preferences */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Reminder preferences</Label>
        <div className="space-y-2.5">
          {[
            { value: "medicine", label: "Medicine reminders" },
            { value: "meal", label: "Meal reminders" },
            { value: "exercise", label: "Exercise reminders" },
            { value: "water", label: "Water intake reminders" },
          ].map((item) => (
            <label
              key={item.value}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                reminders.includes(item.value)
                  ? "bg-primary/10 border-primary"
                  : "bg-background/50 border-border/60 hover:border-primary/40"
              )}
            >
              <Checkbox
                checked={reminders.includes(item.value)}
                onCheckedChange={() => toggleReminder(item.value)}
                className="rounded-md border-muted-foreground/30 data-[state=checked]:border-primary"
              />
              <span className={cn("text-sm font-medium", reminders.includes(item.value) ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Language preference */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground/80">
          Language preference <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Select value={data.language || ""} onValueChange={(v) => onChange("language", v)}>
          <SelectTrigger className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
            <SelectItem value="telugu">Telugu</SelectItem>
            <SelectItem value="bengali">Bengali</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StepEmergency;
