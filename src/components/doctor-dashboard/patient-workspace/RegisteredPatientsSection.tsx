import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRegisteredPatientCards } from "@/services/firebaseService";
import { Users, Stethoscope } from "lucide-react";

/**
 * Lists every onboarded patient in the Firestore `patients` collection so
 * the doctor can see who has registered, jump into their workspace, or
 * start a consultation directly from the patient's stored profile.
 */
export const RegisteredPatientsSection: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getRegisteredPatientCards();
        if (!cancelled) setCards(list);
      } catch (err) {
        console.warn("[Medscope] Registered patients fetch failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openWorkspace = (patientId: string) => navigate(`/doctor/patients/${patientId}`);

  return (
    <DoctorGlassCard variant="default" padding="lg" className="space-y-5">
      <SectionHeader
        title="Registered Patients"
        subtitle="Every onboarded patient in the Firestore backend. Open a workspace to view their stored onboarding details."
        badge={
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" /> {loading ? "..." : cards.length} onboarded
          </span>
        }
      />

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading registered patients from Firestore...</p>
      ) : cards.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No onboarded patients found yet. Patient onboarding saves to Firestore and shows up here.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className="rounded-2xl border border-border/50 bg-background/40 p-4 space-y-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 rounded-xl border border-primary/25">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`} alt={patient.name} />
                  <AvatarFallback className="bg-primary/15 text-primary font-bold text-xs">
                    {String(patient.name || "P").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-foreground truncate">{patient.name}</p>
                  <p className="text-[11px] text-muted-foreground font-semibold truncate">
                    {patient.age ? `${patient.age} yrs • ` : ""}{patient.gender} • {patient.bloodGroup}
                  </p>
                </div>
              </div>

              <div className="text-[11px] space-y-1.5">
                <p className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate text-foreground">{patient.primaryDiagnosis}</span>
                </p>
                <p className="text-muted-foreground font-semibold truncate">
                  Phone: <span className="text-foreground">{patient.phone}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => openWorkspace(patient.id)}
                  className="rounded-xl h-8 text-[11px] font-bold"
                >
                  Open Workspace
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    openWorkspace(patient.id);
                  }}
                  className="rounded-xl h-8 text-[11px] font-bold"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DoctorGlassCard>
  );
};

export default RegisteredPatientsSection;
