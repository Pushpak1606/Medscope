import { Droplets, Moon, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HealthProgressWidget = () => {
  const metrics = [
    { label: "Water", value: 4, target: 8, unit: "glasses", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500", track: "bg-blue-500/20" },
    { label: "Sleep", value: 6.5, target: 8, unit: "hrs", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500", track: "bg-indigo-500/20" },
    { label: "Activity", value: 350, target: 500, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-500", track: "bg-orange-500/20" },
  ];

  return (
    <div className="rounded-[2.5rem] bg-card p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative overflow-hidden group">
      {/* Subtle ambient light */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="flex items-center justify-between mb-6 sm:mb-8 relative">
        <h3 className="font-extrabold text-xl sm:text-2xl text-foreground tracking-tight">Daily Goals</h3>
        <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">In Progress</span>
      </div>

      <div className="space-y-6 relative">
        {metrics.map((metric, idx) => {
          const progress = Math.min((metric.value / metric.target) * 100, 100);
          
          return (
            <div key={idx} className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${metric.track}`}>
                 <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="flex-1 w-full min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-extrabold text-foreground">{metric.label}</span>
                  <span className="text-[11px] font-bold text-foreground bg-background px-2 py-0.5 rounded-full border border-border/50">
                     {metric.value} <span className="text-muted-foreground font-semibold">/ {metric.target} {metric.unit}</span>
                  </span>
                </div>
                <div className={`w-full h-1.5 sm:h-2 rounded-full ${metric.track} overflow-hidden`}>
                  <div 
                    className={`h-full ${metric.bg} rounded-full transition-all duration-1000 ease-out`}
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
        className="mt-6 flex items-center justify-center w-full gap-2 py-3 rounded-xl bg-muted/50 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border/50"
      >
        Update Vitals <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default HealthProgressWidget;
