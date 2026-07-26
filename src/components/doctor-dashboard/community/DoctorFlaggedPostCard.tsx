import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import PriorityBadge, { PriorityLevel } from "../PriorityBadge";
import { AlertTriangle, CheckCircle2, Trash2, ShieldAlert, UserX, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface FlaggedReport {
  id: string;
  postId: string;
  postTitle: string;
  postSnippet: string;
  authorName: string;
  reason: "Medical Misinformation" | "Unverified Rx Advice" | "Spam" | "Sensitive Content";
  riskLevel: PriorityLevel;
  reportedBy: string;
  reportedTimeAgo: string;
}

export interface DoctorFlaggedPostCardProps {
  report: FlaggedReport;
  onApprove?: (reportId: string) => void;
  onRemove?: (reportId: string) => void;
  onEscalate?: (reportId: string) => void;
}

const riskStyles = {
  stat: "bg-rose-500/10 border-rose-500/30 text-rose-500",
  high: "bg-rose-500/10 border-rose-500/30 text-rose-500",
  routine: "bg-amber-500/10 border-amber-500/30 text-amber-500",
};

export const DoctorFlaggedPostCard: React.FC<DoctorFlaggedPostCardProps> = ({
  report,
  onApprove,
  onRemove,
  onEscalate,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-card/70 border border-border/60 hover:border-rose-500/40 backdrop-blur-xl transition-all duration-200 space-y-4">
      {/* Report Risk Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{report.reason}</span>
          </span>
          <PriorityBadge priority={report.riskLevel} size="sm" />
        </div>

        <span className="text-[11px] font-medium text-muted-foreground">
          Reported by <strong className="text-foreground">u/{report.reportedBy}</strong> • {report.reportedTimeAgo}
        </span>
      </div>

      {/* Post Snippet */}
      <div className="space-y-1.5 bg-background/50 p-3.5 rounded-2xl border border-border/40">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Post Title: <span className="text-foreground font-heading text-sm">{report.postTitle}</span>
        </div>
        <p className="text-xs text-foreground/90 font-medium leading-relaxed italic bg-background/40 p-2.5 rounded-xl border border-border/30">
          "{report.postSnippet}"
        </p>
        <div className="text-[11px] text-muted-foreground font-semibold">
          Original Author: <strong className="text-foreground">u/{report.authorName}</strong>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-2.5 flex-wrap">
        <Button
          onClick={() => onApprove?.(report.id)}
          variant="outline"
          className="rounded-xl border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 text-xs font-semibold h-9 px-3.5 gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Approve Post (Safe)</span>
        </Button>

        <Button
          onClick={() => onRemove?.(report.id)}
          variant="outline"
          className="rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold h-9 px-3.5 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Remove Post</span>
        </Button>

        <Button
          onClick={() => onEscalate?.(report.id)}
          className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-9 px-3.5 gap-1.5 shadow-md"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Escalate to Medical Board</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorFlaggedPostCard;
