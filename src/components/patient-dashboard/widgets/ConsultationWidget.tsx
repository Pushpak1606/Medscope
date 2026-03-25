import { Stethoscope, Video, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultationWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Solid top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-400"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Consultations</h3>
            <p className="text-xs text-muted-foreground font-medium">1 Upcoming</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="p-4 rounded-3xl bg-background border border-border/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
            <Stethoscope className="h-16 w-16" />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=DrJane" alt="Doctor" className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">Dr. Jane Smith</h4>
              <p className="text-xs text-muted-foreground">General Practitioner</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-5 px-1">
            <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Fri, 26 Oct
            </div>
            <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
              <Video className="h-3.5 w-3.5 text-blue-500" /> 4:00 PM
            </div>
          </div>

          <Button className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all border-0">
            <Video className="mr-2 h-4 w-4" /> Join Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationWidget;
