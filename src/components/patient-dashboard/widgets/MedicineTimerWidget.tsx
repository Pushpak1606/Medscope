import { Pill, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedicineTimerWidget = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-6 sm:p-8 relative overflow-hidden text-center group">
      <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.05),transparent_60%)] pointer-events-none"></div>

      <h3 className="font-bold text-foreground mb-1 w-full text-left">Next Reminder</h3>
      <p className="text-xs text-muted-foreground font-medium mb-6 w-full text-left">Time until next dose</p>

      {/* Circular Timer UI */}
      <div className="relative h-36 w-36 mb-6">
        <svg className="h-full w-full rotate-[-90deg]">
          <circle cx="72" cy="72" r="66" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle 
            cx="72" cy="72" r="66" 
            fill="transparent" 
            stroke="hsl(var(--primary))" 
            strokeWidth="8" 
            strokeDasharray="414" 
            strokeDashoffset="120" 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Pill className="h-6 w-6 text-primary mb-1 animate-pulse" />
          <span className="text-2xl font-black font-heading tracking-tighter text-foreground">01:45</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">Hrs Mins</span>
        </div>
      </div>

      <div className="mb-6 space-y-1">
        <h4 className="text-lg font-bold text-foreground">Amoxicillin</h4>
        <p className="text-sm text-muted-foreground font-medium px-4">500mg • Take after food</p>
      </div>

      <div className="flex w-full gap-3">
        <Button variant="outline" className="flex-1 rounded-xl h-12 bg-background border-border/60 hover:bg-muted shadow-sm">
          <Play className="h-4 w-4 mr-2" /> Delay 1h
        </Button>
        <Button className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
          <Check className="h-4 w-4 mr-2" /> Taken
        </Button>
      </div>
    </div>
  );
};

export default MedicineTimerWidget;
