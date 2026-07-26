import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Monitor, Sun, Moon, Sparkles, Sliders, Eye } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const DoctorAppearanceCard: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section aria-label="Appearance Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Appearance & Workspace Customization"
          subtitle="Customize interface theme, glass blur intensity & accessibility preferences."
        />

        <div className="space-y-4 text-xs">
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Workspace Theme Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: "dark", label: "Pure Dark Glass", icon: Moon },
                { mode: "light", label: "Clinical Light", icon: Sun },
                { mode: "system", label: "System Sync", icon: Monitor },
              ].map((t) => {
                const IconComponent = t.icon;
                const isSelected = theme === t.mode;

                return (
                  <button
                    key={t.mode}
                    onClick={() => {
                      setTheme(t.mode as any);
                      toast.success(`Theme set to ${t.label}`);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 select-none cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                        : "bg-card/60 hover:bg-card border-border/60 text-foreground"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 shrink-0" />
                    <span className="font-bold font-heading text-xs truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground text-xs">High Glass Intensity (Backdrop Blur)</div>
                <div className="text-[10px] text-muted-foreground">Enhanced blur effect for glass cards</div>
              </div>
              <Switch defaultChecked onCheckedChange={() => toast.info("Glass intensity preference saved")} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/60">
              <div className="space-y-0.5">
                <div className="font-bold text-foreground text-xs">Reduce Motion & Animations</div>
                <div className="text-[10px] text-muted-foreground">Disable Framer Motion entrance transitions</div>
              </div>
              <Switch onCheckedChange={() => toast.info("Motion preference updated")} />
            </div>
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default DoctorAppearanceCard;
