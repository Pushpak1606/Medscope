import { User, Phone, Mail, MapPin, Stethoscope, Hospital } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocStepPersonalProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const specializations = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Surgery",
  "Urology",
  "Other",
];

const inputClass =
  "h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl";
const iconInputClass = `pl-11 ${inputClass}`;

const DocStepPersonal = ({ data, onChange }: DocStepPersonalProps) => {
  return (
    <div className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2.5">
        <Label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">
          Full name
        </Label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
          <Input
            id="fullName"
            placeholder="Dr. Jane Smith"
            value={data.fullName || ""}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={iconInputClass}
          />
        </div>
      </div>

      {/* Gender & Phone */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Gender</Label>
          <Select value={data.gender || ""} onValueChange={(v) => onChange("gender", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone number</Label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              className={iconInputClass}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Professional email</Label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
          <Input
            id="email"
            type="email"
            placeholder="doctor@hospital.com"
            value={data.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className={iconInputClass}
          />
        </div>
      </div>

      {/* Specialization & Sub-specialization */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-violet-400" /> Specialization
            </span>
          </Label>
          <Select value={data.specialization || ""} onValueChange={(v) => onChange("specialization", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((s) => (
                <SelectItem key={s} value={s.toLowerCase().replace(/\s+/g, "-")}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="subSpec" className="text-sm font-semibold text-foreground/80">
            Sub-specialization <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="subSpec"
            placeholder="e.g. Interventional Cardiology"
            value={data.subSpecialization || ""}
            onChange={(e) => onChange("subSpecialization", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Hospital & City */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="hospital" className="text-sm font-semibold text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Hospital className="h-4 w-4 text-violet-400" /> Hospital / Clinic
            </span>
          </Label>
          <Input
            id="hospital"
            placeholder="City General Hospital"
            value={data.hospital || ""}
            onChange={(e) => onChange("hospital", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="city" className="text-sm font-semibold text-foreground/80">City / Location</Label>
          <div className="relative group">
            <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
            <Input
              id="city"
              placeholder="Mumbai"
              value={data.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
              className={iconInputClass}
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2.5">
        <Label htmlFor="bio" className="text-sm font-semibold text-foreground/80">
          Short professional bio <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="bio"
          placeholder="A brief description of your practice and approach to patient care..."
          value={data.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          className="min-h-[100px] bg-card border-border/80 hover:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 rounded-xl transition-all"
        />
        <p className="text-xs text-muted-foreground">Patients will see this on your public profile.</p>
      </div>
    </div>
  );
};

export default DocStepPersonal;
