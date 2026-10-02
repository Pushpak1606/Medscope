import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Edit3, HeartHandshake, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😫", label: "Stressed" },
];

const MentalWellnessWidget = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -100 : 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div 
      onClick={() => navigate('/patient/wellness')}
      className="h-full flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 hover:shadow-md transition-shadow relative overflow-hidden group/card cursor-pointer"
    >
      {/* Solid top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-pink-400 opacity-80"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
          <Brain className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground text-base">Mental Wellness</h3>
          <p className="text-xs text-muted-foreground font-medium">How are you feeling?</p>
        </div>
        <Link to="/patient/wellness" className="text-pink-500 hover:text-pink-600 bg-pink-500/10 hover:bg-pink-500/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
          Open
        </Link>
      </div>

      {/* Mood Selector with Arrows */}
      <div className="relative group mb-6">
        {/* Left Arrow */}
        <button 
          onClick={(e) => { e.stopPropagation(); scroll('left'); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-2"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex justify-between sm:justify-around items-center bg-background p-2 rounded-2xl border border-border/30 shadow-sm overflow-x-auto hide-scrollbar gap-1 sm:gap-0 snap-x scroll-smooth"
        >
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl hover:bg-muted transition-colors min-w-[3rem] sm:min-w-[4rem] snap-center shrink-0"
              title={mood.label}
            >
              <span className="text-2xl sm:text-3xl transition-transform hover:scale-125">{mood.emoji}</span>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={(e) => { e.stopPropagation(); scroll('right'); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2.5 flex-1 flex flex-col justify-end">
        <Button 
          onClick={(e) => { e.stopPropagation(); navigate('/patient/mental-screening'); }}
          className="w-full justify-start h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-500 transition-all shadow-sm group/btn"
        >
          <Activity className="mr-3 h-4 w-4 text-pink-500" />
          <span className="font-semibold text-xs sm:text-sm">Clinical Screening (PHQ-9 / GAD-7)</span>
        </Button>

        <Button 
          onClick={(e) => { e.stopPropagation(); navigate('/patient/journal'); }}
          className="w-full justify-start h-11 rounded-xl bg-background border border-border/30 hover:bg-muted text-foreground transition-all shadow-sm group/btn"
        >
          <Edit3 className="mr-3 h-4 w-4 text-muted-foreground group-hover/btn:text-pink-500" />
          <span className="font-semibold text-xs sm:text-sm">Write in Journal</span>
        </Button>
        
        <Button 
          onClick={(e) => { e.stopPropagation(); navigate('/patient/ai-companion'); }}
          className="w-full justify-start h-11 rounded-xl bg-background border border-border/30 hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/30 text-foreground transition-all shadow-sm group/btn"
        >
          <HeartHandshake className="mr-3 h-4 w-4 text-muted-foreground group-hover/btn:text-purple-500" />
          <span className="font-semibold text-xs sm:text-sm">Talk to AI Companion</span>
        </Button>
      </div>
    </div>
  );
};

export default MentalWellnessWidget;
