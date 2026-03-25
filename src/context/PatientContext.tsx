import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { secureStorage } from "@/lib/secureStorage";

// ─── Default widget order (center column of dashboard) ───
export const DEFAULT_WIDGET_ORDER = [
  { id: "quick-actions", label: "Quick Actions", visible: true },
  { id: "medicine-timer", label: "Medicine Timer", visible: true },
  { id: "consultations", label: "Consultations", visible: true },
  { id: "mental-wellness", label: "Mental Wellness", visible: true },
];

export interface WidgetConfig {
  id: string;
  label: string;
  visible: boolean;
}

export interface PatientProfile {
  // Basic
  fullName?: string;
  email?: string;
  phone?: string;
  age?: string;
  gender?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  city?: string;
  // Health
  conditions?: string[];
  hasMedications?: boolean;
  medications?: string;
  hasAllergies?: boolean;
  allergies?: string;
  hasSurgeries?: boolean;
  surgeries?: string;
  familyHistory?: string;
  // Lifestyle
  activityLevel?: string;
  sleepQuality?: string;
  stressLevel?: string;
  waterIntake?: string;
  diet?: string;
  smokes?: boolean;
  alcohol?: boolean;
  wellnessInterests?: string[];
  // Emergency & Prefs
  emergencyName?: string;
  emergencyPhone?: string;
  consultationType?: string;
  healthFocus?: string;
  reminderPreferences?: string[];
  language?: string;
  // Meta
  profileCompleteness?: number;
}

export type ReminderType = "All" | "Medicines" | "Meals" | "Water" | "Appointments" | "Wellness";
export type ReminderStatus = "upcoming" | "completed" | "missed";

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: ReminderType;
  status: ReminderStatus;
  repeat: string;
  iconName: string;
  color: string;
  bg: string;
}

interface PatientContextType {
  profile: PatientProfile;
  setProfile: (data: PatientProfile) => void;
  updateProfile: (partial: Partial<PatientProfile>) => void;
  widgetOrder: WidgetConfig[];
  setWidgetOrder: (order: WidgetConfig[]) => void;
  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, "id">) => void;
  markReminderDone: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PROFILE_KEY = "medscope-patient-profile";
const WIDGETS_KEY = "medscope-widget-order";

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<PatientProfile>(() => {
    try {
      const stored = secureStorage.getItem<PatientProfile>(PROFILE_KEY);
      return stored || {};
    } catch {
      return {};
    }
  });

  const [widgetOrder, setWidgetOrderState] = useState<WidgetConfig[]>(() => {
    try {
      const stored = secureStorage.getItem<WidgetConfig[]>(WIDGETS_KEY);
      if (stored) {
        // Ensure legacy deprecated widgets are stripped out automatically
        return stored.filter((w: WidgetConfig) => w.id !== "health-progress");
      }
      return DEFAULT_WIDGET_ORDER;
    } catch {
      return DEFAULT_WIDGET_ORDER;
    }
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const stored = secureStorage.getItem<Reminder[]>("medscope-reminders");
      if (stored && stored.length > 0) return stored;
      // Default initial mock data
      return [
        { id: "1", title: "Amoxicillin (500mg)", time: "08:00 AM", type: "Medicines", status: "completed", repeat: "Daily, 2 times", iconName: "Pill", color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "2", title: "Drink Water (2/8 Glasses)", time: "10:00 AM", type: "Water", status: "completed", repeat: "Every 2 hours", iconName: "Droplets", color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { id: "3", title: "Dr. Smith Consultation", time: "02:30 PM", type: "Appointments", status: "upcoming", repeat: "One-time", iconName: "Calendar", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { id: "4", title: "Afternoon Walk", time: "05:00 PM", type: "Wellness", status: "upcoming", repeat: "Daily", iconName: "Brain", color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: "5", title: "Dinner (Low Carb)", time: "07:30 PM", type: "Meals", status: "upcoming", repeat: "Daily", iconName: "Utensils", color: "text-orange-500", bg: "bg-orange-500/10" },
        { id: "6", title: "Vitamin D3", time: "Yesterday", type: "Medicines", status: "missed", repeat: "Weekly", iconName: "Pill", color: "text-red-500", bg: "bg-red-500/10" },
      ];
    } catch {
      return [];
    }
  });

  // Persist profile
  useEffect(() => {
    secureStorage.setItem(PROFILE_KEY, profile);
  }, [profile]);

  // Persist widget order
  useEffect(() => {
    secureStorage.setItem(WIDGETS_KEY, widgetOrder);
  }, [widgetOrder]);

  useEffect(() => {
    secureStorage.setItem("medscope-reminders", reminders);
  }, [reminders]);

  const setProfile = (data: PatientProfile) => {
    setProfileState(data);
  };

  const updateProfile = (partial: Partial<PatientProfile>) => {
    setProfileState((prev) => ({ ...prev, ...partial }));
  };

  const setWidgetOrder = (order: WidgetConfig[]) => {
    setWidgetOrderState(order);
  };

  const addReminder = (r: Omit<Reminder, "id">) => {
    const newReminder = { ...r, id: Math.random().toString(36).substr(2, 9) };
    setReminders(prev => [...prev, newReminder as Reminder]);
  };

  const markReminderDone = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "completed" } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <PatientContext.Provider value={{ 
      profile, setProfile, updateProfile, 
      widgetOrder, setWidgetOrder,
      reminders, addReminder, markReminderDone, deleteReminder
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return ctx;
};

export default PatientContext;
