import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HeartPulse, Brain, Shield, Activity, Leaf } from "lucide-react";

interface DocStepQualificationsProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const inputClass =
  "h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl";

const expertiseOptions = [
  "Diabetes", "Hypertension", "Asthma", "Heart Disease",
  "Thyroid", "Mental Health", "Dermatology", "Orthopedic Issues",
  "Gastric Disorders", "Pediatric Care", "Women's Health", "Cancer Care",
];

const languageOptions = [
  "English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Gujarati",
];

const consultFocusOptions = [
  { value: "general", label: "General physical health", icon: HeartPulse },
  { value: "mental", label: "Mental health", icon: Brain },
  { value: "chronic", label: "Chronic disease management", icon: Shield },
  { value: "preventive", label: "Preventive care", icon: Activity },
  { value: "lifestyle", label: "Lifestyle counseling", icon: Leaf },
];

const chipToggle = (
  list: string[],
  value: string,
  field: string,
  onChange: (f: string, v: any) => void
) => {
  if (list.includes(value)) {
    onChange(field, list.filter((i) => i !== value));
  } else {
    onChange(field, [...list, value]);
  }
};

const DocStepQualifications = ({ data, onChange }: DocStepQualificationsProps) => {
  const expertise: string[] = data.expertise || [];
  const languages: string[] = data.languages || [];
  const consultFocus: string[] = data.consultFocus || [];

  return (
    <div className="space-y-7">
      {/* Degree & University */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="degree" className="text-sm font-semibold text-foreground/80">Medical degree(s)</Label>
          <Input
            id="degree"
            placeholder="MBBS, MD Cardiology"
            value={data.degree || ""}
            onChange={(e) => onChange("degree", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="university" className="text-sm font-semibold text-foreground/80">University / Institution</Label>
          <Input
            id="university"
            placeholder="AIIMS New Delhi"
            value={data.university || ""}
            onChange={(e) => onChange("university", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* License & Experience */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="license" className="text-sm font-semibold text-foreground/80">Registration / License No.</Label>
          <Input
            id="license"
            placeholder="MCI-12345"
            value={data.license || ""}
            onChange={(e) => onChange("license", e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-muted-foreground">Can be verified later if needed.</p>
        </div>
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Years of experience</Label>
          <Select value={data.experience || ""} onValueChange={(v) => onChange("experience", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0–2 years</SelectItem>
              <SelectItem value="3-5">3–5 years</SelectItem>
              <SelectItem value="6-10">6–10 years</SelectItem>
              <SelectItem value="11-20">11–20 years</SelectItem>
              <SelectItem value="20+">20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-2.5">
        <Label htmlFor="certifications" className="text-sm font-semibold text-foreground/80">
          Certifications <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="certifications"
          placeholder="e.g. Fellowship in Interventional Cardiology, ACLS certified..."
          value={data.certifications || ""}
          onChange={(e) => onChange("certifications", e.target.value)}
          className="min-h-[80px] bg-card border-border/80 hover:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 rounded-xl transition-all"
        />
      </div>

      {/* Expertise chips */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Areas of expertise / Diseases treated</Label>
        <div className="flex flex-wrap gap-2.5">
          {expertiseOptions.map((item) => {
            const isActive = expertise.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => chipToggle(expertise, item, "expertise", onChange)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isActive
                    ? "bg-violet-500/10 text-violet-600 border-violet-500 shadow-sm dark:text-violet-400"
                    : "bg-background/50 text-muted-foreground border-border/60 hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Helps patients understand your expertise.</p>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Languages spoken</Label>
        <div className="flex flex-wrap gap-2.5">
          {languageOptions.map((lang) => {
            const isActive = languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => chipToggle(languages, lang, "languages", onChange)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isActive
                    ? "bg-violet-500/10 text-violet-600 border-violet-500 shadow-sm dark:text-violet-400"
                    : "bg-background/50 text-muted-foreground border-border/60 hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Consultation focus */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Consultation focus areas</Label>
        <div className="space-y-2.5">
          {consultFocusOptions.map((item) => {
            const isActive = consultFocus.includes(item.value);
            return (
              <label
                key={item.value}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                  isActive
                    ? "bg-violet-500/10 border-violet-500"
                    : "bg-background/50 border-border/60 hover:border-violet-500/40"
                )}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => chipToggle(consultFocus, item.value, "consultFocus", onChange)}
                  className="rounded-md border-muted-foreground/30 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500"
                />
                <item.icon className={cn("h-4 w-4", isActive ? "text-violet-500" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocStepQualifications;
