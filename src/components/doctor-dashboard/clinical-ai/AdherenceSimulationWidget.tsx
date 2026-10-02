import React, { useState } from "react";
import {
  runAdherenceSimulation,
  SimulationResult,
  CohortName,
  SyntheticPatient,
} from "@/lib/adherenceSimulation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Users,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const AdherenceSimulationWidget: React.FC = () => {
  const [seed, setSeed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [data, setData] = useState<SimulationResult>(() => runAdherenceSimulation(0));
  const [selectedCohort, setSelectedCohort] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartView, setChartView] = useState<"cohorts" | "trajectory">("cohorts");

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const nextSeed = seed + 1;
      setSeed(nextSeed);
      const res = runAdherenceSimulation(nextSeed);
      setData(res);
      setIsSimulating(false);
      toast.success("90-Day Medication Adherence Simulation Recomputed", {
        description: `Overall Adherence: ${res.overall.simulatedAdherence}% (+${res.overall.relativeImprovement}% gain).`,
      });
    }, 600);
  };

  const filteredPatients = data.patients.filter((p) => {
    const matchesCohort = selectedCohort === "All" || p.cohort === selectedCohort;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medications.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCohort && matchesSearch;
  });

  const chartData = data.cohorts.map((c) => ({
    name: c.cohort.replace(" (3+ meds)", "").replace(" (Post-ACS)", ""),
    Baseline: c.baselineAdherence,
    Medscope: c.simulatedAdherence,
    Improvement: c.relativeImprovement,
  }));

  return (
    <div className="rounded-[2.5rem] bg-card/75 border border-border/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-9 w-9 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground tracking-tight">
              Medication Adherence Simulation & Clinical Validation
            </h2>
            <Badge variant="outline" className="text-xs font-bold text-primary border-primary/30 bg-primary/10">
              Chapter 6.1 (Table 6.1)
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs font-semibold">
              50 Synthetic Patients • 90 Days
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-medium max-w-3xl">
            Empirical benchmark comparing traditional reminder systems vs Medscope's Habituation-Resistant
            Intervention across 5 disease cohorts. Validated with randomized forgetting curves and escalation algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex rounded-xl bg-background/60 p-1 border border-border/50">
            <button
              onClick={() => setChartView("cohorts")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartView === "cohorts"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cohort Breakdown
            </button>
            <button
              onClick={() => setChartView("trajectory")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartView === "trajectory"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              90-Day Trajectory
            </button>
          </div>

          <Button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-bold text-xs h-10 px-4 shadow-lg shadow-primary/20 gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Simulating..." : "Re-run Simulation"}</span>
          </Button>
        </div>
      </div>

      {/* ─── SUMMARY KPI STATS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card/50 border border-border/60 space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Baseline Adherence
          </span>
          <p className="text-2xl font-black font-heading text-foreground">
            {data.overall.baselineAdherence}%
          </p>
          <span className="text-[11px] text-muted-foreground">Standard alarm reminder</span>
        </div>

        <div className="p-4 rounded-2xl bg-card/50 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
            Medscope Adherence
          </span>
          <p className="text-2xl font-black font-heading text-emerald-500">
            {data.overall.simulatedAdherence}%
          </p>
          <span className="text-[11px] text-emerald-600/80 font-semibold">Habituation-resistant</span>
        </div>

        <div className="p-4 rounded-2xl bg-card/50 border border-primary/30 bg-primary/5 space-y-1">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Relative Improvement
          </span>
          <p className="text-2xl font-black font-heading text-primary flex items-center gap-1">
            <TrendingUp className="h-5 w-5" />
            <span>+{data.overall.relativeImprovement}%</span>
          </p>
          <span className="text-[11px] text-primary/80 font-bold">{data.overall.pValue} (Significant)</span>
        </div>

        <div className="p-4 rounded-2xl bg-card/50 border border-border/60 space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Doses Tracked
          </span>
          <p className="text-2xl font-black font-heading text-foreground">
            {data.overall.totalDosesSimulated.toLocaleString()}
          </p>
          <span className="text-[11px] text-muted-foreground">Across 90-day period</span>
        </div>
      </div>

      {/* ─── CHARTS ─── */}
      <div className="p-5 rounded-2xl bg-card/40 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground font-heading">
            {chartView === "cohorts"
              ? "Figure 6.1: Adherence Comparison by Clinical Condition Category"
              : "Figure 6.2: 90-Day Longitudinal Adherence Curve (Decay vs Habituation-Resistant)"}
          </h3>
          <span className="text-xs text-muted-foreground">Values displayed as percentage (%)</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "cohorts" ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[30, 90]} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "1rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Baseline" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Baseline (%)" />
                <Bar dataKey="Medscope" fill="#10b981" radius={[6, 6, 0, 0]} name="Medscope (%)" />
              </BarChart>
            ) : (
              <LineChart data={data.dailyTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -5 }} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[40, 90]} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "1rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} dot={false} name="Standard Reminder (Decay)" />
                <Line type="monotone" dataKey="medscope" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Medscope (Adaptive Escalation)" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── COHORT BREAKDOWN TABLE ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <span>Table 6.1: Detailed Results by Condition Category</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-border/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/50">
              <tr>
                <th className="py-3 px-4">Condition Category</th>
                <th className="py-3 px-4">Patients (n)</th>
                <th className="py-3 px-4">Baseline (%)</th>
                <th className="py-3 px-4">Simulated Medscope (%)</th>
                <th className="py-3 px-4">Relative Improvement</th>
                <th className="py-3 px-4">P-Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-card/30">
              {data.cohorts.map((c) => (
                <tr key={c.cohort} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">{c.cohort}</td>
                  <td className="py-3 px-4 font-mono">{c.patientCount}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{c.baselineAdherence}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-500">{c.simulatedAdherence}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-primary">+{c.relativeImprovement}%</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{c.pValue}</td>
                </tr>
              ))}
              <tr className="bg-primary/5 font-bold border-t-2 border-primary/20">
                <td className="py-3 px-4 text-primary">Overall (n = 50)</td>
                <td className="py-3 px-4 font-mono">50</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{data.overall.baselineAdherence}%</td>
                <td className="py-3 px-4 font-mono text-emerald-500">{data.overall.simulatedAdherence}%</td>
                <td className="py-3 px-4 font-mono text-primary">+{data.overall.relativeImprovement}%</td>
                <td className="py-3 px-4 font-mono text-primary">{data.overall.pValue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SYNTHETIC PATIENT COHORT INSPECTOR (APPENDIX III) ─── */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              <span>Appendix III: Synthetic Patient Cohort Inspector ({filteredPatients.length} Profiles)</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Examine individual patient parameters, active prescriptions, and simulation responses.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patient or drug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 h-9 rounded-xl bg-background/60 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Cohort Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", "Hypertension", "Type 2 Diabetes", "Cardiac (Post-ACS)", "Mental Health Comorbid", "Polypharmacy (3+ meds)"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCohort(c)}
              className={`text-xs font-semibold px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedCohort === c
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-card/40 border border-border/50 hover:border-primary/40 transition-all space-y-2 text-xs"
            >
              <div className="flex justify-between items-start gap-1">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground block">{p.id}</span>
                  <h4 className="font-bold text-foreground text-sm">{p.name}</h4>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {p.age}y • {p.gender}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-primary">
                  +{p.relativeImprovement}%
                </Badge>
              </div>

              <div className="p-2 rounded-xl bg-background/50 border border-border/30 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Condition</span>
                <p className="font-semibold text-foreground text-[11px] truncate">{p.primaryCondition}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Medications</span>
                <div className="flex flex-wrap gap-1">
                  {p.medications.map((m, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Baseline: <strong className="text-foreground">{p.baselineAdherence}%</strong></span>
                <span className="text-emerald-500 font-bold">Simulated: {p.simulatedAdherence}%</span>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl">
              No synthetic patient profiles matched the filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdherenceSimulationWidget;
