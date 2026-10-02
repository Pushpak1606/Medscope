import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetectedInteraction } from "@/lib/drugInteractions";
import {
  AlertTriangle,
  ShieldAlert,
  FileCheck2,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export interface DrugInteractionAuditModalProps {
  isOpen: boolean;
  candidateDrug: string;
  conflicts: DetectedInteraction[];
  onConfirmOverride: (rationale: string) => void;
  onCancel: () => void;
}

const COMMON_CLINICAL_RATIONALES = [
  "Benefits outweigh risk; low-dose prophylactic co-therapy with gastroprotection.",
  "Alternative class clinically contraindicated; will order weekly telemetry & lab monitoring.",
  "Patient has tolerated this combination previously with no adverse clinical effects.",
  "Short-term acute course (≤ 5 days) with strict monitoring.",
];

export const DrugInteractionAuditModal: React.FC<DrugInteractionAuditModalProps> = ({
  isOpen,
  candidateDrug,
  conflicts,
  onConfirmOverride,
  onCancel,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customRationale, setCustomRationale] = useState<string>("");

  const effectiveRationale = customRationale.trim() || selectedPreset;

  const handleAuthorize = () => {
    if (!effectiveRationale) return;
    onConfirmOverride(effectiveRationale);
    setSelectedPreset("");
    setCustomRationale("");
  };

  const hasSevere = conflicts.some((c) => c.severity === "Severe");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl bg-card border-border/80 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`p-2.5 rounded-2xl ${hasSevere ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
              {hasSevere ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Clinical Pharmacological Interaction Alert
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Prescription check for <strong className="text-foreground">{candidateDrug}</strong> flagged active regimen conflicts.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* CONFLICTS LIST */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {conflicts.map((c, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border space-y-2 ${
                c.severity === "Severe"
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>{c.drugA}</span>
                  <span className="text-muted-foreground">⇄</span>
                  <span>{c.drugB}</span>
                </span>
                <Badge
                  variant="outline"
                  className={
                    c.severity === "Severe"
                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }
                >
                  {c.severity} Interaction
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Mechanism:</strong> {c.clinicalMechanism}
              </p>

              <p className="text-xs text-foreground/90 font-medium">
                <strong>Guideline:</strong> {c.recommendedAction}
              </p>
            </div>
          ))}
        </div>

        {/* CLINICAL RATIONALE OVERRIDE (TC-D04 AUDIT REQUIREMENT) */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-primary" />
              Doctor Clinical Override & Acknowledgement (Auditable)
            </label>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> Recorded in EHR
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Select clinical rationale or enter notes:</span>
            <div className="space-y-1.5">
              {COMMON_CLINICAL_RATIONALES.map((rationale, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(rationale);
                    setCustomRationale("");
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                    selectedPreset === rationale
                      ? "bg-primary/15 border-primary/50 text-foreground font-medium"
                      : "bg-card/60 hover:bg-muted text-muted-foreground border-border/40"
                  }`}
                >
                  {rationale}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            value={customRationale}
            onChange={(e) => {
              setCustomRationale(e.target.value);
              setSelectedPreset("");
            }}
            placeholder="Or type custom clinical justification here..."
            className="text-xs min-h-[60px] bg-background/50 rounded-xl resize-none"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} className="rounded-xl flex-1">
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Prescription
          </Button>

          <Button
            onClick={handleAuthorize}
            disabled={!effectiveRationale}
            className="rounded-xl flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Acknowledge & Authorize Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DrugInteractionAuditModal;
