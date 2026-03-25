import React from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { usePatient } from "@/context/PatientContext";

// Widgets
import ProfileSnapshotWidget from "@/components/patient-dashboard/widgets/ProfileSnapshotWidget";
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

  // Build ordered visible widgets from context
  const visibleWidgets = widgetOrder.filter((w) => w.visible);

  // Separate into paired (render 2-per-row) and full-width
  const renderCenterColumn = () => {
    const elements: React.ReactNode[] = [];
    let pairBuffer: React.ReactNode[] = [];

    visibleWidgets.forEach((w, i) => {
      const Component = WIDGET_MAP[w.id];
      if (!Component) return;

      if (PAIRED_IDS.has(w.id)) {
        pairBuffer.push(<Component key={w.id} />);
        // Flush pair when we have 2, or at end of list, or when next item is full-width
        const nextWidget = visibleWidgets[i + 1];
        const nextIsPaired = nextWidget && PAIRED_IDS.has(nextWidget.id);
        if (pairBuffer.length === 2 || !nextIsPaired) {
          elements.push(
            <div key={`pair-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:gap-8">
              {pairBuffer}
            </div>
          );
          pairBuffer = [];
        }
      } else {
        // Full-width widget (like Quick Actions)
        elements.push(<Component key={w.id} />);
      }
    });

    // Flush any remaining
    if (pairBuffer.length > 0) {
      elements.push(
        <div key="pair-last" className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:gap-8">
          {pairBuffer}
        </div>
      );
    }

    return elements;
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

        {/* Welcome Top Strip (Greeting & Pills) */}
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-6 border-b border-border/40 mb-2"
        >
          <div>
            <h1 className="text-4xl font-extrabold font-heading text-foreground tracking-tight mb-2">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground font-medium">Your personalized AI health companion.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
             <div className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-primary/20 transition-colors">
               <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
               3 Reminders Today
             </div>
             <div className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full font-bold text-sm shadow-sm hover:bg-blue-500/20 transition-colors">
               12 Day Streak
             </div>
             <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold text-sm shadow-sm hover:bg-emerald-500/20 transition-colors">
               Profile {completeness}%
             </div>
          </div>
        </motion.div>

        {/* Bento Grid Architecture */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.1 }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 auto-rows-[minmax(0,auto)]"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-6 xl:gap-8 lg:col-span-1 md:col-span-1">
            <ProfileSnapshotWidget profile={{
              name: displayName,
              healthFocus: profile.healthFocus,
              age: profile.age,
              bloodGroup: profile.bloodGroup,
              height: profile.height,
              weight: profile.weight,
              profileCompleteness: completeness,
            }} />
            <AccordionInfoWidget />
          </div>

          {/* Center Column — Dynamically rendered from widgetOrder */}
          <div className="flex flex-col gap-6 xl:gap-8 lg:col-span-2 md:col-span-1">
            {renderCenterColumn()}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 xl:gap-8 lg:col-span-1 md:col-span-1">
            <DailyTasksWidget />
          </div>

        </motion.div>
      </div>

      {/* Mobile Nav */}
      <MobileNavDock />
    </div>
  );
};

export default PatientDashboard;
