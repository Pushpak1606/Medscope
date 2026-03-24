import { User, MapPin, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepBasicProfileProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const StepBasicProfile = ({ data, onChange }: StepBasicProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2.5">
        <Label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">
          Full name
        </Label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName || ""}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Age and Gender */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="age" className="text-sm font-semibold text-foreground/80">
            Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min={1}
            max={120}
            value={data.age || ""}
            onChange={(e) => onChange("age", e.target.value)}
            className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Gender</Label>
          <Select value={data.gender || ""} onValueChange={(v) => onChange("gender", v)}>
            <SelectTrigger className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Height and Weight */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="height" className="text-sm font-semibold text-foreground/80">
            Height <span className="text-muted-foreground font-normal">(cm)</span>
          </Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={data.height || ""}
            onChange={(e) => onChange("height", e.target.value)}
            className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="weight" className="text-sm font-semibold text-foreground/80">
            Weight <span className="text-muted-foreground font-normal">(kg)</span>
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={data.weight || ""}
            onChange={(e) => onChange("weight", e.target.value)}
            className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Blood Group */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="h-4 w-4 text-red-400" /> Blood group
          </span>
        </Label>
        <Select value={data.bloodGroup || ""} onValueChange={(v) => onChange("bloodGroup", v)}>
          <SelectTrigger className="h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {bloodGroups.map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2.5">
        <Label htmlFor="city" className="text-sm font-semibold text-foreground/80">
          City / Location <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="relative group">
          <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="city"
            placeholder="Mumbai"
            value={data.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl"
          />
        </div>
        <p className="text-xs text-muted-foreground">Helps us suggest nearby pharmacies and doctors.</p>
      </div>
    </div>
  );
};

export default StepBasicProfile;
