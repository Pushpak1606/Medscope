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

export interface PatientPreferences {
  notifications: {
    medicine: boolean;
    appointments: boolean;
    wellness: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    twoFactor: boolean;
    aiAnalysis: boolean;
  };
  consultation: {
    defaultMode: string;
    reminderTiming: string;
    preferredGender: string;
  };
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
  preferences?: PatientPreferences;
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
  editReminder: (id: string, updates: Partial<Reminder>) => void;
  markReminderDone: (id: string) => void;
  snoozeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PROFILE_KEY = "medscope-patient-profile";
const WIDGETS_KEY = "medscope-widget-order";

const DEFAULT_PREFERENCES: PatientPreferences = {
  notifications: { medicine: true, appointments: true, wellness: false, email: true, sms: false },
  privacy: { twoFactor: false, aiAnalysis: true },
  consultation: { defaultMode: "video", reminderTiming: "15", preferredGender: "any" }
};

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<PatientProfile>(() => {
    try {
      const stored = secureStorage.getItem<PatientProfile>(PROFILE_KEY);
      return stored || { preferences: DEFAULT_PREFERENCES };
    } catch {
      return { preferences: DEFAULT_PREFERENCES };
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
    setProfileState((prev) => {
      let newPreferences = prev.preferences;
      if (partial.preferences) {
        newPreferences = {
          notifications: { ...(prev.preferences?.notifications || DEFAULT_PREFERENCES.notifications), ...partial.preferences.notifications },
          privacy: { ...(prev.preferences?.privacy || DEFAULT_PREFERENCES.privacy), ...partial.preferences.privacy },
          consultation: { ...(prev.preferences?.consultation || DEFAULT_PREFERENCES.consultation), ...partial.preferences.consultation },
        };
      }
      return { ...prev, ...partial, preferences: newPreferences || DEFAULT_PREFERENCES };
    });
  };

  const setWidgetOrder = (order: WidgetConfig[]) => {
    setWidgetOrderState(order);
  };

  const addReminder = (r: Omit<Reminder, "id">) => {
    const newReminder = { ...r, id: Math.random().toString(36).substring(2, 9) };
    setReminders(prev => [...prev, newReminder as Reminder]);
  };

  const editReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const markReminderDone = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "completed" as const } : r));
  };

  const snoozeReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        // Simple 1-hour snooze logic for HH:MM AM/PM strings
        const timeMatch = r.time.match(/(\d+):(\d+)\s(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const mins = timeMatch[2];
          let period = timeMatch[3].toUpperCase();
          hours += 1;
          if (hours === 12) period = period === "AM" ? "PM" : "AM";
          if (hours > 12) hours = 1;
          const newTime = `${String(hours).padStart(2, '0')}:${mins} ${period}`;
          return { ...r, time: newTime };
        }
      }
      return r;
    }));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <PatientContext.Provider value={{ 
      profile, setProfile, updateProfile, 
      widgetOrder, setWidgetOrder,
      reminders, addReminder, editReminder, markReminderDone, snoozeReminder, deleteReminder
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
