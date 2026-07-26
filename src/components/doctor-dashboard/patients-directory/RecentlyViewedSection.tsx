import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, ChevronRight, Activity, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface RecentPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  lastViewed: string;
  riskLevel: "HIGH RISK" | "STABLE" | "MONITOR";
}

const RECENT_PATIENTS: RecentPatient[] = [
  { id: "pat-101", name: "Marcus Vance", age: 54, gender: "Male", diagnosis: "Subacute Coronary Syndrome • CAD", lastViewed: "12 mins ago", riskLevel: "HIGH RISK" },
  { id: "pat-102", name: "Elena Rostova", age: 48, gender: "Female", diagnosis: "Hypertensive Crisis • Refractory BP", lastViewed: "45 mins ago", riskLevel: "HIGH RISK" },
  { id: "pat-103", name: "David Kim", age: 62, gender: "Male", diagnosis: "Paroxysmal Atrial Fibrillation", lastViewed: "2 hours ago", riskLevel: "MONITOR" },
  { id: "pat-104", name: "Sophia Patel", age: 39, gender: "Female", diagnosis: "Post-STEMI PCI Stent Rehab", lastViewed: "Yesterday", riskLevel: "STABLE" },
];

export const RecentlyViewedSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section aria-label="Recently Viewed Patients Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-4">
        <SectionHeader
          title="Recently Viewed Patient Charts"
          subtitle="Quickly resume recent clinical workspace sessions."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>4 Active Charts</span>
            </span>
          }
        />

        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {RECENT_PATIENTS.map((patient) => (
            <div
              key={patient.id}
              onClick={() => navigate(`/doctor/patients/${patient.id}`)}
              className="p-4 rounded-2xl bg-card/60 hover:bg-card border border-border/60 hover:border-primary/40 backdrop-blur-xl transition-all duration-200 min-w-[260px] max-w-[280px] space-y-3 cursor-pointer shrink-0 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-2xl border border-primary/30 shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`} alt={patient.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">MV</AvatarFallback>
                  </Avatar>

                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-sm font-bold font-heading text-foreground truncate group-hover:text-primary transition-colors">
                      {patient.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-muted-foreground">{patient.age}yo {patient.gender}</p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>

              <div className="p-2.5 rounded-xl bg-background/50 border border-border/30 text-xs font-semibold text-primary truncate">
                {patient.diagnosis}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium border-t border-border/30 pt-2">
                <span>Viewed {patient.lastViewed}</span>
                <span className="font-bold text-primary group-hover:underline flex items-center gap-0.5">
                  Workspace <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default RecentlyViewedSection;
