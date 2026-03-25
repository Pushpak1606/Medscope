import { Edit3, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileSnapshotWidgetProps {
  profile: any;
}

const ProfileSnapshotWidget = ({ profile }: ProfileSnapshotWidgetProps) => {
  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 right-0 h-2 bg-primary/80"></div>
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt={profile.name} />
            <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 rounded-full border-4 border-background"></div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-heading text-foreground">{profile.name}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5" /> 
            {profile.healthFocus === "physical" ? "Physical Care" : profile.healthFocus === "mental" ? "Mental Wellness" : "Balanced Wellness"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-background/50 border border-border/30 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Blood</p>
          <p className="font-bold text-foreground">O+</p>
        </div>
        <div className="p-3 rounded-2xl bg-background/50 border border-border/30 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Age</p>
          <p className="font-bold text-foreground">28</p>
        </div>
        <div className="p-3 rounded-2xl bg-background/50 border border-border/30 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Height</p>
          <p className="font-bold text-foreground">170<span className="text-[10px] text-muted-foreground ml-0.5">cm</span></p>
        </div>
        <div className="p-3 rounded-2xl bg-background/50 border border-border/30 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Weight</p>
          <p className="font-bold text-foreground">65<span className="text-[10px] text-muted-foreground ml-0.5">kg</span></p>
        </div>
      </div>

      <div className="mt-auto hidden md:block">
        <Button asChild variant="outline" className="w-full rounded-xl bg-background hover:bg-muted border-border/30 shadow-sm font-semibold h-12">
          <Link to="/patient/profile">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfileSnapshotWidget;
