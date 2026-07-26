import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Calendar, Clock, Coffee, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export interface WorkingDaySchedule {
  dayName: string;
  active: boolean;
  startTime: string;
  endTime: string;
  breakSchedule: string;
}

const INITIAL_SCHEDULE: WorkingDaySchedule[] = [
  { dayName: "Monday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
  { dayName: "Tuesday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
  { dayName: "Wednesday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
  { dayName: "Thursday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
  { dayName: "Friday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
  { dayName: "Saturday", active: true, startTime: "09:00 AM", endTime: "01:00 PM", breakSchedule: "No Break" },
  { dayName: "Sunday", active: false, startTime: "Closed", endTime: "Closed", breakSchedule: "Off Day" },
];

export const WorkingHoursScheduleCard: React.FC = () => {
  const [schedule, setSchedule] = useState<WorkingDaySchedule[]>(INITIAL_SCHEDULE);

  const handleToggleDay = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayName === dayName ? { ...d, active: !d.active } : d))
    );
  };

  const handleSave = () => {
    toast.success("Working hours & shift schedule updated!");
  };

  return (
    <section aria-label="Working Hours Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Practitioner Working Hours & Shift Schedule"
          subtitle="Configure weekly consultation availability, shift hours & daily break slots."
          action={
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-9 px-4 gap-1.5 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Schedule</span>
            </Button>
          }
        />

        <div className="space-y-3">
          {schedule.map((day) => (
            <div
              key={day.dayName}
              className={`p-4 rounded-2xl border backdrop-blur-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                day.active
                  ? "bg-card/70 border-border/60"
                  : "bg-card/30 border-border/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-[140px]">
                <Switch checked={day.active} onCheckedChange={() => handleToggleDay(day.dayName)} />
                <span className="text-sm font-bold font-heading text-foreground">{day.dayName}</span>
              </div>

              {day.active ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Shift Hours:</span>
                    <div className="font-bold text-foreground">{day.startTime} - {day.endTime}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Break Slot:</span>
                    <div className="font-medium text-amber-500 flex items-center gap-1">
                      <Coffee className="h-3 w-3" /> {day.breakSchedule}
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">Status: Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-bold text-muted-foreground">Day Off / Closed</div>
              )}
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default WorkingHoursScheduleCard;
