import { User, HeartPulse, Activity, Shield, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StepReviewProps {
  data: Record<string, any>;
  goToStep: (step: number) => void;
}

const SummaryCard = ({
  icon: Icon,
  title,
  step,
  entries,
  goToStep,
}: {
  icon: any;
  title: string;
  step: number;
  entries: { label: string; value: string | undefined }[];
  goToStep: (step: number) => void;
}) => (
  <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => goToStep(step)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <Pencil className="h-3 w-3" /> Edit
      </button>
    </div>
    <Separator className="bg-border/40" />
    <div className="grid gap-2 sm:grid-cols-2">
      {entries.map((entry) => (
        <div key={entry.label}>
          <p className="text-xs text-muted-foreground">{entry.label}</p>
          <p className="text-sm font-medium text-foreground truncate">{entry.value || "—"}</p>
        </div>
      ))}
    </div>
  </div>
);

const formatList = (items: string[] | undefined) => items?.join(", ") || "—";
const formatBool = (v: boolean | undefined) => (v ? "Yes" : "No");

const StepReview = ({ data, goToStep }: StepReviewProps) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm font-medium text-primary">
          Almost done! Review your information below, then complete your setup.
        </p>
      </div>

      <SummaryCard
        icon={User}
        title="Basic Profile"
        step={0}
        goToStep={goToStep}
        entries={[
          { label: "Full name", value: data.fullName },
          { label: "Age", value: data.age },
          { label: "Gender", value: data.gender },
          { label: "Height", value: data.height ? `${data.height} cm` : undefined },
          { label: "Weight", value: data.weight ? `${data.weight} kg` : undefined },
          { label: "Blood group", value: data.bloodGroup },
          { label: "City", value: data.city },
        ]}
      />

      <SummaryCard
        icon={HeartPulse}
        title="Health Information"
        step={1}
        goToStep={goToStep}
        entries={[
          { label: "Conditions", value: formatList(data.conditions) },
          { label: "Medications", value: data.hasMedications ? data.medications || "Yes" : "No" },
          { label: "Allergies", value: data.hasAllergies ? data.allergies || "Yes" : "No" },
          { label: "Past surgeries", value: data.hasSurgeries ? data.surgeries || "Yes" : "No" },
        ]}
      />

      <SummaryCard
        icon={Activity}
        title="Lifestyle & Wellness"
        step={2}
        goToStep={goToStep}
        entries={[
          { label: "Activity", value: data.activityLevel },
          { label: "Sleep", value: data.sleepQuality },
          { label: "Stress", value: data.stressLevel },
          { label: "Diet", value: data.diet },
          { label: "Smokes", value: formatBool(data.smokes) },
          { label: "Alcohol", value: formatBool(data.alcohol) },
          { label: "Interests", value: formatList(data.wellnessInterests) },
        ]}
      />

      <SummaryCard
        icon={Shield}
        title="Emergency & Preferences"
        step={3}
        goToStep={goToStep}
        entries={[
          { label: "Emergency contact", value: data.emergencyName },
          { label: "Emergency phone", value: data.emergencyPhone },
          { label: "Consultation type", value: data.consultationType },
          { label: "Health focus", value: data.healthFocus },
          { label: "Reminders", value: formatList(data.reminderPreferences) },
          { label: "Language", value: data.language },
        ]}
      />

      <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-center text-xs text-muted-foreground space-y-1">
        <p>Your information is used to personalize your experience.</p>
        <p>You can update everything later from your profile settings.</p>
      </div>
    </div>
  );
};

export default StepReview;
