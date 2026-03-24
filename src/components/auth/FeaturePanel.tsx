import { Badge } from "@/components/ui/badge";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface FeaturePanelProps {
  badge: string;
  title: string;
  description: string;
  features: Feature[];
  isDoctor?: boolean;
}

const FeaturePanel = ({ badge, title, description, features, isDoctor }: FeaturePanelProps) => (
  <div className="space-y-8">
    <div>
      <Badge variant="secondary" className={cn("text-xs font-bold border-0 tracking-wider uppercase mb-4", isDoctor ? "bg-violet-500/10 text-violet-500" : "bg-primary/10 text-primary")}>
        {badge}
      </Badge>
      <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight drop-shadow-sm">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
    
    <div className="space-y-4 pt-2">
      {features.map((f, i) => (
        <div key={i} className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm px-5 py-4 transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner transition-transform duration-300 group-hover:scale-110", isDoctor ? "bg-violet-500/10 text-violet-500" : "bg-primary/10 text-primary")}>
            <f.icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-foreground">{f.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturePanel;
