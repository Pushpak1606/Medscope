import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface DocStepAvailabilityProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const inputClass =
  "h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DocStepAvailability = ({ data, onChange }: DocStepAvailabilityProps) => {
  const availableDays: string[] = data.availableDays || [];
  const notifications: string[] = data.notificationMode || [];

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      onChange("availableDays", availableDays.filter((d) => d !== day));
    } else {
      onChange("availableDays", [...availableDays, day]);
    }
  };

  const toggleNotification = (value: string) => {
    if (notifications.includes(value)) {
      onChange("notificationMode", notifications.filter((n) => n !== value));
    } else {
      onChange("notificationMode", [...notifications, value]);
    }
  };

  return (
    <div className="space-y-7">
      {/* Available days */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Available days</Label>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map((day) => {
            const isActive = availableDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "w-12 h-12 rounded-xl border text-sm font-bold transition-all",
                  isActive
                    ? "bg-violet-500/10 border-violet-500 text-violet-600 shadow-sm dark:text-violet-400"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Supports scheduling and consultation flow.</p>
      </div>

      {/* Time slot */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Available from</Label>
          <Select value={data.timeFrom || ""} onValueChange={(v) => onChange("timeFrom", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Available until</Label>
          <Select value={data.timeTo || ""} onValueChange={(v) => onChange("timeTo", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Emergency & Max patients */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
          <div>
            <p className="text-sm font-semibold text-foreground/80">Emergency available?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Accept emergency consultations</p>
          </div>
          <Switch
            checked={data.emergencyAvailable || false}
            onCheckedChange={(v) => onChange("emergencyAvailable", v)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="maxPatients" className="text-sm font-semibold text-foreground/80">
            Max patients / day <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="maxPatients"
            type="number"
            placeholder="20"
            value={data.maxPatients || ""}
            onChange={(e) => onChange("maxPatients", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Assistant name */}
      <div className="space-y-2.5">
        <Label htmlFor="assistantName" className="text-sm font-semibold text-foreground/80">
          Assistant doctor name <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="assistantName"
          placeholder="Dr. Assistant Name"
          value={data.assistantName || ""}
          onChange={(e) => onChange("assistantName", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Notification mode */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Preferred notification mode</Label>
        <div className="space-y-2.5">
          {[
            { value: "email", label: "Email notifications" },
            { value: "sms", label: "SMS notifications" },
            { value: "in-app", label: "In-app notifications" },
          ].map((item) => (
            <label
              key={item.value}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                notifications.includes(item.value)
                  ? "bg-violet-500/10 border-violet-500"
                  : "bg-background/50 border-border/60 hover:border-violet-500/40"
              )}
            >
              <Checkbox
                checked={notifications.includes(item.value)}
                onCheckedChange={() => toggleNotification(item.value)}
                className="rounded-md border-muted-foreground/30 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500"
              />
              <span className={cn("text-sm font-medium", notifications.includes(item.value) ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dashboard preference */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Dashboard home preference</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: "patients", label: "Patients", emoji: "👥" },
            { value: "appointments", label: "Appointments", emoji: "📅" },
            { value: "ai-assistant", label: "AI Assistant", emoji: "🤖" },
          ].map((opt) => {
            const isActive = data.dashboardPreference === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("dashboardPreference", opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-violet-500/10 border-violet-500 text-violet-600 shadow-sm dark:text-violet-400"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                <span className="text-lg">{opt.emoji}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Can be updated anytime from your dashboard.</p>
      </div>
    </div>
  );
};

export default DocStepAvailability;
