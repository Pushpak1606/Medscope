import { Activity, ShieldAlert, HeartPulse, UserCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionInfoWidget = () => {
  return (
    <div className="flex flex-col rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-6 sm:p-8 w-full h-full relative overflow-hidden text-left group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-border/40">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">Active Conditions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 space-y-2">
            <div className="bg-background/50 px-3 py-2 rounded-xl text-xs font-semibold border border-border/60">Mild Hypertension</div>
            <div className="bg-background/50 px-3 py-2 rounded-xl text-xs font-semibold border border-border/60">Seasonal Allergies</div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-border/40">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">Allergies & Warnings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4">
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl text-xs border border-red-500/20 font-bold">
              Penicillin
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-border/40">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">Current Medications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 space-y-2">
            <div className="bg-background/50 px-3 py-2 rounded-xl text-xs font-semibold border border-border/60">Lisinopril 10mg</div>
            <div className="bg-background/50 px-3 py-2 rounded-xl text-xs font-semibold border border-border/60">Vitamin D3 1000IU</div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-0">
          <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <UserCircle className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">Emergency Contact</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-2">
            <div className="bg-background/50 px-4 py-3 rounded-xl border border-border/60 flex flex-col gap-0.5">
              <span className="font-bold text-foreground text-sm">Michael Doe (Husband)</span>
              <span className="text-xs font-semibold text-primary">+91 98765 00000</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionInfoWidget;
