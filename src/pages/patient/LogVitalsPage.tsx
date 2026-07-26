import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Scale, 
  Moon, 
  Zap, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Sparkles,
  Clock,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine
} from "recharts";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { usePatient, VitalsLog } from "@/context/PatientContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { toast } from "sonner";

// Container animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function LogVitalsPage() {
  const { profile, vitalsLogs, addVitalsLog, deleteVitalsLog } = usePatient();

  // --- Form State ---
  const [heartRate, setHeartRate] = useState<number | "">(72);
  const [bpSys, setBpSys] = useState<number | "">(120);
  const [bpDia, setBpDia] = useState<number | "">(80);
  const [spO2, setSpO2] = useState<number | "">(98);
  const [temp, setTemp] = useState<number | "">(98.6);
  const [glucose, setGlucose] = useState<number | "">(95);
  const [weight, setWeight] = useState<number | "">(Number(profile?.weight) || 70);
  const [water, setWater] = useState<number>(6);
  const [sleep, setSleep] = useState<number>(7.5);
  const [notes, setNotes] = useState<string>("");

  // Chart Tab State
  const [activeChartTab, setActiveChartTab] = useState<string>("bp");
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

  // Clinical Status Evaluation
  const evaluatedStatus = useMemo(() => {
    const sys = Number(bpSys) || 120;
    const dia = Number(bpDia) || 80;
    const hr = Number(heartRate) || 72;
    const o2 = Number(spO2) || 98;
    const t = Number(temp) || 98.6;

    if (sys >= 140 || dia >= 90 || hr > 100 || o2 < 95 || t >= 100.4) {
      return { label: "Attention Needed", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", icon: AlertTriangle, desc: "Some vitals are slightly outside target reference limits." };
    }
    if (sys <= 120 && dia <= 80 && hr >= 60 && hr <= 80 && o2 >= 98) {
      return { label: "Optimal Baseline", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2, desc: "All logged metrics align with peak healthy clinical reference standards." };
    }
    return { label: "Normal Range", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: ShieldCheck, desc: "Vitals are stable and within healthy standard limits." };
  }, [bpSys, bpDia, heartRate, spO2, temp]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: Omit<VitalsLog, "id"> = {
      timestamp: new Date().toISOString(),
      heartRate: heartRate !== "" ? Number(heartRate) : undefined,
      bloodPressureSys: bpSys !== "" ? Number(bpSys) : undefined,
      bloodPressureDia: bpDia !== "" ? Number(bpDia) : undefined,
      spO2: spO2 !== "" ? Number(spO2) : undefined,
      temperature: temp !== "" ? Number(temp) : undefined,
      bloodGlucose: glucose !== "" ? Number(glucose) : undefined,
      weight: weight !== "" ? Number(weight) : undefined,
      waterIntake: water,
      sleepHours: sleep,
      notes: notes.trim() ? notes : undefined,
      status: evaluatedStatus.label.includes("Optimal") ? "Optimal" : evaluatedStatus.label.includes("Attention") ? "Attention" : "Normal"
    };

    addVitalsLog(newLog);
    toast.success("Vitals successfully logged!", {
      description: `Logged at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with status: ${evaluatedStatus.label}`
    });

    // Reset notes
    setNotes("");
  };

  // Export summary handler
  const handleExportSummary = () => {
    const latest = vitalsLogs[0];
    if (!latest) {
      toast.error("No vitals logs available to export.");
      return;
    }
    const text = `Medscope Vitals Report (${new Date(latest.timestamp).toLocaleDateString()}):\n` +
      `• Heart Rate: ${latest.heartRate || "N/A"} BPM\n` +
      `• Blood Pressure: ${latest.bloodPressureSys || "N/A"}/${latest.bloodPressureDia || "N/A"} mmHg\n` +
      `• SpO2: ${latest.spO2 || "N/A"}%\n` +
      `• Temp: ${latest.temperature || "N/A"} °F\n` +
      `• Glucose: ${latest.bloodGlucose || "N/A"} mg/dL\n` +
      `• Weight: ${latest.weight || "N/A"} kg\n` +
      `• Status: ${latest.status || "Normal"}`;

    navigator.clipboard.writeText(text);
    toast.success("Vitals summary copied to clipboard!", { description: "Ready to share with your physician or caregiver." });
  };

  // Recharts Processed Data
  const chartData = useMemo(() => {
    const list = [...vitalsLogs].reverse(); // chronological order
    return list.map((log) => {
      const dateStr = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
      return {
        date: dateStr,
        fullTime: new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        hr: log.heartRate || 72,
        sys: log.bloodPressureSys || 120,
        dia: log.bloodPressureDia || 80,
        spO2: log.spO2 || 98,
        temp: log.temperature || 98.6,
        glucose: log.bloodGlucose || 95,
        weight: log.weight || 70
      };
    });
  }, [vitalsLogs]);

  // Latest check-in time formatted
  const lastCheckIn = vitalsLogs.length > 0 
    ? new Date(vitalsLogs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "Not logged yet today";

  return (
    <PatientPageLayout className="w-full">
      <motion.div 
        className="w-full space-y-8 lg:space-y-10 pb-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* --- PAGE HEADER --- */}
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Log Vitals & Health Metrics"
            subtitle="Record your body's key health signals, view historical trends, and keep your care team informed."
          >
            <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Check-in: {lastCheckIn}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                <span>Vitals Streak: {vitalsLogs.length} Days</span>
              </div>

              <Button 
                onClick={handleExportSummary}
                size="sm" 
                variant="outline" 
                className="rounded-full gap-1.5 border-border/60 bg-card/60 hover:bg-card text-xs font-bold text-foreground"
              >
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>Export Report</span>
              </Button>
            </div>
          </PageHeader>
        </motion.div>

        {/* --- AI REAL-TIME STATUS BANNER --- */}
        <motion.div variants={itemVariants}>
          <GlassCard className={`p-5 sm:p-6 border rounded-3xl ${evaluatedStatus.bg} transition-all duration-300 relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${evaluatedStatus.bg} border ${evaluatedStatus.color}`}>
                  <evaluatedStatus.icon className={`w-6 h-6 ${evaluatedStatus.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-base ${evaluatedStatus.color}`}>
                      Current Vitals Assessment: {evaluatedStatus.label}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-white/10 text-foreground">
                      Real-Time AI Evaluated
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {evaluatedStatus.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <div className="text-right hidden md:block">
                  <span className="text-xs text-muted-foreground block font-medium">Target Blood Pressure</span>
                  <span className="text-xs font-bold text-foreground">120/80 mmHg</span>
                </div>
                <div className="h-8 w-px bg-border/50 hidden md:block" />
                <div className="text-right hidden md:block">
                  <span className="text-xs text-muted-foreground block font-medium">Target SpO2</span>
                  <span className="text-xs font-bold text-emerald-400">95% – 100%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* --- MAIN GRID: INPUT FORM + INSIGHTS & CHARTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: INPUT FORM CARDS (7 COLS) --- */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6 sm:p-8 rounded-[2.5rem] border border-border/50 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-xl text-foreground tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" />
                    <span>Log Daily Vitals</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your latest readings below. Pre-filled with standard baseline values.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Quick Entry
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Blood Pressure Dual Field */}
                <div className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Blood Pressure</h4>
                        <span className="text-[11px] text-muted-foreground">Systolic / Diastolic (mmHg)</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Normal: 120/80
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        Systolic (Upper)
                      </label>
                      <NumberStepper
                        min={70}
                        max={220}
                        value={bpSys}
                        onChange={(v) => setBpSys(v)}
                        placeholder="120"
                        variant="vertical-stacked"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        Diastolic (Lower)
                      </label>
                      <NumberStepper
                        min={40}
                        max={140}
                        value={bpDia}
                        onChange={(v) => setBpDia(v)}
                        placeholder="80"
                        variant="vertical-stacked"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Heart Rate & SpO2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Heart Rate */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Heart className="w-4 h-4 animate-pulse" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Heart Rate</h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">BPM</span>
                    </div>

                    <NumberStepper
                      min={40}
                      max={200}
                      value={heartRate}
                      onChange={(v) => setHeartRate(v)}
                      placeholder="72"
                      variant="horizontal"
                    />
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">Target: 60 - 100 bpm</span>
                  </div>

                  {/* Oxygen Saturation SpO2 */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Oxygen (SpO2)</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">%</span>
                    </div>

                    <NumberStepper
                      min={80}
                      max={100}
                      value={spO2}
                      onChange={(v) => setSpO2(v)}
                      placeholder="98"
                      variant="horizontal"
                    />
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">Target: 95% – 100%</span>
                  </div>

                </div>

                {/* 3. Temperature & Glucose Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Thermometer className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Body Temp</h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">°F</span>
                    </div>

                    <NumberStepper
                      min={94}
                      max={108}
                      step={0.1}
                      value={temp}
                      onChange={(v) => setTemp(v)}
                      placeholder="98.6"
                      variant="vertical-stacked"
                    />
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">Normal: 97.8°F – 99.1°F</span>
                  </div>

                  {/* Blood Glucose */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Blood Glucose</h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">mg/dL</span>
                    </div>

                    <NumberStepper
                      min={50}
                      max={400}
                      value={glucose}
                      onChange={(v) => setGlucose(v)}
                      placeholder="95"
                      variant="vertical-stacked"
                    />
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">Fasting target: 70 – 99 mg/dL</span>
                  </div>

                </div>

                {/* 4. Lifestyle Counters: Water & Sleep */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Water Intake Counter */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Droplets className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Water Intake</h4>
                      </div>
                      <span className="text-xs font-bold text-blue-400">{water} / 8 Glasses</span>
                    </div>

                    <NumberStepper
                      min={0}
                      max={16}
                      step={1}
                      value={water}
                      onChange={(v) => setWater(typeof v === "number" ? v : 0)}
                      variant="horizontal"
                    />
                  </div>

                  {/* Sleep Hours Counter */}
                  <div className="p-4 rounded-2xl bg-card/60 border border-border/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Moon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">Sleep Duration</h4>
                      </div>
                      <span className="text-xs font-bold text-indigo-400">{sleep} Hours</span>
                    </div>

                    <NumberStepper
                      min={0}
                      max={16}
                      step={0.5}
                      value={sleep}
                      onChange={(v) => setSleep(typeof v === "number" ? v : 0)}
                      variant="horizontal"
                    />
                  </div>

                </div>

                {/* 5. Notes & Symptoms Field */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    Symptom Notes & Context (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Felt relaxed after morning walk. No headache or dizziness..."
                    rows={3}
                    className="rounded-2xl border-border/60 bg-card/80 p-3 text-sm placeholder:text-muted-foreground/60 resize-none focus:ring-primary"
                  />
                </div>

                {/* Submit Action Button */}
                <LiquidGlassButton
                  type="submit"
                  className="w-full h-13 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2 shadow-xl shadow-primary/20 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Save Daily Vitals Reading</span>
                </LiquidGlassButton>

              </form>
            </GlassCard>
          </motion.div>

          {/* --- RIGHT COLUMN: HISTORICAL CHARTS & TRENDS (5 COLS) --- */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
            
            {/* --- RECHARTS GRAPH CARD --- */}
            <GlassCard className="p-6 rounded-[2.5rem] border border-border/50 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Vitals Trend Charts</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Historical metrics overview</p>
                </div>

                <div className="flex items-center gap-1 bg-card border border-border/60 p-1 rounded-xl text-xs font-bold">
                  <button 
                    onClick={() => setTimeframe("7d")} 
                    className={`px-2.5 py-1 rounded-lg transition-colors ${timeframe === "7d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => setTimeframe("30d")} 
                    className={`px-2.5 py-1 rounded-lg transition-colors ${timeframe === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Chart Tabs */}
              <Tabs value={activeChartTab} onValueChange={setActiveChartTab} className="w-full">
                <TabsList className="grid grid-cols-4 bg-background/80 p-1 rounded-xl mb-4 border border-border/40">
                  <TabsTrigger value="bp" className="text-xs font-bold rounded-lg py-1.5">BP</TabsTrigger>
                  <TabsTrigger value="hr" className="text-xs font-bold rounded-lg py-1.5">Heart</TabsTrigger>
                  <TabsTrigger value="spo2" className="text-xs font-bold rounded-lg py-1.5">SpO2</TabsTrigger>
                  <TabsTrigger value="temp" className="text-xs font-bold rounded-lg py-1.5">Temp</TabsTrigger>
                </TabsList>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeChartTab === "bp" ? (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="sysColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="diaColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[60, 160]} />
                        <Tooltip content={<CustomChartTooltip />} />
                        <ReferenceLine y={120} label={{ value: 'Sys Target (120)', fill: '#f43f5e', fontSize: 10 }} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.5} />
                        <Area type="monotone" dataKey="sys" name="Systolic" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#sysColor)" />
                        <Area type="monotone" dataKey="dia" name="Diastolic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#diaColor)" />
                      </AreaChart>
                    ) : activeChartTab === "hr" ? (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="hrColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[50, 120]} />
                        <Tooltip content={<CustomChartTooltip />} />
                        <ReferenceLine y={72} stroke="#ec4899" strokeDasharray="3 3" opacity={0.5} />
                        <Area type="monotone" dataKey="hr" name="Heart Rate (BPM)" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#hrColor)" />
                      </AreaChart>
                    ) : activeChartTab === "spo2" ? (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="spo2Color" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[90, 100]} />
                        <Tooltip content={<CustomChartTooltip />} />
                        <ReferenceLine y={95} stroke="#06b6d4" strokeDasharray="3 3" opacity={0.5} />
                        <Area type="monotone" dataKey="spO2" name="SpO2 (%)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#spo2Color)" />
                      </AreaChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[96, 102]} />
                        <Tooltip content={<CustomChartTooltip />} />
                        <ReferenceLine y={98.6} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
                        <Area type="monotone" dataKey="temp" name="Temperature (°F)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#tempColor)" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </Tabs>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Avg Heart Rate: 72 bpm</span>
                <span>Avg BP: 119/78 mmHg</span>
              </div>
            </GlassCard>

            {/* --- RECENT LOGS HISTORY CARDS --- */}
            <GlassCard className="p-6 rounded-[2.5rem] border border-border/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Recent Vitals History</span>
                </h3>
                <span className="text-xs font-semibold text-muted-foreground">
                  {vitalsLogs.length} Total Logs
                </span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
                <AnimatePresence>
                  {vitalsLogs.map((log) => {
                    const formattedDate = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    const isOptimal = log.status === "Optimal";
                    const isAttention = log.status === "Attention";

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${isOptimal ? "bg-emerald-400 animate-pulse" : isAttention ? "bg-amber-400" : "bg-blue-400"}`} />
                            <span className="text-xs font-bold text-foreground">{formattedDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOptimal ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : isAttention ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                              {log.status || "Normal"}
                            </span>
                            <button
                              onClick={() => {
                                deleteVitalsLog(log.id);
                                toast.success("Vitals log removed.");
                              }}
                              className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                              title="Delete log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Metrics Pills */}
                        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                          <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                            <span className="text-[10px] text-muted-foreground block">Blood Pressure</span>
                            <span className="font-bold text-foreground">{log.bloodPressureSys || 120}/{log.bloodPressureDia || 80}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                            <span className="text-[10px] text-muted-foreground block">Heart Rate</span>
                            <span className="font-bold text-rose-400">{log.heartRate || 72} BPM</span>
                          </div>
                          <div className="p-2 rounded-xl bg-background/50 border border-border/30">
                            <span className="text-[10px] text-muted-foreground block">SpO2</span>
                            <span className="font-bold text-cyan-400">{log.spO2 || 98}%</span>
                          </div>
                        </div>

                        {log.notes && (
                          <p className="text-xs text-muted-foreground italic bg-background/30 p-2 rounded-lg border border-border/20">
                            "{log.notes}"
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </GlassCard>

          </motion.div>
        </div>
      </motion.div>
    </PatientPageLayout>
  );
}

// Custom Recharts Tooltip
function CustomChartTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/60 p-3 rounded-2xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-foreground">{data.fullTime}</p>
        <div className="space-y-0.5 text-muted-foreground font-medium">
          <p className="text-rose-400 font-bold">Blood Pressure: {data.sys}/{data.dia} mmHg</p>
          <p className="text-pink-400 font-bold">Heart Rate: {data.hr} BPM</p>
          <p className="text-cyan-400 font-bold">SpO2: {data.spO2}%</p>
          <p className="text-amber-400 font-bold">Temp: {data.temp} °F</p>
        </div>
      </div>
    );
  }
  return null;
}
