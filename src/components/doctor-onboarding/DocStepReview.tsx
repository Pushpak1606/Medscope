import { User, BadgeCheck, Stethoscope, Calendar, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DocStepReviewProps {
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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
          <Icon className="h-4 w-4 text-violet-500" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => goToStep(step)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors"
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

const DocStepReview = ({ data, goToStep }: DocStepReviewProps) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
          Almost done! Review your professional profile, then complete setup.
        </p>
      </div>

      <SummaryCard
        icon={User}
        title="Personal & Professional"
        step={0}
        goToStep={goToStep}
        entries={[
          { label: "Full name", value: data.fullName },
          { label: "Gender", value: data.gender },
          { label: "Phone", value: data.phone },
          { label: "Email", value: data.email },
          { label: "Specialization", value: data.specialization },
          { label: "Hospital", value: data.hospital },
          { label: "City", value: data.city },
        ]}
      />

      <SummaryCard
        icon={BadgeCheck}
        title="Qualifications & Expertise"
        step={1}
        goToStep={goToStep}
        entries={[
          { label: "Degree(s)", value: data.degree },
          { label: "University", value: data.university },
          { label: "License", value: data.license },
          { label: "Experience", value: data.experience },
          { label: "Expertise", value: formatList(data.expertise) },
          { label: "Languages", value: formatList(data.languages) },
        ]}
      />

      <SummaryCard
        icon={Stethoscope}
        title="Consultation Preferences"
        step={2}
        goToStep={goToStep}
        entries={[
          { label: "Type", value: data.consultationType },
          { label: "Mode", value: data.consultationMode },
          { label: "Fee", value: data.fee ? `₹${data.fee}` : undefined },
          { label: "Duration", value: data.duration ? `${data.duration} min` : undefined },
          { label: "AI guidance", value: formatBool(data.aiGuidance) },
          { label: "Assistant support", value: formatBool(data.acceptsAssistant) },
        ]}
      />

      <SummaryCard
        icon={Calendar}
        title="Availability & Setup"
        step={3}
        goToStep={goToStep}
        entries={[
          { label: "Available days", value: formatList(data.availableDays) },
          { label: "Time", value: data.timeFrom && data.timeTo ? `${data.timeFrom} – ${data.timeTo}` : undefined },
          { label: "Emergency", value: formatBool(data.emergencyAvailable) },
          { label: "Max patients/day", value: data.maxPatients },
          { label: "Notifications", value: formatList(data.notificationMode) },
          { label: "Dashboard home", value: data.dashboardPreference },
        ]}
      />

      <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-center text-xs text-muted-foreground space-y-1">
        <p>Your profile is used to configure your dashboard and patient visibility.</p>
        <p>You can update everything later from your settings.</p>
      </div>
    </div>
  );
};

export default DocStepReview;
