import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/context/PatientContext";
import { Sun, Moon, CloudSun, Sparkles, Check, Play, Pill, Utensils, Droplets, Calendar, Brain, CheckCircle2, Clock, X } from "lucide-react";
import { toast } from "sonner";

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
  if (!match) return new Date().getTime();
  const [, hrs, mins, period] = match;
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

  // -- Animation & Space-Saving Auto-Dismiss Logic --
  const [celebrated, setCelebrated] = useState(false);
  const [hideNextAction, setHideNextAction] = useState(false);

  useEffect(() => {
    if (!upcomingMed && !celebrated) {
      setCelebrated(true);
      toast.success("All tasks completed! You're all caught up for today.");
      // Auto-dismiss after 3.5 seconds to reclaim screen space on mobile & desktop
      const timer = setTimeout(() => {
        setHideNextAction(true);
      }, 3500);
      return () => clearTimeout(timer);
    } else if (upcomingMed) {
      setCelebrated(false);
      setHideNextAction(false);
    }
  }, [upcomingMed, celebrated]);

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
          {subtitle} {pendingCount > 0 ? `You have ${pendingCount} pending tasks.` : "You're all caught up!"}
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

      {/* RIGHT: Primary Action / Next Reminder with Smooth Celebration & Auto-Dismiss */}
      <AnimatePresence mode="wait">
        {(!hideNextAction || upcomingMed) && (
          <motion.div
            key={upcomingMed ? upcomingMed.id : "all-clear"}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, height: 0, padding: 0, overflow: "hidden" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:w-[380px] shrink-0 bg-background/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 relative z-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-foreground font-heading">Next Action</h3>
              {upcomingMed ? (
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full shrink-0">
                  {upcomingMed.type}
                </span>
              ) : (
                <button
                  onClick={() => setHideNextAction(true)}
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1 opacity-70 hover:opacity-100"
                  title="Dismiss to save display space"
                >
                  <span>Close</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {upcomingMed ? (
              <div className="flex-1 flex flex-col justify-between">
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-foreground truncate mb-1" title={upcomingMed.title}>
                      {upcomingMed.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium truncate">
                      {upcomingMed.repeat || "Scheduled for today"}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
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
              /* --- ALL CLEAR SMOOTH CELEBRATION ANIMATION --- */
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-4 relative"
              >
                <div className="relative mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/10 blur-sm pointer-events-none"
                  />
                  <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 relative z-10 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                </div>
                <h4 className="text-lg font-extrabold text-foreground mb-1">All clear!</h4>
                <p className="text-xs text-muted-foreground font-medium max-w-[210px] leading-relaxed">
                  Great job completing today's tasks. Auto-closing to save screen space...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HealthOverviewWidget;
