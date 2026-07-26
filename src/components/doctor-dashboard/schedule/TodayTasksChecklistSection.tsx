import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { CheckSquare, Square, CheckCircle2, FileText, Pill, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export interface ClinicalTask {
  id: string;
  category: "lab" | "rx" | "notes" | "community";
  title: string;
  patientName?: string;
  dueDate: string;
  completed: boolean;
}

const INITIAL_TASKS: ClinicalTask[] = [
  {
    id: "tsk-1",
    category: "lab",
    title: "Review urgent Troponin T lab report & ECG for Marcus Vance",
    patientName: "Marcus Vance",
    dueDate: "09:00 AM",
    completed: false,
  },
  {
    id: "tsk-2",
    category: "rx",
    title: "Approve Clopidogrel & Atorvastatin dosage adjustments",
    patientName: "Marcus Vance",
    dueDate: "10:30 AM",
    completed: false,
  },
  {
    id: "tsk-3",
    category: "notes",
    title: "Finalize & sign SOAP consultation notes for morning shift",
    dueDate: "01:00 PM",
    completed: false,
  },
  {
    id: "tsk-4",
    category: "community",
    title: "Answer 2 patient Q&A threads in Cardiology Community Group",
    dueDate: "03:30 PM",
    completed: true,
  },
];

const categoryIcons = {
  lab: FileText,
  rx: Pill,
  notes: CheckCircle2,
  community: MessageSquare,
};

export const TodayTasksChecklistSection: React.FC = () => {
  const [tasks, setTasks] = useState<ClinicalTask[]>(INITIAL_TASKS);

  const handleToggleTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          toast.success(
            nextState ? `Task completed: ${title}` : `Task reopened: ${title}`
          );
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section aria-label="Today's Tasks Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Today's Clinical Tasks Checklist"
          subtitle="Essential daily tasks: Lab reviews, Rx approvals, SOAP documentation & community responses."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
              {completedCount} / {tasks.length} Completed
            </span>
          }
        />

        <div className="space-y-3">
          {tasks.map((task) => {
            const IconComponent = categoryIcons[task.category];

            return (
              <button
                key={task.id}
                onClick={() => handleToggleTask(task.id, task.title)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 select-none cursor-pointer ${
                  task.completed
                    ? "bg-card/40 border-border/40 opacity-70"
                    : "bg-card/70 hover:bg-card border-border/60 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-primary shrink-0">
                    {task.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div
                      className={`text-xs sm:text-sm font-bold font-heading truncate ${
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.patientName && (
                      <div className="text-[11px] font-medium text-primary flex items-center gap-1">
                        <IconComponent className="h-3 w-3" />
                        <span>{task.patientName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs font-semibold text-muted-foreground bg-background/50 px-2.5 py-1 rounded-lg border border-border/40 shrink-0">
                  Due: {task.dueDate}
                </span>
              </button>
            );
          })}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default TodayTasksChecklistSection;
