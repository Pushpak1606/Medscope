import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { ShieldCheck, MessageSquare, AlertTriangle, Plus, Users, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoctor } from "@/context/DoctorContext";

export interface DoctorCommunityHeroProps {
  doctorName?: string;
  specialty?: string;
  pendingReportsCount?: number;
  verifiedAnswersCount?: number;
  onCreateAnnouncement?: () => void;
}

export const DoctorCommunityHero: React.FC<DoctorCommunityHeroProps> = ({
  doctorName,
  specialty,
  pendingReportsCount = 3,
  verifiedAnswersCount = 12,
  onCreateAnnouncement,
}) => {
  const { doctorProfile } = useDoctor();
  const name = doctorName || doctorProfile.fullName;
  const spec = specialty || doctorProfile.specialty;
  return (
    <DoctorGlassCard
      variant="glow"
      glowColor="emerald"
      padding="lg"
      className="border-emerald-500/30 relative overflow-hidden bg-gradient-to-r from-card/90 via-card/70 to-emerald-500/5"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Doctor Moderator Info & Badge */}
        <div className="space-y-2 max-w-3xl min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Clinical Moderator</span>
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {spec}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground tracking-tight truncate">
            Doctor Community Workspace
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
            Welcome, {name}. Guide patient discussions, answer medical inquiries, review flagged misinformation, and publish verified health guidance for Medscope communities.
          </p>
        </div>

        {/* Right Side: Moderation Metrics & Action Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-2 lg:pt-0">
          <div className="px-4 py-3 rounded-2xl bg-card/80 border border-emerald-500/30 backdrop-blur-md text-center">
            <div className="text-2xl font-extrabold font-heading text-rose-500">{pendingReportsCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pending Reports</div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-card/80 border border-emerald-500/30 backdrop-blur-md text-center">
            <div className="text-2xl font-extrabold font-heading text-emerald-500">{verifiedAnswersCount}</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Verified Answers</div>
          </div>

          <Button
            onClick={onCreateAnnouncement}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11 px-4 gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Post Announcement</span>
          </Button>
        </div>

      </div>
    </DoctorGlassCard>
  );
};

export default DoctorCommunityHero;
