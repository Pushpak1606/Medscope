import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/context/PatientContext";

const CommunityWidget = () => {
  const { joinedGroups } = usePatient();
  // Assume mock unread counts
  const newActivityCount = joinedGroups.length > 0 ? 5 : 0; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm"
    >
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Community Support</h3>
            <p className="text-xs text-muted-foreground">{joinedGroups.length} joined groups</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10" asChild>
          <Link to="/patient/community">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="relative z-10 mt-6 flex-1">
        {joinedGroups.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface/80 p-3 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">New Activity</p>
                  <p className="text-xs text-muted-foreground">in your groups</p>
                </div>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {newActivityCount}
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl bg-card/40 border-border/50 h-9 text-xs" asChild>
              <Link to="/patient/community">View Feed</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2 h-full">
            <p className="text-sm font-medium text-foreground">Find Your People</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Join a support group to connect with others sharing similar journeys.</p>
            <Button className="w-full rounded-xl h-9" asChild>
              <Link to="/patient/community">Explore Groups</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityWidget;
