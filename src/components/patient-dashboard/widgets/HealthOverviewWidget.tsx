import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePatient, Reminder } from "@/context/PatientContext";
import { Sun, Moon, CloudSun, Sparkles, Check, Play, Pill, Utensils, Droplets, Calendar, Brain, CheckCircle2, Clock } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  Medicines: Pill,
  Meals: Utensils,
  Water: Droplets,
  Appointments: Calendar,
  Wellness: Brain,
};

// Helper to convert "08:00 AM" to today's Date object for sorting
const parseTimeString = (timeStr: string) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return new Date().getTime(); // Fallback
  let [, hrs, mins, period] = match;
  let hours = parseInt(hrs, 10);
  if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  
  const d = new Date();
  d.setHours(hours, parseInt(mins, 10), 0, 0);
  return d.getTime();
};

const HealthOverviewWidget = () => {
  const { profile, reminders, markReminderDone, snoozeReminder } = usePatient();
  
  // -- Time-Aware Greeting Logic --
  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  let subtitle = "Time to wind down and rest.";
  let timeTheme = "from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20";
  let TimeIcon = Moon;
  let iconColor = "text-indigo-400";
  let iconBg = "bg-indigo-500/10";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    subtitle = "Stay on track today.";
    timeTheme = "from-amber-500/15 via-orange-500/5 to-transparent border-amber-500/20";
    TimeIcon = Sun;
    iconColor = "text-amber-500";
    iconBg = "bg-amber-500/10";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
    subtitle = "Keep up the great momentum.";
    timeTheme = "from-blue-500/15 via-cyan-500/5 to-transparent border-blue-500/20";
    TimeIcon = CloudSun;
    iconColor = "text-blue-500";
    iconBg = "bg-blue-500/10";
  }

  const displayName = profile.fullName?.split(" ")[0] || "Patient";

  // -- Reminder Logic --
  const upcomingReminders = reminders
    .filter(r => r.status === "upcoming")
    .sort((a, b) => parseTimeString(a.time) - parseTimeString(b.time));
    
  const pendingCount = upcomingReminders.length;
  const upcomingMed = upcomingReminders.length > 0 ? upcomingReminders[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 bg-card rounded-[2.5rem] border shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 lg:p-10 relative overflow-hidden group"
    >
      {/* Background Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-br ${timeTheme} opacity-50 z-0 pointer-events-none`}></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.08),transparent_70%)] z-0 pointer-events-none translate-x-[20%] translate-y-[-20%]"></div>

      {/* LEFT: Greeting & Quick Stats */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm ${iconBg} ${iconColor}`}>
            <TimeIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight leading-tight">
              {greeting}, <br className="hidden sm:block lg:hidden" /><span className="text-primary">{displayName}</span>
            </h1>
          </div>
        </div>
        
        <p className="text-lg sm:text-xl text-muted-foreground font-medium mb-8 max-w-md">
          {subtitle} {pendingCount > 0 ? `You have ${pendingCount} pending tasks.` : "You're all caught up! 🎉"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-background/80 backdrop-blur-md text-amber-500 border border-amber-500/20 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            12 Day Streak
          </div>
          <div className="px-4 py-2 bg-background/80 backdrop-blur-md text-emerald-500 border border-emerald-500/20 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
             Profile {profile.profileCompleteness ?? 85}%
          </div>
        </div>
      </div>

      {/* RIGHT: Primary Action / Next Reminder */}
      <div className="lg:w-[400px] shrink-0 bg-background/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 relative z-10 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-foreground font-heading">Next Action</h3>
          {upcomingMed && (
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full shrink-0">
              {upcomingMed.type}
            </span>
          )}
        </div>

        {upcomingMed ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Horizontal Layout for the reminder content */}
            <div className="flex items-center gap-4 mb-6">
              {/* Progress Ring */}
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0">
                <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="transparent" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="8" 
                    strokeDasharray="289" 
                    strokeDashoffset="72" 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {(() => {
                    const Icon = TYPE_ICONS[upcomingMed.type] || Clock;
                    return <Icon className={`h-4 w-4 mb-0.5 ${upcomingMed.color}`} />
                  })()}
                  <span className="text-[10px] font-black tracking-tighter tabular-nums">{upcomingMed.time}</span>
                </div>
              </div>

              {/* Reminder Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-foreground truncate mb-1" title={upcomingMed.title}>
                  {upcomingMed.title}
                </h4>
                <p className="text-sm text-muted-foreground font-medium truncate">
                  {upcomingMed.repeat || "Scheduled for today"}
                </p>
              </div>
            </div>

            {/* Actions aligned to bottom */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => snoozeReminder(upcomingMed.id)}
                className="flex-1 rounded-xl h-11 bg-background/50 border-border hover:bg-muted font-bold text-sm"
              >
                <Play className="h-4 w-4 mr-2" /> Snooze
              </Button>
              <Button 
                onClick={() => markReminderDone(upcomingMed.id)}
                className="flex-1 rounded-xl h-11 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform font-bold text-sm"
              >
                <Check className="h-4 w-4 mr-2" /> Taken
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2">All clear!</h4>
            <p className="text-sm text-muted-foreground font-medium">No pending actions for today.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HealthOverviewWidget;
