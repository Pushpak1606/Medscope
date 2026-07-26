import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import StatusBadge from "../StatusBadge";
import { FileText, Download, Eye, Upload, AlertCircle, CheckCircle2, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface LabReportItem {
  id: string;
  title: string;
  category: string;
  date: string;
  facility: string;
  status: "abnormal" | "normal" | "pending";
  resultSummary: string;
  pdfFileName: string;
}

const MOCK_LABS: LabReportItem[] = [
  {
    id: "lab-101",
    title: "High-Sensitivity Troponin T Biomarker",
    category: "Cardiac Biomarkers",
    date: "July 26, 2026 • 08:20 AM",
    facility: "St. Jude Stat ER Laboratory",
    status: "abnormal",
    resultSummary: "Troponin T: 0.14 ng/mL (Reference Range: <0.01 ng/mL). Elevated cardiac marker.",
    pdfFileName: "Troponin_T_Report_MarcusVance.pdf",
  },
  {
    id: "lab-102",
    title: "12-Lead Electrocardiogram (ECG/EKG)",
    category: "Electrophysiology",
    date: "July 26, 2026 • 08:15 AM",
    facility: "Emergency Exam Bay 2",
    status: "abnormal",
    resultSummary: "1.5mm ST-segment elevation in leads V2-V4. Sinus tachycardia at 94 bpm.",
    pdfFileName: "ECG_12Lead_Trace_MarcusVance.pdf",
  },
  {
    id: "lab-103",
    title: "Comprehensive Metabolic Panel (CMP)",
    category: "Blood Chemistry",
    date: "July 20, 2026",
    facility: "Quest Diagnostics Central",
    status: "normal",
    resultSummary: "Glucose: 104 mg/dL, BUN: 14 mg/dL, Creatinine: 0.9 mg/dL, Na: 140 mEq/L, K: 4.2 mEq/L.",
    pdfFileName: "CMP_Metabolic_Report_July20.pdf",
  },
  {
    id: "lab-104",
    title: "Fast Lipid & Cholesterol Panel",
    category: "Lipidology",
    date: "July 15, 2026",
    facility: "Quest Diagnostics Central",
    status: "abnormal",
    resultSummary: "Total Cholesterol: 198 mg/dL, LDL: 112 mg/dL, HDL: 42 mg/dL, Triglycerides: 168 mg/dL.",
    pdfFileName: "Lipid_Panel_July15.pdf",
  },
];

export const LabReportsSection: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<LabReportItem | null>(null);

  const handleUpload = () => {
    toast.info("Select PDF lab report to upload into patient record...");
  };

  return (
    <section aria-label="Lab Reports Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Lab Reports & Diagnostic Traces"
          subtitle="Diagnostic lab panels, cardiac telemetry traces & PDF report viewer."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              4 Diagnostic Reports
            </span>
          }
          action={
            <Button
              onClick={handleUpload}
              variant="outline"
              className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold gap-1.5 h-9"
            >
              <Upload className="h-4 w-4 text-primary" />
              <span>Upload PDF Report</span>
            </Button>
          }
        />

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_LABS.map((report) => (
            <div
              key={report.id}
              className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-200 flex flex-col justify-between space-y-3 ${
                report.status === "abnormal"
                  ? "bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50"
                  : "bg-card/60 hover:bg-card/80 border-border/60 hover:border-primary/30"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {report.category}
                    </span>
                    <h4 className="text-base font-bold font-heading text-foreground">
                      {report.title}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 border ${
                      report.status === "abnormal"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground font-medium">
                  {report.facility} • {report.date}
                </div>

                <p className="text-xs text-foreground/90 font-medium bg-background/50 p-2.5 rounded-xl border border-border/30">
                  {report.resultSummary}
                </p>
              </div>

              {/* PDF Preview Trigger Bar */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground truncate">
                  📄 {report.pdfFileName}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => setSelectedReport(report)}
                    variant="outline"
                    className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 px-2.5 gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>Preview PDF</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Preview Dialog Modal */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-2xl border border-border/70 rounded-3xl p-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{selectedReport?.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedReport?.facility} • {selectedReport?.date}
              </DialogDescription>
            </DialogHeader>

            {/* PDF Viewer Placeholder Box */}
            <div className="p-8 rounded-2xl bg-black/40 border border-border/60 text-center space-y-4 my-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">{selectedReport?.pdfFileName}</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {selectedReport?.resultSummary}
                </p>
              </div>
              <Button
                onClick={() => toast.success(`Downloading ${selectedReport?.pdfFileName}...`)}
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs h-9 px-4 gap-2"
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

export default LabReportsSection;
