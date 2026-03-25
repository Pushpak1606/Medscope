import { FileText, Camera, PhoneCall, BotMessageSquare, BookHeart } from "lucide-react";
import { Link } from "react-router-dom";

const ACTIONS = [
  { href: "/patient/scan-rx", icon: Camera, label: "Scan Rx", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { href: "/patient/ask-ai", icon: BotMessageSquare, label: "Ask AI", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { href: "/patient/log-mood", icon: BookHeart, label: "Log Mood", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { href: "/patient/emergency", icon: PhoneCall, label: "Emergency", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { href: "/patient/records", icon: FileText, label: "Records", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const QuickActionsWidget = () => {
  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative overflow-hidden group">
      {/* Decorative ambient light */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <h3 className="font-extrabold text-xl text-foreground tracking-tight">Quick Actions</h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">Most Used</span>
      </div>

      <div className="flex sm:grid sm:grid-cols-5 gap-4 sm:gap-6 relative overflow-x-auto pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 hide-scrollbar snap-x snap-mandatory">
        {ACTIONS.map((action, i) => (
          <Link
            key={i}
            to={action.href}
            className="flex flex-col items-center gap-3 group/btn shrink-0 snap-start"
          >
            <div className="relative overflow-hidden h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] rounded-[1.2rem] bg-background/60 border border-border/40 shadow-sm flex items-center justify-center transition-all duration-300 group-hover/btn:-translate-y-1 group-hover/btn:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <action.icon className={`relative z-10 h-7 w-7 sm:h-8 sm:w-8 ${action.color} transition-transform duration-300 group-hover/btn:scale-110`} />
            </div>
            <span className="text-xs font-bold text-muted-foreground text-center group-hover/btn:text-foreground transition-colors mt-1">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidget;
