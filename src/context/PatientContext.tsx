import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Default widget order (center column of dashboard) ───
export const DEFAULT_WIDGET_ORDER = [
  { id: "health-progress", label: "Health Progress", visible: true },
  { id: "medicine-timer", label: "Medicine Timer", visible: true },
  { id: "quick-actions", label: "Quick Actions", visible: true },
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

interface PatientContextType {
  profile: PatientProfile;
  setProfile: (data: PatientProfile) => void;
  updateProfile: (partial: Partial<PatientProfile>) => void;
  widgetOrder: WidgetConfig[];
  setWidgetOrder: (order: WidgetConfig[]) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PROFILE_KEY = "medscope-patient-profile";
const WIDGETS_KEY = "medscope-widget-order";

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<PatientProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [widgetOrder, setWidgetOrderState] = useState<WidgetConfig[]>(() => {
    try {
      const stored = localStorage.getItem(WIDGETS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_WIDGET_ORDER;
    } catch {
      return DEFAULT_WIDGET_ORDER;
    }
  });

  // Persist profile
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  // Persist widget order
  useEffect(() => {
    localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  const setProfile = (data: PatientProfile) => {
    setProfileState(data);
  };

  const updateProfile = (partial: Partial<PatientProfile>) => {
    setProfileState((prev) => ({ ...prev, ...partial }));
  };

  const setWidgetOrder = (order: WidgetConfig[]) => {
    setWidgetOrderState(order);
  };

  return (
    <PatientContext.Provider value={{ profile, setProfile, updateProfile, widgetOrder, setWidgetOrder }}>
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
