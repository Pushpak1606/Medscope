import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Calendar, Pill, HeartPulse, UserCheck, Share2, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { useConsultation } from "@/context/ConsultationContext";

export const FollowupPlanningSection: React.FC = () => {
  const { session, scheduleFollowup, completeConsultation } = useConsultation();
  const [nextApptDate, setNextApptDate] = useState("2026-08-10");
  const [rxNotes, setRxNotes] = useState(
    "Review Clopidogrel DAPT response & repeat Troponin T in 48 hours. Monitor INR levels."
  );
  const [lifestyleAdvice, setLifestyleAdvice] = useState(
    "1. Strict low-sodium diet (< 2g Na+/day).\n2. Avoid heavy physical lifting for 14 days.\n3. Daily morning BP & HR telemetry logging."
  );
  const [doctorInstructions, setDoctorInstructions] = useState(
    "If substernal chest pressure recurs despite Nitroglycerin SL, call emergency services immediately."
  );
  const [referralSpecialist, setReferralSpecialist] = useState("Interventional Cardiology • Dr. Robert Chen");

  const handleSaveFollowupPlan = () => {
    scheduleFollowup({
      nextAppointmentDate: nextApptDate,
      reason: rxNotes,
      instructions: doctorInstructions,
    });
  };

  const handleCompleteSession = () => {
    completeConsultation();
  };

  return (
    <section aria-label="Follow-up Planning Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Follow-up Planning & Clinical Discharge"
          subtitle="Structure next appointment timeline, lifestyle advice, patient instructions & specialist referrals."
          action={
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveFollowupPlan}
                variant="outline"
                className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-3.5 gap-1.5"
              >
                <Save className="h-4 w-4 text-primary" />
                <span>Sync Follow-up Plan</span>
              </Button>

              <Button
                onClick={handleCompleteSession}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Complete Consultation Session</span>
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Next Appt Date & Rx Review Notes */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Next Follow-up Appointment Date</span>
              </label>
              <input
                type="date"
                value={nextApptDate}
                onChange={(e) => setNextApptDate(e.target.value)}
                className="w-full rounded-2xl bg-card/60 border border-border/60 p-3 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                <Pill className="h-4 w-4 text-emerald-500" />
                <span>Medication Review Notes</span>
              </label>
              <textarea
                value={rxNotes}
                onChange={(e) => setRxNotes(e.target.value)}
                rows={3}
                className="w-full rounded-2xl bg-card/60 border border-border/60 p-3 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-violet-500" />
                <span>Specialist Referral</span>
              </label>
              <Select value={referralSpecialist} onValueChange={setReferralSpecialist}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select specialist referral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interventional Cardiology • Dr. Robert Chen">Interventional Cardiology • Dr. Robert Chen</SelectItem>
                  <SelectItem value="Electrophysiology • Dr. Maya Lin">Electrophysiology • Dr. Maya Lin</SelectItem>
                  <SelectItem value="Cardiac Rehabilitation Unit">Cardiac Rehabilitation Unit</SelectItem>
                  <SelectItem value="No Referral Required">No Referral Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column: Lifestyle Advice & Doctor Instructions */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                <span>Health Tips & Rehab Plan</span>
              </label>
              <textarea
                value={lifestyleAdvice}
                onChange={(e) => setLifestyleAdvice(e.target.value)}
                rows={4}
                className="w-full rounded-2xl bg-card/60 border border-border/60 p-3 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-amber-500" />
                <span>Doctor Patient Instructions (Discharge Summary)</span>
              </label>
              <textarea
                value={doctorInstructions}
                onChange={(e) => setDoctorInstructions(e.target.value)}
                rows={3}
                className="w-full rounded-2xl bg-card/60 border border-border/60 p-3 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default FollowupPlanningSection;
