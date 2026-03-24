import { Link } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/ui/animated-background";

interface AuthLayoutProps {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
  role: "patient" | "doctor";
}

const AuthLayout = ({ children, sidePanel, role }: AuthLayoutProps) => {
  const isDoctor = role === "doctor";
  
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen relative overflow-hidden">
        {/* Ambient Glows for the entire screen (very faded on mobile, bright behind side panel) */}
        <AnimatedBackground variant={isDoctor ? "doctor" : "patient"} className="opacity-20 md:opacity-30 lg:hidden pointer-events-none" />

        {/* Immersive Side Panel (Desktop only) */}
        <div className="relative hidden w-[45%] max-w-[500px] flex-col justify-between overflow-hidden border-r border-border/40 bg-card p-10 lg:flex xl:w-[500px]">
          
          <AnimatedBackground variant={isDoctor ? "doctor" : "patient"} className="opacity-100" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="mt-12">
              <Link to="/" className="inline-flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
                <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg shadow-sm", isDoctor ? "bg-violet-500 text-white" : "bg-primary text-primary-foreground")}>
                  <Activity className="h-5 w-5" />
                </div>
                <span>Medscope</span>
              </Link>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
            {sidePanel}
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              © {new Date().getFullYear()} Medscope Inc.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-12 xl:px-24">
          {/* Mobile header */}
          <div className="mb-10 flex w-full max-w-sm mx-auto items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", isDoctor ? "bg-violet-500 text-white" : "bg-primary text-primary-foreground")}>
                <Activity className="h-4 w-4" />
              </div>
              <span>Medscope</span>
            </Link>
          </div>
          
          <div className="mx-auto w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
