import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { Pill, Utensils, Droplets, Calendar, Brain, Clock, CheckCircle2, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Plus, Flame, RefreshCcw, BellOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePatient, ReminderType } from "@/context/PatientContext";

const ICON_MAP: Record<string, any> = {
  Pill,
  Utensils,
  Droplets,
  Calendar,
  Brain,
  Clock,
};

const TYPE_MAP: Record<ReminderType, { icon: string, color: string, bg: string }> = {
  All: { icon: "Clock", color: "text-primary", bg: "bg-primary/10" },
  Medicines: { icon: "Pill", color: "text-blue-500", bg: "bg-blue-500/10" },
  Meals: { icon: "Utensils", color: "text-orange-500", bg: "bg-orange-500/10" },
  Water: { icon: "Droplets", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  Appointments: { icon: "Calendar", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Wellness: { icon: "Brain", color: "text-purple-500", bg: "bg-purple-500/10" },
};

const FILTER_CHIPS: ReminderType[] = ["All", "Medicines", "Meals", "Water", "Appointments", "Wellness"];

const RemindersPage = () => {
  const { reminders, addReminder, markReminderDone } = usePatient();
  const [activeFilter, setActiveFilter] = useState<ReminderType>("All");
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Add Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newHour, setNewHour] = useState(8);
  const [newMinute, setNewMinute] = useState(0);
  const [newPeriod, setNewPeriod] = useState<"AM" | "PM">("AM");
  const [newType, setNewType] = useState<ReminderType>("Medicines");
  const [newRepeat, setNewRepeat] = useState("One-time");

  const cycleHour = (dir: 1 | -1) => setNewHour(h => { const n = h + dir; if (n > 12) return 1; if (n < 1) return 12; return n; });
  const cycleMinute = (dir: 1 | -1) => setNewMinute(m => { const n = m + dir * 5; if (n >= 60) return 0; if (n < 0) return 55; return n; });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const displayTime = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')} ${newPeriod}`;
    const style = TYPE_MAP[newType];
    addReminder({
      title: newTitle,
      time: displayTime,
      type: newType,
      status: "upcoming",
      repeat: newRepeat,
      iconName: style.icon,
      color: style.color,
      bg: style.bg
    });

    setIsAddOpen(false);
    setNewTitle("");
    setNewHour(8);
    setNewMinute(0);
    setNewPeriod("AM");
  };

  // Filter out completed tasks as requested
  const filteredReminders = reminders.filter((r) => r.status !== "completed" && (activeFilter === "All" || r.type === activeFilter));
  
  const totalToday = reminders.filter(r => r.time.includes("AM") || r.time.includes("PM")).length;
  const completedToday = reminders.filter(r => r.status === "completed").length;
  const nextUpcoming = reminders.find(r => r.status === "upcoming");

  return (
    <PatientPageLayout className="pb-32 sm:pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title="Reminders"
          subtitle="Manage your daily health routines, medications, and wellness goals."
        />
      </motion.div>

      {/* Top Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-4"
      >
        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-primary/50 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Today's Tasks</p>
            <p className="text-3xl font-extrabold text-foreground">{totalToday}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-emerald-500/50 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-foreground">{completedToday}<span className="text-sm text-muted-foreground ml-1">/{totalToday}</span></p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <Flame className="h-6 w-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-blue-500/50 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Up Next</p>
            <p className="text-lg font-bold text-foreground line-clamp-1">{nextUpcoming?.title || "All caught up!"}</p>
            {nextUpcoming && <p className="text-xs font-semibold text-blue-500 tracking-wide mt-0.5">{nextUpcoming.time}</p>}
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <Clock className="h-6 w-6" />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* Main List Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Filter Chips with Arrows */}
            <div className="relative group mb-6">
              {/* Left Arrow */}
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-3 sm:-ml-4"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-2 py-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
              >
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveFilter(chip)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all snap-start shadow-sm border",
                      activeFilter === chip
                        ? "bg-foreground text-background border-foreground hover:bg-foreground/90 scale-105"
                        : "bg-background text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground hover:border-border"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-3 sm:-mr-4"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Reminder List */}
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-3xl border border-border/40 bg-card">
                     <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                        <div className="h-14 w-14 shrink-0 rounded-[1.25rem] bg-muted animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                           <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                        </div>
                     </div>
                     <div className="flex w-full sm:w-auto items-center gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 sm:border-0 border-t border-border/30">
                        <div className="h-10 w-24 bg-muted animate-pulse rounded-2xl hidden sm:block"></div>
                        <div className="h-10 w-full sm:w-28 bg-muted animate-pulse rounded-2xl"></div>
                     </div>
                  </div>
                ))
              ) : filteredReminders.length > 0 ? (
                filteredReminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className={cn(
                      "group relative flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-3xl border transition-all duration-300",
                      reminder.status === "completed" ? "bg-muted/30 border-transparent opacity-75" : "bg-card border-border/40 hover:shadow-md hover:border-border/80"
                    )}
                  >
                    
                    {/* Left Info */}
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                      <div className={cn(
                        "h-14 w-14 shrink-0 rounded-[1.25rem] flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105", 
                        reminder.status === "completed" ? "bg-muted text-muted-foreground border-border/40" : ` border-white/20 ${reminder.bg} ${reminder.color}`
                      )}>
                        {(() => {
                          const Icon = ICON_MAP[reminder.iconName] || Clock;
                          return <Icon className="h-6 w-6 relative z-10" />
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn("font-bold text-base sm:text-lg line-clamp-1", reminder.status === "completed" ? "text-muted-foreground line-through" : "text-foreground")}>
                            {reminder.title}
                          </h4>
                          {reminder.status === "missed" && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">Missed</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                          <span className={cn("flex items-center gap-1", reminder.status === "upcoming" ? "text-primary font-bold" : "")}>
                            <Clock className="h-3.5 w-3.5" /> {reminder.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCcw className="h-3.5 w-3.5" /> {reminder.repeat}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full sm:w-auto items-center gap-2 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/30 sm:border-0">
                      {reminder.status === "upcoming" ? (
                        <>
                          <button 
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-background border border-border/60 text-muted-foreground font-bold text-sm hover:bg-muted transition-colors"
                          >
                            Snooze
                          </button>
                          <LiquidGlassButton 
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl text-sm"
                            onClick={() => markReminderDone(reminder.id)}
                          >
                            Done <CheckCircle2 className="h-4 w-4 ml-1.5" />
                          </LiquidGlassButton>
                        </>
                      ) : reminder.status === "completed" ? (
                        <div className="w-full sm:w-auto px-4 py-2.5 flex items-center justify-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 rounded-2xl">
                          <CheckCircle2 className="h-4 w-4" /> Completed
                        </div>
                      ) : (
                        <button className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-background border border-border/60 text-foreground font-bold text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2">
                           <RefreshCcw className="h-4 w-4" /> Reschedule
                        </button>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-border/50 bg-muted/10">
                  <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <BellOff className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">No upcoming reminders</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">You've completely cleared your schedule. Take a breather or add a new routine.</p>
                  <LiquidGlassButton className="px-6" onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-5 w-5" /> Create Reminder
                  </LiquidGlassButton>
                </div>
              )}
            </div>

          </GlassCard>
        </div>

        {/* Right Sidebar - Sticky Add Button & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Action Card */}
            <GlassCard className="p-6 text-center border-t-4 border-t-primary shadow-lg sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden sm:flex flex-col items-center">
              <div className="h-16 w-16 mb-4 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                 <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">New Reminder</h3>
              <p className="text-sm text-muted-foreground mb-6">Create a custom schedule for meals, hydration, or meds.</p>
              <LiquidGlassButton className="w-full py-6 text-base rounded-[1.5rem]" onClick={() => setIsAddOpen(true)}>
                 Build Routine <ChevronRight className="ml-2 h-5 w-5" />
              </LiquidGlassButton>
            </GlassCard>

            {/* Streak Card */}
            <GlassCard className="p-6 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden relative group">
              <div className="absolute top-0 right-0 h-32 w-32 bg-orange-500/10 blur-3xl pointer-events-none rounded-full"></div>
              <h4 className="font-bold text-lg mb-4 text-foreground relative z-10 flex items-center gap-2">
                 <Flame className="h-5 w-5 text-orange-500" /> Consistency Streak
              </h4>
              <div className="flex items-end gap-2 mb-2 relative z-10">
                <span className="text-5xl font-extrabold text-foreground tracking-tighter">12</span>
                <span className="text-muted-foreground font-semibold mb-1 tracking-wide">Days</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-4 relative z-10">You're doing amazing! Just 2 more days to reach your next milestone.</p>
              
              <div className="flex gap-1 mt-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex-1 h-3 rounded-sm bg-muted overflow-hidden">
                    <div className={cn("h-full", i < 5 ? "bg-orange-500" : i === 5 ? "bg-orange-500 w-1/2" : "")}></div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        </div>

      </motion.div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-20 left-4 right-4 z-40 sm:hidden pb-safe">
        <LiquidGlassButton className="w-full py-4 rounded-2xl shadow-xl shadow-primary/20 text-lg" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-6 w-6" /> Add Reminder
        </LiquidGlassButton>
      </div>

      {/* Premium Add Reminder Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg !rounded-[2.5rem] p-0 border-0 bg-transparent shadow-2xl shadow-black/20 overflow-hidden [&>button:last-child]:hidden">
          {/* Glass Container */}
          <div className="relative bg-card/95 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] overflow-hidden">
            {/* Top Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-primary/15 blur-[60px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>

            {/* Header */}
            <div className="relative px-8 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogHeader className="p-0 space-y-0">
                      <DialogTitle className="text-2xl font-heading font-extrabold text-foreground tracking-tight">New Reminder</DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Set up a new health routine</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="h-9 w-9 rounded-xl bg-muted/50 hover:bg-muted border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAdd} className="px-8 pb-8 space-y-6">
              
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reminder Title</label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Take Vitamin D3"
                    className="w-full bg-muted/30 border border-border/50 rounded-2xl px-5 py-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-background transition-all"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>

              {/* Custom Time Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Schedule Time
                </label>
                <div className="flex items-center justify-center gap-3 bg-muted/20 border border-border/40 rounded-2xl p-4">
                  {/* Hour Column */}
                  <div className="flex flex-col items-center gap-1">
                    <button type="button" onClick={() => cycleHour(1)} className="h-8 w-8 rounded-xl bg-muted/40 hover:bg-muted border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <div className="h-14 w-16 rounded-2xl bg-background border-2 border-primary/30 shadow-sm shadow-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-extrabold font-heading text-foreground tracking-tighter">{String(newHour).padStart(2, '0')}</span>
                    </div>
                    <button type="button" onClick={() => cycleHour(-1)} className="h-8 w-8 rounded-xl bg-muted/40 hover:bg-muted border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Separator */}
                  <span className="text-2xl font-extrabold text-muted-foreground/60 select-none pb-0.5">:</span>

                  {/* Minute Column */}
                  <div className="flex flex-col items-center gap-1">
                    <button type="button" onClick={() => cycleMinute(1)} className="h-8 w-8 rounded-xl bg-muted/40 hover:bg-muted border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <div className="h-14 w-16 rounded-2xl bg-background border-2 border-primary/30 shadow-sm shadow-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-extrabold font-heading text-foreground tracking-tighter">{String(newMinute).padStart(2, '0')}</span>
                    </div>
                    <button type="button" onClick={() => cycleMinute(-1)} className="h-8 w-8 rounded-xl bg-muted/40 hover:bg-muted border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="flex flex-col gap-1.5 ml-2">
                    <button
                      type="button"
                      onClick={() => setNewPeriod("AM")}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 border",
                        newPeriod === "AM"
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50"
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPeriod("PM")}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 border",
                        newPeriod === "PM"
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50"
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Selector - Interactive Pills */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(TYPE_MAP) as ReminderType[]).filter(t => t !== "All").map(type => {
                    const cfg = TYPE_MAP[type];
                    const IconComp = ICON_MAP[cfg.icon] || Clock;
                    const isSelected = newType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewType(type)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200",
                          isSelected
                            ? `${cfg.bg} ${cfg.color} border-current shadow-sm scale-[1.02]`
                            : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        <IconComp className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-none">{type.slice(0, 5)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Repeat Frequency - Pill Toggles */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCcw className="h-3 w-3" /> Repeat Frequency
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["One-time", "Daily", "Weekly", "Monthly"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNewRepeat(opt)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border",
                        newRepeat === opt
                          ? "bg-foreground text-background border-foreground shadow-sm scale-[1.02]"
                          : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent"></div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 px-5 py-4 rounded-2xl bg-muted/40 border border-border/40 text-muted-foreground font-bold text-sm hover:bg-muted/60 hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" className="flex-[1.5] py-4 text-sm rounded-2xl">
                  <Plus className="h-4 w-4 mr-1.5" /> Create Reminder
                </LiquidGlassButton>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

    </PatientPageLayout>
  );
};

export default RemindersPage;
