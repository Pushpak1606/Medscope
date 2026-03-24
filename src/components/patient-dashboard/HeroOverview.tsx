import { Sparkles, Calendar as CalendarIcon, Activity as ActivityIcon } from "lucide-react";

interface HeroOverviewProps {
  profile: any;
}

const HeroOverview = ({ profile }: HeroOverviewProps) => {
  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl p-6 sm:p-8">
      {/* Decorative gradient blobl */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> 
            {profile.healthFocus === "physical" ? "Physical Focus" : profile.healthFocus === "mental" ? "Mental Focus" : "Balanced Wellness"}
          </div>
          <h3 className="text-3xl font-extrabold font-heading text-foreground tracking-tight leading-tight">
            You're doing great! Keep up the momentum.
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            Your daily health score is looking strong. You have 3 reminders left for today and an upcoming consultation this Friday.
          </p>
        </div>

        {/* Quick Stats Blocks */}
        <div className="flex gap-4">
          <div className="px-5 py-4 rounded-2xl bg-background/50 border border-border/80 backdrop-blur-md flex flex-col items-center justify-center min-w-[100px] shadow-sm">
            <ActivityIcon className="h-6 w-6 text-green-500 mb-1" />
            <span className="text-xl font-bold text-foreground">12</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Day Streak</span>
          </div>
          <div className="px-5 py-4 rounded-2xl bg-background/50 border border-border/80 backdrop-blur-md flex flex-col items-center justify-center min-w-[100px] shadow-sm">
            <CalendarIcon className="h-6 w-6 text-primary mb-1" />
            <span className="text-xl font-bold text-foreground">3</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Tasks left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroOverview;
