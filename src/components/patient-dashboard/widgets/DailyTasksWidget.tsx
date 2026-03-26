import { Check, CheckSquare, Circle, Play, X, Sun, Droplets, Dumbbell, Brain, Moon, Stethoscope, Pill, Utensils, Calendar, Clock } from "lucide-react";
import { usePatient, ReminderType } from "@/context/PatientContext";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, any> = {
  Sun, Droplets, Dumbbell, Brain, Moon, Stethoscope, Pill, Utensils, Calendar, Clock
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

const DailyTasksWidget = () => {
  const { reminders, markReminderDone, snoozeReminder, deleteReminder } = usePatient();
  
  // Sort tasks chronologically
  const sortedTasks = [...reminders].sort((a, b) => parseTimeString(a.time) - parseTimeString(b.time));
  
  // Find index of the first incomplete (upcoming) task to highlight it
  const nextTaskIndex = sortedTasks.findIndex(t => t.status === "upcoming");
  const completedCount = sortedTasks.filter(t => t.status === "completed").length;

  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden h-full border border-border/50">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-extrabold text-xl text-foreground tracking-tight">Today's Care Plan</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">Your timeline for today.</p>
        </div>
        <div className="bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shrink-0">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums">
            {completedCount}/{sortedTasks.length} Done
          </span>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Continuous vertical timeline line */}
        <div className="absolute left-[23px] sm:left-[27px] top-[10px] bottom-[20px] w-[2px] bg-border rounded-full z-0"></div>

        <div className="space-y-6">
          {sortedTasks.map((task, index) => {
            const isCompleted = task.status === "completed";
            const isNext = index === nextTaskIndex;
            const IconObj = ICON_MAP[task.iconName] || Clock;
            
            return (
              <div key={task.id} className="relative flex gap-4 sm:gap-5 z-10 group">
                
                {/* Timeline Node */}
                <div className="relative flex flex-col items-center mt-1 shrink-0">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center border-4 border-card transition-all duration-300 ${
                    isCompleted 
                      ? "bg-emerald-500 text-white" 
                      : isNext 
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110 ring-4 ring-primary/20" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : <IconObj className="h-5 w-5 sm:h-6 sm:w-6" />}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 flex flex-col justify-center rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                  isNext 
                    ? "bg-background shadow-md border border-primary/20 scale-[1.02]" 
                    : isCompleted
                      ? "bg-transparent opacity-60"
                      : "bg-muted/30 border border-transparent hover:border-border"
                }`}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-base sm:text-lg font-bold line-clamp-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-xs sm:text-sm font-black tracking-tight tabular-nums px-2 py-0.5 rounded-md ${
                      isNext ? 'bg-primary/10 text-primary' : isCompleted ? 'bg-transparent text-muted-foreground' : 'bg-background text-muted-foreground'
                    }`}>
                      {task.time}
                    </span>
                  </div>
                  <p className={`text-sm ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'} font-medium line-clamp-1`}>
                    {task.type} • {task.repeat || 'One-time'}
                  </p>

                  {/* Actions for the Next Task */}
                  {isNext && (
                    <div className="mt-4 flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                      <Button 
                        onClick={() => markReminderDone(task.id)}
                        className="flex-1 sm:flex-none h-10 rounded-xl bg-primary text-primary-foreground shadow-sm hover:scale-105 transition-transform"
                      >
                        <Check className="h-4 w-4 mr-1.5" /> Done
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => snoozeReminder(task.id)}
                        className="flex-1 sm:flex-none h-10 rounded-xl bg-background border-border hover:bg-muted"
                      >
                        <Play className="h-4 w-4 mr-1.5" /> Snooze
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => deleteReminder(task.id)}
                        className="flex-none h-10 w-10 p-0 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                        title="Skip"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
          
          {sortedTasks.length === 0 && (
             <div className="text-center py-10 text-muted-foreground font-medium">
               No tasks scheduled for today.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTasksWidget;
