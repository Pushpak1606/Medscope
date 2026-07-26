import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { Users, Calendar, Clock, AlertTriangle, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DirectoryHeroProps {
  totalPatients?: number;
  todayAppointments?: number;
  pendingFollowups?: number;
  criticalCases?: number;
  onAddPatient?: () => void;
}

export const DirectoryHero: React.FC<DirectoryHeroProps> = ({
  totalPatients = 1420,
  todayAppointments = 8,
  pendingFollowups = 3,
  criticalCases = 2,
  onAddPatient,
}) => {
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="primary"
      padding="lg"
      className="border-primary/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-primary/5 space-y-6"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Info Column */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Clinical Roster Directory</span>
            </span>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Real-Time Health Vault Synced</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
            Patient Directory
          </h1>

          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
            Search, filter, and access complete clinical workspaces across your entire patient roster. Locate any patient in seconds to review vitals, telemetry, and AI insights.
          </p>
        </div>

        {/* Right Metrics Grid & Action */}
        <div className="flex items-center gap-3 flex-wrap shrink-0 w-full lg:w-auto">
          <div className="grid grid-cols-3 gap-2 flex-1 lg:flex-none text-center">
            <div className="p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl">
              <div className="text-lg sm:text-xl font-extrabold font-heading text-primary">{totalPatients}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Total Roster</div>
            </div>

            <div className="p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl">
              <div className="text-lg sm:text-xl font-extrabold font-heading text-foreground">{todayAppointments}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Today's Visits</div>
            </div>

            <div className="p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl">
              <div className="text-lg sm:text-xl font-extrabold font-heading text-amber-500">{pendingFollowups}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Follow-ups</div>
            </div>
          </div>

          <Button
            onClick={onAddPatient}
            className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-11 px-4 gap-2 shadow-md shadow-primary/20 shrink-0 w-full lg:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add Patient to Roster</span>
          </Button>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default DirectoryHero;
