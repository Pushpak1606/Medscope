import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { FileText, Download, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface LabItem {
  id: string;
  type: string;
  facility: string;
  date: string;
  status: "abnormal" | "normal";
  summary: string;
  fileName: string;
}

const MOCK_LABS: LabItem[] = [
  {
    id: "l-1",
    type: "Troponin T Cardiac Marker",
    facility: "Stat ER Lab",
    date: "July 26, 2026 • 08:20 AM",
    status: "abnormal",
    summary: "Troponin T: 0.14 ng/mL (Reference: <0.01 ng/mL).",
    fileName: "Troponin_T_Report_MarcusVance.pdf",
  },
  {
    id: "l-2",
    type: "12-Lead ECG Tracing",
    facility: "Cardiology Exam Bay",
    date: "July 26, 2026 • 08:15 AM",
    status: "abnormal",
    summary: "ST elevation 1.5mm in leads V2-V4. Sinus tachycardia 94 bpm.",
    fileName: "12Lead_ECG_Trace_July26.pdf",
  },
  {
    id: "l-3",
    type: "Comprehensive Metabolic Panel",
    facility: "Quest Diagnostics",
    date: "July 20, 2026",
    status: "normal",
    summary: "Glucose: 104 mg/dL, BUN: 14, Cr: 0.9, Na: 140, K: 4.2.",
    fileName: "CMP_Report_July20.pdf",
  },
];

export const LabReportsWidget: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<LabItem | null>(null);

  const handleUpload = () => {
    toast.info("Upload lab PDF report to patient chart...");
  };

  return (
    <section aria-label="Lab Reports Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Lab Reports & Telemetry Traces"
          subtitle="Diagnostic report cards with instant PDF viewer & upload dropzone."
          action={
            <Button
              onClick={handleUpload}
              variant="outline"
              className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 gap-1.5"
            >
              <Upload className="h-4 w-4 text-primary" />
              <span>Upload PDF</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_LABS.map((lab) => (
            <div
              key={lab.id}
              className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-3 ${
                lab.status === "abnormal"
                  ? "bg-rose-500/5 border-rose-500/30"
                  : "bg-card/60 border-border/60"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold font-heading text-foreground truncate">{lab.type}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lab.status === "abnormal"
                        ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                    }`}
                  >
                    {lab.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground">{lab.facility} • {lab.date}</p>
                <p className="text-xs text-foreground/90 font-medium bg-background/50 p-2 rounded-xl border border-border/30">
                  {lab.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  onClick={() => setSelectedLab(lab)}
                  variant="outline"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 px-2.5 gap-1 w-full"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>Preview PDF</span>
                </Button>

                <Button
                  onClick={() => toast.success(`Downloading ${lab.fileName}...`)}
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground h-8 w-8 shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Modal Dialog */}
        <Dialog open={!!selectedLab} onOpenChange={() => setSelectedLab(null)}>
          <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border border-border/70 rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{selectedLab?.type}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedLab?.facility} • {selectedLab?.date}
              </DialogDescription>
            </DialogHeader>

            <div className="p-8 rounded-2xl bg-black/40 border border-border/60 text-center space-y-3 my-2">
              <FileText className="w-12 h-12 text-primary mx-auto" />
              <h4 className="text-sm font-bold text-foreground">{selectedLab?.fileName}</h4>
              <p className="text-xs text-muted-foreground">{selectedLab?.summary}</p>
              <Button
                onClick={() => toast.success(`Downloading ${selectedLab?.fileName}...`)}
                className="rounded-xl bg-primary text-white text-xs h-9 px-4 gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Report PDF</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DoctorGlassCard>
    </section>
  );
};

export default LabReportsWidget;
