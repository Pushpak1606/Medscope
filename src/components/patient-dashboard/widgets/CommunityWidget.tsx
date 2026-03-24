import { Users, MessagesSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const GROUPS = [
  { name: "Anxiety Recovery", members: "1.2k", active: true },
  { name: "Healthy Heart Tips", members: "840", active: false },
];

const CommunityWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2rem] bg-card border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Subtle top-light gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Community Focus</h3>
            <p className="text-xs text-muted-foreground font-medium">You are not alone</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-background/50 border border-border/60 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{group.name}</span>
                  {group.active && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{group.members} Members</span>
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold bg-background sm:w-auto w-full group/btn">
              <MessagesSquare className="mr-1.5 h-3.5 w-3.5 text-muted-foreground group-hover/btn:text-primary" /> Join
            </Button>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-sm font-semibold text-orange-500 hover:bg-orange-500/10">
        Discover More Groups
      </Button>
    </div>
  );
};

export default CommunityWidget;
