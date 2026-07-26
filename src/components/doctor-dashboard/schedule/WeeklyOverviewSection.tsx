import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Calendar, Lock, UserCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export interface DayOverviewData {
  dayName: string;
  shortName: string;
  dateStr: string;
  isToday?: boolean;
  totalAppointments: number;
  followupsCount: number;
  blockedSlotsCount: number;
}

const WEEK_DAYS: DayOverviewData[] = [
  {
    dayName: "Monday",
    shortName: "Mon",
    dateStr: "Jul 27",
    totalAppointments: 9,
    followupsCount: 4,
    blockedSlotsCount: 1,
  },
  {
    dayName: "Tuesday",
    shortName: "Tue",
    dateStr: "Jul 28",
    totalAppointments: 7,
    followupsCount: 2,
    blockedSlotsCount: 2,
  },
  {
    dayName: "Wednesday",
    shortName: "Wed",
    dateStr: "Jul 29",
    totalAppointments: 10,
    followupsCount: 5,
    blockedSlotsCount: 0,
  },
  {
    dayName: "Thursday",
    shortName: "Thu",
    dateStr: "Jul 30",
    totalAppointments: 6,
    followupsCount: 2,
    blockedSlotsCount: 3,
  },
  {
    dayName: "Friday",
    shortName: "Fri",
    dateStr: "Jul 31",
    totalAppointments: 8,
    followupsCount: 3,
    blockedSlotsCount: 1,
  },
  {
    dayName: "Saturday",
    shortName: "Sat",
    dateStr: "Aug 01",
    totalAppointments: 4,
    followupsCount: 1,
    blockedSlotsCount: 4,
  },
];

export const WeeklyOverviewSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState("Mon");

  const handleSelectDay = (shortName: string, dayName: string) => {
    setSelectedDay(shortName);
    toast.info(`Viewing schedule overview for ${dayName}`);
  };

  return (
    <section aria-label="Weekly Overview Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Weekly Schedule Planner Overview"
          subtitle="Select a day to view upcoming workload, scheduled follow-ups, and reserved time slots."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Week 30 • 44 Total Appts
            </span>
          }
        />

        {/* Day Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDay === day.shortName;

            return (
              <button
                key={day.shortName}
                onClick={() => handleSelectDay(day.shortName, day.dayName)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-3 select-none cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                    : "bg-card/60 hover:bg-card/90 border-border/60 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-heading font-extrabold text-sm">{day.shortName}</div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-white/20 text-white border-white/20"
                        : "bg-muted text-muted-foreground border-border/40"
                    }`}
                  >
                    {day.dateStr}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={isSelected ? "text-white/80" : "text-muted-foreground"}>Appts:</span>
                    <strong className="font-bold">{day.totalAppointments}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={isSelected ? "text-white/80" : "text-muted-foreground"}>Follow-ups:</span>
                    <strong className="font-bold">{day.followupsCount}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-current/10">
                    <span className={isSelected ? "text-white/80" : "text-muted-foreground"}>Blocked:</span>
                    <span className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-amber-500"}`}>
                      {day.blockedSlotsCount} slots
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default WeeklyOverviewSection;
