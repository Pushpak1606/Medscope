import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Clock, Sliders, Eye, Pill, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ConsultationPreferencesCard: React.FC = () => {
  const [defaultDuration, setDefaultDuration] = useState("30");
  const [followupDuration, setFollowupDuration] = useState("20");
  const [shareSOAPNotes, setShareSOAPNotes] = useState(true);
  const [autoDAPTProtocol, setAutoDAPTProtocol] = useState(true);

  const handleSave = () => {
    toast.success("Consultation preferences saved!");
  };

  return (
    <section aria-label="Consultation Preferences Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Consultation & Prescription Defaults"
          subtitle="Configure default session durations, SOAP note sharing & automated AI safety protocols."
          action={
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-9 px-4 gap-1.5 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Default Consultation Duration</label>
            <Select value={defaultDuration} onValueChange={setDefaultDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Minutes (Brief Check)</SelectItem>
                <SelectItem value="20">20 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes (Standard)</SelectItem>
                <SelectItem value="45">45 Minutes (Extended Examination)</SelectItem>
                <SelectItem value="60">60 Minutes (Comprehensive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Default Follow-up Duration</label>
            <Select value={followupDuration} onValueChange={setFollowupDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select follow-up duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="20">20 Minutes (Standard Follow-up)</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground text-xs">Share SOAP Notes with Patient</div>
              <div className="text-[10px] text-muted-foreground">Make finalized SOAP plan visible on patient chart</div>
            </div>
            <Switch checked={shareSOAPNotes} onCheckedChange={setShareSOAPNotes} />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-xl">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground text-xs">Auto AI DAPT & Interaction Protocol</div>
              <div className="text-[10px] text-muted-foreground">Enable automatic drug-drug interaction warning checks</div>
            </div>
            <Switch checked={autoDAPTProtocol} onCheckedChange={setAutoDAPTProtocol} />
          </div>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default ConsultationPreferencesCard;
