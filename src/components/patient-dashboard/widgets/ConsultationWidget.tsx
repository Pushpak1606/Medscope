import { Stethoscope, Video, Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultationWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2.5rem] bg-card p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative overflow-hidden group">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
      
      <div className="flex items-center justify-between mb-8 relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 text-emerald-500 flex items-center justify-center shrink-0">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-foreground tracking-tight">Consultations</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">1 Upcoming</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        <div className="p-5 sm:p-6 rounded-3xl bg-background/50 border border-border/50 shadow-sm relative overflow-hidden backdrop-blur-sm transition-all hover:bg-background/80 group/card">
          <div className="flex items-center gap-5 mb-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/50">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=DrJane" alt="Dr. Jane Smith" className="h-full w-full object-cover bg-emerald-50/50" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground text-lg sm:text-xl truncate">Dr. Jane Smith</h4>
              <p className="text-sm text-muted-foreground font-medium truncate">General Practitioner</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground mb-6">
            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
              <Calendar className="h-4 w-4 text-primary" /> Fri, 26 Oct
            </div>
            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
              <Clock className="h-4 w-4 text-emerald-500" /> 4:00 PM
            </div>
          </div>

          <Button className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-[0_8px_20px_rgba(5,150,105,0.25)] transition-all border-0 hover:scale-[1.02] active:scale-95 group-hover/card:shadow-[0_8px_30px_rgba(5,150,105,0.35)]">
            <Video className="mr-2 h-5 w-5" /> Join Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationWidget;
