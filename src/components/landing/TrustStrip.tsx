import { ShieldCheck, Stethoscope, Brain, BellRing, HeartPulse, Users } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "AI-Guided Care" },
  { icon: Stethoscope, label: "Live Doctor Support" },
  { icon: Brain, label: "Mental Wellness Tools" },
  { icon: BellRing, label: "Smart Reminders" },
  { icon: HeartPulse, label: "Holistic Health Tracking" },
  { icon: Users, label: "Community Support" },
];

const TrustStrip = () => (
  <section className="border-b border-border/40 bg-surface py-10">
    <div className="container">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Trusted by medical users and healthcare teams
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
