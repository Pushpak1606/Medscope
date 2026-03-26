import { Droplets, Moon, Flame, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HealthProgressWidget = () => {
  const metrics = [
    { label: "Water", value: 6, target: 8, unit: "glasses", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500", track: "bg-blue-500/20", feedback: "Almost there!" },
    { label: "Sleep", value: 6.5, target: 8, unit: "hrs", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500", track: "bg-indigo-500/20", feedback: "Needs improvement" },
    { label: "Activity", value: 500, target: 500, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-500", track: "bg-orange-500/20", feedback: "Goal reached! 🎉" },
  ];

  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative overflow-hidden group h-full">
      {/* Subtle ambient light */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <h3 className="font-extrabold text-xl text-foreground tracking-tight">Daily Goals</h3>
        <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          In Progress
        </span>
      </div>

      <div className="grid gap-3 sm:gap-4 flex-1">
        {metrics.map((metric, idx) => {
          const progress = Math.min((metric.value / metric.target) * 100, 100);
          const isComplete = progress === 100;
          
          return (
            <div key={idx} className={`relative flex items-center gap-4 p-4 lg:p-5 rounded-2xl border ${isComplete ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-background/50 border-border/50'} transition-all hover:bg-muted/50`}>
              {/* Icon */}
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-500/10' : metric.track}`}>
                 {isComplete ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <metric.icon className={`h-6 w-6 ${metric.color}`} />}
              </div>
              
              {/* Info + Progress Line */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-base font-bold text-foreground">{metric.label}</span>
                  <span className="text-sm font-black tabular-nums tracking-tight">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                {/* Micro-Feedback */}
                <p className={`text-xs font-semibold mb-2 ${isComplete ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {metric.feedback} ({metric.value}/{metric.target} {metric.unit})
                </p>

                <div className={`w-full h-1.5 rounded-full ${isComplete ? 'bg-emerald-500/20' : metric.track} overflow-hidden`}>
                  <div 
                    className={`h-full ${isComplete ? 'bg-emerald-500' : metric.bg} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link 
        to="/patient/log-vitals" 
        className="mt-6 flex items-center justify-center w-full gap-2 py-3.5 rounded-xl bg-primary/5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors border border-primary/10"
      >
        Log Vitals <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default HealthProgressWidget;
