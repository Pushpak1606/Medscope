import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllOnboardedDoctors } from "@/services/firebaseService";
import { matchSpecialtiesForProblem, findDoctorsForProblem } from "@/lib/doctorMatching";

import {
  Search,
  Stethoscope,
  MapPin,
  Star,
  Video,
  Building2,
  BadgeCheck,
  Sparkles,
  SearchX,
  IndianRupee,
} from "lucide-react";

/**
 * Find Doctors: the patient describes their problem in plain language
 * ("chest pain", "feeling anxious", "sugar is high") and Medscope ranks
 * specialties and doctors from the Firestore directory.
 */

const QUICK_PROBLEMS = [
  "Chest pain",
  "Anxiety or stress",
  "Blood sugar / diabetes",
  "Joint or back pain",
  "Migraine",
  "Skin problem",
  "Stomach pain",
  "Child fever",
];

export default function FindDoctorsPage() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState("");
  const [doctors, setDoctors] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getAllOnboardedDoctors();
        if (!cancelled) setDoctors(list);
      } catch (err) {
        console.warn("[Medscope] Doctor directory load failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const specialtyMatches = useMemo(
    () => (searched ? matchSpecialtiesForProblem(problem, 3) : []),
    [problem, searched]
  );

  const results = useMemo(
    () => (searched ? findDoctorsForProblem(doctors, problem, 6) : []),
    [doctors, problem, searched]
  );

  const runSearch = (value?: string) => {
    const next = value !== undefined ? value : problem;
    setProblem(next);
    if (next.trim()) setSearched(true);
  };

  return (
    <PatientPageLayout>
      <div className="w-full flex flex-col gap-8 pb-10">
        <PageHeader
          title="Find Doctors for Your Problem"
          subtitle="Describe what you're feeling in plain words. Medscope matches you with the right specialists."
        />

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    value={problem}
                    onChange={(e) => {
                      setProblem(e.target.value);
                      setSearched(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="e.g. chest pain, feeling anxious, high blood sugar, knee pain..."
                    className="pl-11 h-12 rounded-xl bg-background/60 border-border/60 text-sm font-medium"
                  />
                </div>
                <Button
                  onClick={() => runSearch()}
                  disabled={!problem.trim()}
                  className="h-12 rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Find Doctors
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_PROBLEMS.map((q) => (
                  <button
                    key={q}
                    onClick={() => runSearch(q)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      problem === q
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/60 text-muted-foreground border-border/50 hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Specialty Matches */}
        {searched && specialtyMatches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h2 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Based on your problem, these specialties fit
            </h2>
            <div className="flex flex-wrap gap-2">
              {specialtyMatches.map((m, i) => (
                <Badge
                  key={m.specialty}
                  variant="secondary"
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                    i === 0
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-secondary/70 text-foreground border-border/50"
                  }`}
                >
                  {m.specialty}
                  {i === 0 && " • Best match"}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground tracking-tight">
              {results.length > 0
                ? `${results.length} doctor${results.length > 1 ? "s" : ""} who can help`
                : "No matching doctors"}
            </h2>

            {loading && <p className="text-sm text-muted-foreground">Loading doctor directory...</p>}

            {!loading && results.length === 0 && (
              <Card className="rounded-[1.5rem] border-border/50 bg-card/50">
                <CardContent className="p-10 flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
                    <SearchX className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="font-bold text-foreground">No specialists matched "{problem}"</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Try different words, like "stomach pain" instead of "gastric issue", or pick a quick
                    suggestion above.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((doc, index) => (
                <motion.div
                  key={doc.uid}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                >
                  <Card className="rounded-[1.5rem] border-border/50 bg-card/60 backdrop-blur-md hover:bg-card/90 hover:-translate-y-1 hover:shadow-xl transition-all group">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doc.fullName}`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {String(doc.fullName || "Dr").replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                              {doc.fullName}
                            </h4>
                            <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </div>
                          <p className="text-sm font-bold text-primary">{doc.specialization}</p>
                          {doc.subSpecialization && (
                            <p className="text-xs text-muted-foreground font-medium">{doc.subSpecialization}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="flex gap-1 items-center bg-yellow-500/10 text-yellow-600 border-yellow-500/20 font-bold shrink-0">
                          <Star className="w-3 h-3 fill-yellow-500 stroke-none" /> 4.8
                        </Badge>
                      </div>

                      {doc.professionalBio && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {doc.professionalBio}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-background/70 border border-border/40 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold text-foreground/90">
                          <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{doc.hospital || "—"}</span>
                        </div>
                        <div className="bg-background/70 border border-border/40 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold text-foreground/90">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{doc.city || "—"}</span>
                        </div>
                        <div className="bg-background/70 border border-border/40 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold text-foreground/90">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ₹{doc.consultationFee || "—"} • {doc.experienceYears || 0}+ yrs
                        </div>
                        <div className="bg-background/70 border border-border/40 rounded-xl px-3 py-2 flex items-center gap-1.5 font-semibold text-foreground/90">
                          <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {Array.isArray(doc.consultationTypes) && doc.consultationTypes.length
                            ? doc.consultationTypes.join(", ")
                            : "Video"}
                        </div>
                      </div>

                      {Array.isArray(doc.areasOfExpertise) && doc.areasOfExpertise.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {doc.areasOfExpertise.slice(0, 4).map((area: string) => (
                            <span
                              key={area}
                              className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => navigate("/patient/consultations", { state: { focusDoctorId: doc.uid } })}
                        className="w-full rounded-xl h-10 font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-none transition-all"
                      >
                        Book Consultation
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Idle state before first search */}
        {!searched && (
          <Card className="rounded-[1.5rem] border-dashed border-border/60 bg-card/30">
            <CardContent className="p-10 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <p className="font-bold text-foreground">Describe your problem to begin</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Type how you feel ("chest tightness while walking", "can't sleep because of stress") and
                Medscope ranks the right specialists from the doctor directory.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PatientPageLayout>
  );
}
