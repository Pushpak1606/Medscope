import { FileText, Camera, PhoneCall, BotMessageSquare, Sparkles, FileScan, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SMART_ACTIONS = [
  { 
    href: "/patient/ask-ai", 
    icon: BotMessageSquare, 
    label: "Ask AI Assistant", 
    desc: "Analyze symptoms & reports",
    color: "text-purple-500", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/20",
    glow: "group-hover/card:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    isDialog: false
  },
  { 
    href: "#", 
    icon: Camera, 
    label: "Scan", 
    desc: "Scan Rx or lab results",
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20",
    glow: "group-hover/card:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    isDialog: true
  },
  { 
    href: "/patient/log-mood", 
    icon: Sparkles, 
    label: "Mental Wellness", 
    desc: "Log your daily mood",
    color: "text-pink-500", 
    bg: "bg-pink-500/10", 
    border: "border-pink-500/20",
    glow: "group-hover/card:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
    isDialog: false
  },
  { 
    href: "/patient/emergency", 
    icon: PhoneCall, 
    label: "Emergency SOS", 
    desc: "Get help immediately",
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    glow: "group-hover/card:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    isDialog: false
  },
];

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const handleDocumentOptionClick = (path: string) => {
    // You could close the dialog programmatically here if needed, 
    // but navigating away effectively unmounts it or navigates away.
    navigate(path);
  };

  const renderCardContent = (action: any) => (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${action.color.replace('text-', '')}/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border ${action.bg} ${action.border}`}>
        <action.icon className={`h-6 w-6 ${action.color} transition-transform duration-300 group-hover/card:scale-110`} />
      </div>
      <span className="font-bold text-base text-foreground mb-1 group-hover/card:text-primary transition-colors">
        {action.label}
      </span>
      <span className="text-xs font-semibold text-muted-foreground line-clamp-2">
        {action.desc}
      </span>
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-extrabold text-xl text-foreground tracking-tight">Smart Actions</h3>
      </div>

      {/* Horizontal scroll on mobile, responsive grid on larger screens */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 hide-scrollbar snap-x snap-mandatory">
        {SMART_ACTIONS.map((action, i) => {
          const cardClasses = `group/card relative flex flex-col p-4 sm:p-5 rounded-3xl bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 ${action.glow} min-w-[160px] sm:min-w-0 snap-start shrink-0 overflow-hidden text-left`;

          if (action.isDialog) {
            return (
              <Dialog key={i}>
                <DialogTrigger className={cardClasses}>
                  {renderCardContent(action)}
                </DialogTrigger>
                <DialogContent className="w-[92vw] max-w-md rounded-[2rem] p-5 sm:p-8 border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
                  <DialogHeader className="mb-4 sm:mb-6">
                    <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground text-center">
                      What are you scanning?
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button 
                      onClick={() => handleDocumentOptionClick("/patient/scan-rx")}
                      className="flex sm:flex-col items-center sm:justify-center gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] group text-left sm:text-center"
                    >
                      <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <FileScan className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-foreground text-lg">Scan Rx</h4>
                        <p className="text-sm text-muted-foreground font-medium">Prescriptions</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleDocumentOptionClick("/patient/records")}
                      className="flex sm:flex-col items-center sm:justify-center gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] group text-left sm:text-center"
                    >
                      <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Activity className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-foreground text-lg">Scan Report</h4>
                        <p className="text-sm text-muted-foreground font-medium">Lab Results</p>
                      </div>
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          }

          return (
            <Link
              key={i}
              to={action.href}
              className={cardClasses}
            >
              {renderCardContent(action)}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsWidget;
