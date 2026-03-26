import { Activity, ShieldAlert, HeartPulse, UserCircle } from "lucide-react";
import { usePatient } from "@/context/PatientContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionInfoWidget = () => {
  const { profile } = usePatient();
  
  const conditions = profile.conditions && profile.conditions.length > 0 ? profile.conditions : [];
  const allergies = profile.allergies ? profile.allergies.split(",").map(s => s.trim()).filter(Boolean) : [];
  const meds = profile.medications ? profile.medications.split(",").map(s => s.trim()).filter(Boolean) : [];
  const hasEmergency = profile.emergencyName && profile.emergencyPhone;

  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 w-full h-full relative overflow-hidden text-left group">
      <Accordion type="single" collapsible className="w-full space-y-3">
        <AccordionItem value="item-1" className="bg-background/40 border border-border/40 rounded-2xl px-4 data-[state=open]:bg-background transition-colors shadow-sm">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Active Conditions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 space-y-2 flex flex-wrap gap-2">
            {conditions.length > 0 ? conditions.map((c, i) => (
              <div key={i} className="bg-background/50 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-border/60">{c}</div>
            )) : <span className="text-sm font-medium italic opacity-70">None recorded.</span>}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="bg-background/40 border border-border/40 rounded-2xl px-4 data-[state=open]:bg-background transition-colors shadow-sm">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Allergies & Warnings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 flex flex-wrap gap-2">
            {allergies.length > 0 ? allergies.map((al, i) => (
              <div key={i} className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl text-xs sm:text-sm border border-red-500/20 font-bold">
                {al}
              </div>
            )) : <span className="text-sm font-medium italic opacity-70">No severe allergies logged.</span>}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="bg-background/40 border border-border/40 rounded-2xl px-4 data-[state=open]:bg-background transition-colors shadow-sm">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Current Medications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 space-y-2 flex flex-col items-start">
             {meds.length > 0 ? meds.map((m, i) => (
              <div key={i} className="bg-background/50 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-border/60">{m}</div>
            )) : <span className="text-sm font-medium italic opacity-70">No current medications.</span>}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="bg-background/40 border border-border/40 rounded-2xl px-4 data-[state=open]:bg-background transition-colors shadow-sm">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <UserCircle className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Emergency Contact</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2">
            {hasEmergency ? (
              <div className="bg-background/50 px-4 py-3 rounded-xl border border-border/60 flex flex-col gap-0.5">
                <span className="font-bold text-foreground text-sm sm:text-base">{profile.emergencyName}</span>
                <span className="text-xs sm:text-sm font-semibold text-primary">{profile.emergencyPhone}</span>
              </div>
            ) : (
               <span className="text-sm font-medium italic opacity-70">Verify contact in Edit Profile.</span>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionInfoWidget;
