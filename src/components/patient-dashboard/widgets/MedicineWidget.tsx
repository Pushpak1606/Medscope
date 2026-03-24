import { Pill, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedicineWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2rem] bg-card border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Subtle top-light gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-primary opacity-50"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <Pill className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Medicine Reminder</h3>
          <p className="text-xs text-muted-foreground font-medium">Next dose in 2 hours</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Medicine Item */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/30 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Amoxicillin</span>
            <span className="text-xs text-muted-foreground">500mg • After food</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-blue-500" /> 2:00 PM
            </span>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-green-500/20 hover:text-green-600 text-muted-foreground bg-card shadow-sm border border-border/50">
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Taken Item */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 border border-green-500/20 opacity-70">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground line-through">Vitamin D3</span>
            <span className="text-xs text-muted-foreground">1000 IU • Morning</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1">
              Taken
            </span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-green-500 bg-green-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <Button variant="ghost" className="w-full mt-4 text-sm font-semibold text-primary hover:bg-primary/10">
        View Schedule
      </Button>
    </div>
  );
};

export default MedicineWidget;
