import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface DoctorArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  status: "published" | "draft";
  viewsCount: number;
  publishedDate: string;
  summary: string;
}

const INITIAL_ARTICLES: DoctorArticle[] = [
  {
    id: "art-1",
    title: "Understanding Dual Antiplatelet Therapy (DAPT) Post-Stent",
    category: "Cardiology & Vascular",
    author: "Dr. Sarah Jenkins, MD",
    readTime: "5 min read",
    status: "published",
    viewsCount: 3420,
    publishedDate: "July 20, 2026",
    summary: "Clinical explanation of why Aspirin & Clopidogrel co-prescription is vital to prevent acute stent thrombosis during the first 12 months.",
  },
  {
    id: "art-2",
    title: "Managing Type 2 Diabetes: Blood Glucose vs HbA1c Telemetry",
    category: "Endocrinology",
    author: "Dr. Sarah Jenkins, MD",
    readTime: "7 min read",
    status: "published",
    viewsCount: 2890,
    publishedDate: "July 15, 2026",
    summary: "Guidance on how continuous glucose monitor (CGM) readings translate into 90-day HbA1c biomarkers and diet adjustments.",
  },
  {
    id: "art-3",
    title: "Recognizing Early Warning Signs of Heart Failure Decompensation",
    category: "Cardiology & Rehab",
    author: "Dr. Sarah Jenkins, MD",
    readTime: "4 min read",
    status: "draft",
    viewsCount: 0,
    publishedDate: "Draft",
    summary: "Draft guidance covering daily weight tracking, ankle swelling, and nocturnal dyspnea threshold triggers.",
  },
];

export const DoctorEducationManagement: React.FC = () => {
  const [articles, setArticles] = useState<DoctorArticle[]>(INITIAL_ARTICLES);

  const handleTogglePublish = (id: string, title: string, currentStatus: "published" | "draft") => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    toast.success(
      nextStatus === "published" ? `Article published to community: ${title}` : `Article moved to drafts: ${title}`
    );
  };

  const handleDelete = (id: string, title: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.info(`Article deleted: ${title}`);
  };

  const handleCreateNew = () => {
    toast.info("Opening Medical Article Editor...");
  };

  return (
    <section aria-label="Doctor Education Management Section">
      <DoctorGlassCard variant="default" padding="lg" className="space-y-6">
        <SectionHeader
          title="Educational Health Articles (Doctor Authoring Hub)"
          subtitle="Publish verified clinical educational content & medical guides for community patient education."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {articles.length} Author Articles
            </span>
          }
          action={
            <Button
              onClick={handleCreateNew}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-3.5 gap-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Author New Article</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/60 hover:border-primary/30 backdrop-blur-xl transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {art.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      art.status === "published"
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {art.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-foreground">{art.title}</h4>

                <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-background/40 p-2.5 rounded-xl border border-border/30">
                  {art.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-primary" /> {art.viewsCount} reads
                  </span>
                  <span>{art.readTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  onClick={() => handleTogglePublish(art.id, art.title, art.status)}
                  variant="outline"
                  className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-8 px-2.5 gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>{art.status === "published" ? "Unpublish" : "Publish"}</span>
                </Button>

                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default DoctorEducationManagement;
