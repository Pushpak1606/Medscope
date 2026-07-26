import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import MedscopeLogo from "@/components/ui/MedscopeLogo";
import { Button } from "@/components/ui/button";
import { Printer, ShieldCheck, CheckCircle2, FileCheck, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export interface FinalRxProps {
  doctorName?: string;
  licenseNumber?: string;
  hospital?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  date?: string;
}

import { useDoctor } from "@/context/DoctorContext";

export const FinalPrescriptionPreview: React.FC<FinalRxProps> = ({
  doctorName: overrideDoctorName,
  licenseNumber: overrideLicense,
  hospital: overrideHospital,
  patientName = "Marcus Vance",
  patientAge = 54,
  patientGender = "Male",
  date = "July 26, 2026",
}) => {
  const { doctorProfile } = useDoctor();
  const doctorName = overrideDoctorName || doctorProfile.fullName;
  const licenseNumber = overrideLicense || `${doctorProfile.registrationNumber} • License #${doctorProfile.licenseNumber}`;
  const hospital = overrideHospital || `${doctorProfile.hospital} • ${doctorProfile.department}`;
  const handleGenerateAndSync = () => {
    toast.success(`Digital Prescription generated & synchronized with ${patientName}'s Medscope Rx Assistant!`);
  };

  const handlePrint = () => {
    toast.info("Preparing high-resolution printable prescription PDF...");
  };

  return (
    <section aria-label="Final Prescription Preview Section">
      <DoctorGlassCard variant="glow" glowColor="emerald" padding="lg" className="border-emerald-500/30 space-y-6">
        <SectionHeader
          title="Final Authorized Prescription (Printable Preview)"
          subtitle="Formal digital prescription document preview ready for signing and patient synchronization."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Ready for Signature</span>
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-3 gap-1.5"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>Print PDF</span>
              </Button>

              <Button
                onClick={handleGenerateAndSync}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate & Sync Rx</span>
              </Button>
            </div>
          }
        />

        {/* Prescription Formal Card Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card/80 border border-border/80 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* Header Branding & Doctor License */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 shadow-md text-white">
                <MedscopeLogo className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-heading text-foreground tracking-tight">
                  Medscope Official Prescription
                </h3>
                <p className="text-xs font-semibold text-primary">{hospital}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-sm font-bold text-foreground">{doctorName}</div>
              <div className="text-xs text-muted-foreground font-medium">{licenseNumber}</div>
              <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Practitioner
              </div>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-background/50 border border-border/40 text-xs">
            <div>
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Patient Name</span>
              <div className="font-bold text-foreground">{patientName}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Age / Gender</span>
              <div className="font-bold text-foreground">{patientAge} yrs • {patientGender}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Prescription Date</span>
              <div className="font-bold text-foreground">{date}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase text-[10px] font-bold">Rx Reference ID</span>
              <div className="font-mono font-bold text-primary">RX-2026-98421</div>
            </div>
          </div>

          {/* Prescribed Medicines List Table View */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Prescribed Medications (Rx List):
            </h4>

            <div className="space-y-2.5">
              {[
                { name: "Clopidogrel Bisulfate 75mg", dose: "75 mg", freq: "Once Daily", dur: "12 Months", instructions: "Take 1 tablet daily after morning meal." },
                { name: "Atorvastatin Calcium 80mg", dose: "80 mg", freq: "Once Daily", dur: "Ongoing", instructions: "Take 1 tablet at bedtime for plaque stabilization." },
                { name: "Aspirin EC 81mg", dose: "81 mg", freq: "Once Daily", dur: "Ongoing", instructions: "Take 1 tablet daily with food." },
                { name: "Nitroglycerin SL 0.4mg", dose: "0.4 mg", freq: "PRN as needed", dur: "PRN Emergency", instructions: "Place under tongue every 5 mins for acute chest pain." },
              ].map((rx, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-background/60 border border-border/40 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span className="text-sm text-primary">{idx + 1}. {rx.name}</span>
                    <span className="font-mono text-muted-foreground">{rx.dose} • {rx.freq} ({rx.dur})</span>
                  </div>
                  <p className="text-muted-foreground font-medium">Instructions: {rx.instructions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signature Placeholder */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Doctor Clinical Approval:</span>
              <p className="text-muted-foreground font-medium">
                Digitally signed & encrypted with Medscope Medical Key #98421.
              </p>
            </div>

            {/* Signature Box */}
            <div className="p-4 rounded-2xl bg-card border-2 border-emerald-500/40 text-center space-y-1 min-w-[200px] shrink-0">
              <div className="font-heading font-extrabold text-sm text-emerald-500 tracking-wider italic">
                Dr. Sarah Jenkins, MD
              </div>
              <div className="text-[10px] font-mono font-bold text-muted-foreground">
                Digital Signature Verified • {date}
              </div>
            </div>
          </div>

        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default FinalPrescriptionPreview;
