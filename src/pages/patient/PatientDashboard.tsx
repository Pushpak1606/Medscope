import React from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { usePatient } from "@/context/PatientContext";
import { Sun, Moon, CloudSun, Sparkles } from "lucide-react";
import { GlobalCommand } from "@/components/ui/global-command";
import { EmergencyFAB } from "@/components/ui/emergency-fab";

// Widgets
import HealthProgressWidget from "@/components/patient-dashboard/widgets/HealthProgressWidget";
import AccordionInfoWidget from "@/components/patient-dashboard/widgets/AccordionInfoWidget";
import MedicineTimerWidget from "@/components/patient-dashboard/widgets/MedicineTimerWidget";
import DailyTasksWidget from "@/components/patient-dashboard/widgets/DailyTasksWidget";
import ConsultationWidget from "@/components/patient-dashboard/widgets/ConsultationWidget";
import QuickActionsWidget from "@/components/patient-dashboard/widgets/QuickActionsWidget";
import MentalWellnessWidget from "@/components/patient-dashboard/widgets/MentalWellnessWidget";

// Widget registry — maps IDs from widgetOrder to actual components
const WIDGET_MAP: Record<string, React.FC> = {
  "medicine-timer": MedicineTimerWidget,
  "quick-actions": QuickActionsWidget,
  "consultations": ConsultationWidget,
  "mental-wellness": MentalWellnessWidget,
};

// Widgets that render as a pair (side-by-side on desktop)
const PAIRED_IDS = new Set(["medicine-timer", "consultations", "mental-wellness"]);

const PatientDashboard = () => {
  const { profile, widgetOrder } = usePatient();

  // Derive display name
  const displayName = profile.fullName?.split(" ")[0] || "Patient";
  const completeness = profile.profileCompleteness ?? 85;

  // Time-Aware Logic
  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  let subtitle = "Time to wind down and review your day.";
  let timeTheme = "from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/20";
  let TimeIcon = Moon;
  let iconColor = "text-indigo-400";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
    subtitle = "Let's start your day with your health in focus.";
    timeTheme = "from-amber-500/15 via-orange-500/5 to-transparent border-amber-500/20";
    TimeIcon = Sun;
    iconColor = "text-amber-500";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
    subtitle = "Keep up the momentum for a healthy day.";
    timeTheme = "from-blue-500/15 via-cyan-500/5 to-transparent border-blue-500/20";
    TimeIcon = CloudSun;
    iconColor = "text-blue-500";
  }

  // Build ordered visible widgets from context
  const visibleWidgets = widgetOrder.filter((w) => w.visible);

  const renderCenterColumn = () => {
    return visibleWidgets.map((w) => {
      const Component = WIDGET_MAP[w.id];
      if (!Component) return null;

      const isPaired = PAIRED_IDS.has(w.id);
      const spanClass = isPaired ? "col-span-1" : "col-span-1 sm:col-span-2";

      return (
        <div key={w.id} className={spanClass}>
          <Component />
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      {/* Dynamic Background */}
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        
        {/* Header (Top Navigation) */}
        <DashboardHeader profile={{ name: displayName, profileCompleteness: completeness }} />

        {/* Welcome Banner (Immersive & Time-Aware) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className={`relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br ${timeTheme} border shadow-sm mb-4`}
        >
          {/* Ambient Glow behind the text */}
          <div className="absolute top-0 left-0 w-full h-full bg-card/40 backdrop-blur-[2px] z-0 pointer-events-none"></div>

          <div className="relative z-10 flex gap-5 items-center lg:items-start">
            <div className={`hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-background/50 backdrop-blur-md border border-border/50 shadow-sm ${iconColor}`}>
              <TimeIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight mb-2 flex items-center gap-3">
                {greeting}, {displayName}
              </h1>
              <p className="text-muted-foreground font-medium text-base sm:text-lg">{subtitle}</p>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-wrap items-center gap-3">
             <div className="px-5 py-2.5 bg-background/60 backdrop-blur-md text-primary border border-primary/20 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-background/80 transition-colors cursor-pointer group">
               <span className="h-2 w-2 rounded-full bg-primary group-hover:animate-pulse"></span>
               3 Reminders Today
             </div>
             <div className="px-5 py-2.5 bg-background/60 backdrop-blur-md text-amber-500 border border-amber-500/20 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-background/80 transition-colors cursor-pointer group">
               <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
               12 Day Streak
             </div>
             <div className="px-5 py-2.5 bg-background/60 backdrop-blur-md text-emerald-500 border border-emerald-500/20 rounded-xl font-bold text-sm shadow-sm hover:bg-background/80 transition-colors cursor-pointer">
               Profile {completeness}%
             </div>
          </div>
        </motion.div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 auto-rows-max items-start">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6 xl:gap-8 lg:col-span-3">
            <HealthProgressWidget />
            <AccordionInfoWidget />
          </div>

          {/* Center Column — Dynamically packed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:gap-8 lg:col-span-6 grid-flow-row-dense">
            {renderCenterColumn()}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 xl:gap-8 lg:col-span-3">
            <DailyTasksWidget />
          </div>

        </div>
      </div>

      {/* Mobile Nav & Global Controls */}
      <MobileNavDock />
      <GlobalCommand />
      <EmergencyFAB />
    </div>
  );
};

export default PatientDashboard;
