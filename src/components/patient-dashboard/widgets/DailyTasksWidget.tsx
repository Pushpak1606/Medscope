import { useState } from "react";
import { CheckSquare, Circle, Sun, Droplets, Dumbbell, Brain, Moon, Stethoscope, GripVertical } from "lucide-react";
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

// Keep initial tasks outside so we can initialize state
const INITIAL_TASKS = [
  { id: "1", label: "Morning medicine", time: "8:00 AM", icon: Sun, completed: true },
  { id: "2", label: "Drink water (4/8)", time: "Ongoing", icon: Droplets, completed: false },
  { id: "3", label: "30 min exercise", time: "5:00 PM", icon: Dumbbell, completed: false },
  { id: "4", label: "Journal entry", time: "8:00 PM", icon: Brain, completed: false },
  { id: "5", label: "Evening medicine", time: "9:00 PM", icon: Moon, completed: false },
  { id: "6", label: "Consultation check-in", time: "Tomorrow", icon: Stethoscope, completed: false },
];

/**
 * SortableTaskItem Component
 * Handles the individual task row, drag handle, and toggle logic
 */
interface SortableTaskItemProps {
  task: typeof INITIAL_TASKS[0];
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

  const IconObj = task.icon;

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
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const completedCount = tasks.filter(t => t.completed).length;

  // Toggle completion status
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
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
    <div className="flex flex-col rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm p-6 sm:p-8 h-full">
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
