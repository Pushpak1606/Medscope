import { Pill, Play, Check, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/context/PatientContext";

const MedicineTimerWidget = () => {
  const { reminders, markReminderDone } = usePatient();
  const upcomingMed = reminders.find(r => r.type === "Medicines" && r.status === "upcoming");
  return (
    <div className="h-full flex flex-col items-center justify-center rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden text-center group">
      <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-80"></div>
      <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.05),transparent_60%)] pointer-events-none"></div>

      <div className="flex items-center justify-between w-full mb-1">
        <h3 className="font-bold text-foreground text-left">Next Reminder</h3>
        <Link to="/patient/reminders" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">View All</Link>
      </div>
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
          {upcomingMed ? (
            <>
              <Pill className="h-6 w-6 text-primary mb-1 animate-pulse" />
              <span className="text-xl font-black font-heading tracking-tighter text-foreground">{upcomingMed.time}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">Scheduled</span>
            </>
          ) : (
             <>
               <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
               <span className="text-sm font-black font-heading tracking-tighter text-foreground mt-1">Done</span>
             </>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-1 h-12 flex flex-col justify-center">
        <h4 className="text-lg font-bold text-foreground line-clamp-1">{upcomingMed ? upcomingMed.title : "All clear!"}</h4>
        <p className="text-sm text-muted-foreground font-medium px-4 line-clamp-1">{upcomingMed ? upcomingMed.repeat : "No pending medications"}</p>
      </div>

      <div className="flex w-full gap-3 mt-auto">
        <Button 
          variant="outline" 
          disabled={!upcomingMed}
          className="flex-1 rounded-xl h-12 bg-background border-border/60 hover:bg-muted shadow-sm disabled:opacity-50"
        >
          <Play className="h-4 w-4 mr-2" /> Delay 1h
        </Button>
        <Button 
          disabled={!upcomingMed}
          onClick={() => upcomingMed && markReminderDone(upcomingMed.id)}
          className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          <Check className="h-4 w-4 mr-2" /> Taken
        </Button>
      </div>
    </div>
  );
};

export default MedicineTimerWidget;
