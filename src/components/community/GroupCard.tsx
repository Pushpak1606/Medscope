import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Heart, UsersRound, HandHeart, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  icon: string;
  tags: string[];
}

interface GroupCardProps {
  group: CommunityGroup;
  isJoined: boolean;
  onJoinToggle: (id: string) => void;
}

const IconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="h-6 w-6 text-rose-500" />,
  UsersRound: <UsersRound className="h-6 w-6 text-blue-500" />,
  HandHeart: <HandHeart className="h-6 w-6 text-emerald-500" />,
  BrainCircuit: <BrainCircuit className="h-6 w-6 text-purple-500" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-amber-500" />
};

const GroupCard = ({ group, isJoined, onJoinToggle }: GroupCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between rounded-3xl border border-border/40 bg-card/40 backdrop-blur-md p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-primary/20"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface shadow-sm border border-border/50">
            {IconMap[group.icon] || <Users className="h-6 w-6 text-primary" />}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            {group.category}
          </Badge>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-1">{group.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {group.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{group.members.toLocaleString()} members</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-border"></span>
          <span>Active today</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {isJoined ? (
          <Button 
            variant="ghost" 
            className="flex-1 rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-border/50 transition-colors"
            onClick={(e) => { e.preventDefault(); onJoinToggle(group.id); }}
          >
            Leave
          </Button>
        ) : (
          <Button 
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
            onClick={(e) => { e.preventDefault(); onJoinToggle(group.id); }}
          >
            Join Group
          </Button>
        )}
        <Button variant="outline" className="flex-1 rounded-xl border-border/50 bg-card/60 backdrop-blur-sm" asChild>
          <Link to={`/patient/community/${group.id}`}>View</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default GroupCard;
