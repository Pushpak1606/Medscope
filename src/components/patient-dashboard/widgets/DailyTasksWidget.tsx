import { useState, useEffect } from "react";
import { CheckSquare, Circle, Sun, Droplets, Dumbbell, Brain, Moon, Stethoscope, GripVertical, Pill, Utensils, Calendar, Clock } from "lucide-react";
import { usePatient, ReminderType } from "@/context/PatientContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ICON_MAP: Record<string, any> = {
  Sun, Droplets, Dumbbell, Brain, Moon, Stethoscope, Pill, Utensils, Calendar, Clock
};

interface SortableTaskItemProps {
  task: { id: string; label: string; time: string; iconName: string; completed: boolean };
  onToggle: (id: string) => void;
}

const SortableTaskItem = ({ task, onToggle }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const IconObj = ICON_MAP[task.iconName] || Clock;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
        isDragging ? "bg-muted/50 border-primary/50 shadow-md scale-[1.02]" :
        task.completed 
          ? 'bg-muted/30 border-border/40 opacity-70' 
          : 'bg-background hover:bg-muted/50 border-border/60 shadow-sm group'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 -ml-2 rounded-md hover:bg-muted transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 opacity-40 hover:opacity-100" />
        </button>

        {/* Task Icon */}
        <div className={`h-10 w-10 rounded-xl flex items-center flex-shrink-0 justify-center ${
          task.completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:text-foreground'
        }`}>
          <IconObj className="h-5 w-5" />
        </div>

        {/* Task Details */}
        <div className="flex flex-col items-start gap-1">
          <span className={`text-sm font-bold line-clamp-1 ${task.completed ? 'text-muted-foreground line-through decoration-2' : 'text-foreground'}`}>
            {task.label}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{task.time}</span>
        </div>
      </div>

      {/* Checkbox / Toggle Button */}
      <button 
        className="p-2 -mr-2 rounded-full hover:bg-muted/80 transition-colors flex-shrink-0 relative z-10"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? (
          <CheckSquare className="h-6 w-6 text-primary" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>
    </div>
  );
};


/**
 * DailyTasksWidget Main Component
 */
const DailyTasksWidget = () => {
  const { reminders, markReminderDone } = usePatient();
  const [tasks, setTasks] = useState<{ id: string; label: string; time: string; iconName: string; completed: boolean }[]>([]);

  useEffect(() => {
    // Sync reminders to local tasks
    const mapped = reminders.map(r => ({
      id: r.id,
      label: r.title,
      time: r.time,
      iconName: r.iconName,
      completed: r.status === "completed"
    }));

    // Maintain drag order if exists
    setTasks(prev => {
      if (prev.length === 0) return mapped;
      
      const orderMap = new Map(prev.map((t, i) => [t.id, i]));
      const sorted = [...mapped].sort((a, b) => {
        const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
        const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
        return indexA - indexB;
      });
      return sorted;
    });
  }, [reminders]);

  const completedCount = tasks.filter(t => t.completed).length;

  const toggleTask = (id: string) => {
    markReminderDone(id); // Global update
  };

  // Drag and drop setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 h-full relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-400 opacity-80"></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-bold text-xl text-foreground font-heading">Today's Care Plan</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Stay on track. Drag to reorder.</p>
        </div>
        <div className="bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 self-start sm:self-auto">
          <span className="font-bold text-primary text-sm tracking-tight">{completedCount}/{tasks.length} Done</span>
        </div>
      </div>

      <div className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {tasks.map((task) => (
                <SortableTaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DailyTasksWidget;
