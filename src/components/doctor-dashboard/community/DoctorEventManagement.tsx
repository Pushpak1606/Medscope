import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Calendar, Users, Video, Play, Edit3, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface DoctorCommunityEvent {
  id: string;
  title: string;
  hostDoctor: string;
  dateStr: string;
  timeStr: string;
  participantsCount: number;
  maxCapacity: number;
  status: "upcoming" | "live" | "completed";
  description: string;
}

const INITIAL_EVENTS: DoctorCommunityEvent[] = [
  {
    id: "evt-1",
    title: "Live Q&A: Cardiac Stent Recovery & Exercise Safety",
    hostDoctor: "Dr. Sarah Jenkins, MD",
    dateStr: "Tomorrow • July 27",
    timeStr: "05:00 PM - 06:00 PM EST",
    participantsCount: 142,
    maxCapacity: 250,
    status: "upcoming",
    description: "Interactive webinar discussing post-stent exercise limits, cardiac rehabilitation, and blood thinner medication adherence.",
  },
  {
    id: "evt-2",
    title: "Understanding CGM Glycemic Variability Workshop",
    hostDoctor: "Dr. Sarah Jenkins, MD",
    dateStr: "Thursday • July 30",
    timeStr: "04:00 PM - 05:00 PM EST",
    participantsCount: 88,
    maxCapacity: 150,
    status: "upcoming",
    description: "Practical guide to interpreting continuous glucose monitor trend arrows and adjusting mealtime bolus doses.",
  },
];

export const DoctorEventManagement: React.FC = () => {
  const [events, setEvents] = useState<DoctorCommunityEvent[]>(INITIAL_EVENTS);

  const handleStartSession = (title: string) => {
    toast.success(`Broadcasting Live Telehealth Stream: ${title}`);
  };

  const handleViewParticipants = (title: string, count: number) => {
    toast.info(`Viewing ${count} registered patient participants for ${title}`);
  };

  const handleScheduleNew = () => {
    toast.info("Opening Community Live Event Scheduler...");
  };

  return (
    <section aria-label="Doctor Event Management Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Live Community Events & Webinars (Host Control)"
          subtitle="Schedule and host interactive Q&A webinars, cardiac workshops & patient education sessions."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {events.length} Scheduled Live Sessions
            </span>
          }
          action={
            <Button
              onClick={handleScheduleNew}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Live Session</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-emerald-500/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                    <Video className="h-3 w-3" /> {evt.dateStr}
                  </span>

                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" /> {evt.timeStr}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground">{evt.title}</h4>

                <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/40 p-2.5 rounded-xl border border-border/30">
                  {evt.description}
                </p>

                <div className="flex items-center justify-between text-xs bg-background/50 p-2.5 rounded-xl border border-border/30">
                  <span className="text-muted-foreground">Registered Patients:</span>
                  <strong className="text-primary font-bold flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {evt.participantsCount} / {evt.maxCapacity}
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  onClick={() => handleViewParticipants(evt.title, evt.participantsCount)}
                  variant="outline"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-3 gap-1.5"
                >
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>View Roster</span>
                </Button>

                <Button
                  onClick={() => handleStartSession(evt.title)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Live Session</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default DoctorEventManagement;
