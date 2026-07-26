import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, UserCheck, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface PendingFollowupData {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  avatarUrl?: string;
  lastVisitDate: string;
  dueDate: string;
  reason: string;
  priority: PriorityLevel;
}

const MOCK_PENDING_FOLLOWUPS: PendingFollowupData[] = [
  {
    id: "fol-1",
    patientId: "pat-101",
    patientName: "Marcus Vance",
    age: 54,
    gender: "Male",
    lastVisitDate: "June 10, 2026",
    dueDate: "July 26, 2026 (Today)",
    reason: "Serial Troponin T kinetics & urgent post-ACS evaluation.",
    priority: "stat",
  },
  {
    id: "fol-2",
    patientId: "pat-102",
    patientName: "Eleanor Vance",
    age: 62,
    gender: "Female",
    lastVisitDate: "April 20, 2026",
    dueDate: "July 28, 2026",
    reason: "3-Month Post-PCI stent patency check & INR titration.",
    priority: "high",
  },
  {
    id: "fol-3",
    patientId: "pat-104",
    patientName: "Sarah Miller",
    age: 49,
    gender: "Female",
    lastVisitDate: "July 12, 2026",
    dueDate: "July 30, 2026",
    reason: "Review 24-hour ambulatory Holter monitor traces.",
    priority: "high",
  },
];

export const PendingFollowupsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenFollowup = (patientId: string, name: string) => {
    toast.info(`Opening follow-up workspace for ${name}...`);
    navigate(`/doctor/patients/${patientId}`);
  };

  return (
    <section aria-label="Pending Follow-ups Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Pending Clinical Follow-ups"
          subtitle="Patients due for post-consultation reviews, telemetry checks & Rx titrations."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              3 Due Follow-ups
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_PENDING_FOLLOWUPS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-xl border border-primary/30 shrink-0">
                      <AvatarImage
                        src={item.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${item.patientName}`}
                        alt={item.patientName}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                        {item.patientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="text-sm font-bold font-heading text-foreground truncate">
                        {item.patientName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {item.age} yrs • {item.gender}
                      </p>
                    </div>
                  </div>

                  <PriorityBadge priority={item.priority} size="sm" />
                </div>

                <div className="space-y-1 text-xs bg-background/50 p-2.5 rounded-xl border border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <strong className="text-foreground">{item.lastVisitDate}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <strong className="text-primary">{item.dueDate}</strong>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 font-medium bg-background/30 p-2.5 rounded-xl border border-border/20">
                  <strong className="text-muted-foreground">Reason: </strong>
                  {item.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-border/30">
                <Button
                  onClick={() => handleOpenFollowup(item.patientId, item.patientName)}
                  variant="outline"
                  className="w-full rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Open Follow-up Workspace</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default PendingFollowupsSection;
