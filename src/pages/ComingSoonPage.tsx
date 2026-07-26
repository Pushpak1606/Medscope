import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import MedscopeLogo from "@/components/ui/MedscopeLogo";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import AnimatedBackground from "@/components/ui/animated-background";

interface ComingSoonPageProps {
  title?: string;
  desc?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = "Coming Soon",
  desc = "This feature is currently under active development. Our engineering team is building this functionality to ensure a seamless experience.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-6">
      <AnimatedBackground variant="patient" className="opacity-20 fixed inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Brand Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <MedscopeLogo className="h-7 w-7" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground">
            Medscope
          </span>
        </div>

        {/* Card Container */}
        <div className="w-full rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl p-8 sm:p-10 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Feature In Progress
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <LiquidGlassButton className="w-full h-12" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </LiquidGlassButton>
            <Link to="/patient/dashboard" className="w-full">
              <LiquidGlassButton variant="secondary" className="w-full h-12">
                Dashboard
              </LiquidGlassButton>
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Medscope Health Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
