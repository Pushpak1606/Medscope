import { Brain, Edit3, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😫", label: "Stressed" },
];

const MentalWellnessWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Subtle top-light gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-500 opacity-50"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Mental Wellness</h3>
          <p className="text-xs text-muted-foreground font-medium">How are you feeling?</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="flex justify-between items-center mb-6 bg-background/50 p-2 rounded-2xl border border-border/60">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition-colors sm:min-w-[48px]"
            title={mood.label}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-end">
        <Button className="w-full justify-start h-12 rounded-xl bg-background border border-border/60 hover:bg-pink-500/10 hover:text-pink-600 hover:border-pink-500/30 text-foreground transition-all shadow-sm group/btn">
          <Edit3 className="mr-3 h-4 w-4 text-muted-foreground group-hover/btn:text-pink-500" />
          <span className="font-semibold text-sm">Write in Journal</span>
        </Button>
        
        <Button className="w-full justify-start h-12 rounded-xl bg-background border border-border/60 hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/30 text-foreground transition-all shadow-sm group/btn">
          <HeartHandshake className="mr-3 h-4 w-4 text-muted-foreground group-hover/btn:text-purple-500" />
          <span className="font-semibold text-sm">Talk to AI Companion</span>
        </Button>
      </div>
    </div>
  );
};

export default MentalWellnessWidget;
