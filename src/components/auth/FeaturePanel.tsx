import { Badge } from "@/components/ui/badge";
import { type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface FeaturePanelProps {
  badge: string;
  title: string;
  description: string;
  features: Feature[];
}

const FeaturePanel = ({ badge, title, description, features }: FeaturePanelProps) => (
  <div className="space-y-6">
    <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0">
      {badge}
    </Badge>
    <h2 className="text-2xl font-bold font-heading text-foreground tracking-tight">{title}</h2>
    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    <div className="space-y-3 pt-2">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <f.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-foreground">{f.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturePanel;
