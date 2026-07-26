import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import DoctorFlaggedPostCard, { FlaggedReport } from "./DoctorFlaggedPostCard";
import { AlertTriangle, ShieldCheck, Filter } from "lucide-react";
import { toast } from "sonner";

const INITIAL_REPORTS: FlaggedReport[] = [
  {
    id: "rep-1",
    postId: "post-101",
    postTitle: "Stop taking Metformin and try raw garlic extract instead!",
    postSnippet: "I read online that Metformin damages kidneys. Just replace it with 4 cloves of raw garlic every morning and your HbA1c will drop to 4.5% instantly.",
    authorName: "HealthGuru99",
    reason: "Medical Misinformation",
    riskLevel: "stat",
    reportedBy: "Sarah_M",
    reportedTimeAgo: "15 mins ago",
  },
  {
    id: "rep-2",
    postId: "post-102",
    postTitle: "Selling unverified imported prescription sleeping pills cheap DM me",
    postSnippet: "Got extra high dose insomnia pills from overseas pharmacy. Message me directly for price list and shipping options.",
    authorName: "PharmaDeals24",
    reason: "Unverified Rx Advice",
    riskLevel: "high",
    reportedBy: "David_C",
    reportedTimeAgo: "45 mins ago",
  },
  {
    id: "rep-3",
    postId: "post-103",
    postTitle: "Click here to buy guaranteed miracle hypertension cure supplement",
    postSnippet: "Guaranteed 100% cure for high blood pressure in 3 days! Buy now with 50% discount code CLINIC50.",
    authorName: "CureAllSupplements",
    reason: "Spam",
    riskLevel: "routine",
    reportedBy: "Marcus_V",
    reportedTimeAgo: "2 hours ago",
  },
];

export const DoctorModerationQueue: React.FC = () => {
  const [reports, setReports] = useState<FlaggedReport[]>(INITIAL_REPORTS);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleApprove = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Post marked as safe and approved.");
  };

  const handleRemove = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.info("Content removed from community feed.");
  };

  const handleEscalate = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.warning("Report escalated to Medscope Medical Ethics Board.");
  };

  const filteredReports = activeFilter === "All"
    ? reports
    : reports.filter((r) => r.reason === activeFilter);

  return (
    <section aria-label="Doctor Moderation Queue Section">
      <DoctorGlassCard variant="glow" glowColor="rose" padding="lg" className="border-rose-500/30 space-y-6">
        <SectionHeader
          title="Doctor Moderation Queue (Community Safety)"
          subtitle="Triage reported posts, review medical misinformation, spam & unverified prescription claims."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {reports.length} Pending Flags
            </span>
          }
        />

        {/* Filter Tab Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "Medical Misinformation", "Unverified Rx Advice", "Spam", "Sensitive Content"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                activeFilter === category
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-card/60 hover:bg-card border border-border/50 text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* List of Flagged Post Cards */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <DoctorFlaggedPostCard
                key={report.id}
                report={report}
                onApprove={handleApprove}
                onRemove={handleRemove}
                onEscalate={handleEscalate}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-card/40 border border-border/40 text-center space-y-2">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-foreground">Moderation Queue Clear!</h4>
            <p className="text-xs text-muted-foreground">No pending reported posts in this category.</p>
          </div>
        )}
      </DoctorGlassCard>
    </section>
  );
};

export default DoctorModerationQueue;
