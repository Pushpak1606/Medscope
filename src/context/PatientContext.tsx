import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { secureStorage } from "@/lib/secureStorage";
import { CommunityGroup, MOCK_GROUPS } from "@/lib/communityMockData";
import { ScreeningResult } from "@/lib/clinicalScreening";
import {
  savePatientOnboarding,
  getPatientProfile,
  ensureAuthenticatedUser,
} from "@/services/firebaseService";

// TODO (Backend Team):
// Replace local secureStorage / mock data state in PatientContext with REST / GraphQL API hooks (e.g. React Query).

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

export interface MoodLog {
  id: string;
  date: string;
  mood: string;
  score: number;
  note?: string;
}

export interface VitalsLog {
  id: string;
  timestamp: string;
  heartRate?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  spO2?: number;
  temperature?: number;
  bloodGlucose?: number;
  weight?: number;
  waterIntake?: number;
  sleepHours?: number;
  notes?: string;
  status?: "Normal" | "Attention" | "Optimal";
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  moodRating?: number; // 1-10 scale
  sleepQuality?: number; // 1-10 scale
  stressLevel?: number; // 1-10 scale
  energyLevel?: number; // 1-10 scale
  tags?: string[];
  aiInsight?: {
    sentiment: string;
    keyThemes: string[];
    clinicalConcern: boolean;
    recommendation: string;
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
  moodLogs?: MoodLog[];
  vitalsLogs?: VitalsLog[];
  savedQuotes?: string[];
  journalEntries?: JournalEntry[];
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
  missedStreak?: number; // 0, 1, 2, 3+ missed doses
  escalationLevel?: number; // 1 = standard, 2 = modal / intrusive, 3 = emergency / care team flag
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
  markReminderMissed: (id: string) => void;
  snoozeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addMoodLog: (log: Omit<MoodLog, "id">) => void;
  vitalsLogs: VitalsLog[];
  addVitalsLog: (log: Omit<VitalsLog, "id"> & { id?: string }) => void;
  deleteVitalsLog: (id: string) => void;
  toggleQuoteFavorite: (quoteId: string) => void;
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
  // Mental Health Screening Suite (PHQ-9, GAD-7, PSS-10)
  screeningHistory: ScreeningResult[];
  addScreeningResult: (result: Omit<ScreeningResult, "id" | "completedAt"> & { id?: string; completedAt?: string }) => void;
  clearScreeningHistory: () => void;

  /* =========================================================================
     ECOSYSTEM REAL-TIME SYNCHRONIZATION MUTATOR APIS (DOCTOR -> PATIENT)
     ========================================================================= */
  syncedMedications: { id: string; name: string; dosage: string; frequency: string; duration: string; mealTiming: string; instructions: string }[];
  syncedRecords: { id: string; title: string; type: string; category: string; date: string; summary: string }[];
  syncedLifestylePlan: string[];
  addDoctorPrescription: (item: { name: string; dosage: string; frequency: string; duration: string; mealTiming: string; instructions: string }) => void;
  addDoctorRecord: (record: { title: string; type: string; category: string; date: string; summary: string }) => void;
  updateDoctorLifestylePlan: (recs: string[]) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Community
  joinedGroups: string[];
  joinGroup: (id: string) => void;
  leaveGroup: (id: string) => void;
  groups: CommunityGroup[];
  createGroup: (group: Omit<CommunityGroup, "id" | "members" | "onlineCount">) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const PROFILE_KEY = "medscope-patient-profile";
const WIDGETS_KEY = "medscope-widget-order";

const DEFAULT_PREFERENCES: PatientPreferences = {
  notifications: { medicine: true, appointments: true, wellness: false, email: true, sms: false },
  privacy: { twoFactor: false, aiAnalysis: true },
  consultation: { defaultMode: "video", reminderTiming: "15", preferredGender: "any" }
};

// Dynamic 0-100% profile completeness calculation based on actual filled fields
export const calculateProfileCompleteness = (p: Partial<PatientProfile>): number => {
  let score = 0;
  if (p.fullName && p.fullName.trim()) score += 15;
  if ((p.email && p.email.trim()) || (p.phone && p.phone.trim())) score += 15;
  if ((p.age && p.age.trim()) || (p.gender && p.gender.trim())) score += 15;
  if ((p.bloodGroup && p.bloodGroup.trim()) || (p.city && p.city.trim())) score += 15;
  if (
    (p.conditions && p.conditions.length > 0) ||
    p.hasMedications ||
    p.hasAllergies ||
    p.hasSurgeries
  ) score += 20;
  if ((p.emergencyName && p.emergencyName.trim()) || (p.emergencyPhone && p.emergencyPhone.trim())) score += 10;
  if (p.activityLevel || p.sleepQuality || p.stressLevel || p.diet) score += 10;

  return Math.min(100, score);
};

/* =========================================================================
   FIRESTORE HYDRATION (called once by PatientHydrator in App.tsx)
   Pulls patients/{uid} and overlays it on the local profile so the whole
   app reflects what the patient filled during onboarding.
   ========================================================================= */
let patientHydrationStarted = false;

export const hydratePatientContextFromFirestore = (
  onProfile: (remote: Partial<PatientProfile>) => void
) => {
  if (patientHydrationStarted) return;
  patientHydrationStarted = true;
  (async () => {
    try {
      const { uid } = ensureAuthenticatedUser("patient");
      if (uid.startsWith("demo")) return; // demo preview: keep local defaults
      const remote = await getPatientProfile(uid);
      if (remote) onProfile(remote);
    } catch (err) {
      console.warn("[Medscope] Patient profile hydration skipped:", err);
    }
  })();
};

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<PatientProfile>(() => {
    try {
      const stored = secureStorage.getItem<PatientProfile>(PROFILE_KEY);
      const defaultState: PatientProfile = { 
        preferences: DEFAULT_PREFERENCES,
        moodLogs: [
          { id: "m1", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), mood: "Good", score: 4 },
          { id: "m2", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), mood: "Okay", score: 3 },
          { id: "m3", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), mood: "Great", score: 5 },
          { id: "m4", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), mood: "Rough", score: 2 },
          { id: "m5", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), mood: "Good", score: 4 },
          { id: "m6", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), mood: "Great", score: 5 },
        ],
        savedQuotes: ["q-1", "q-3"]
      };
      
      if (stored) {
        if (!stored.moodLogs) stored.moodLogs = defaultState.moodLogs;
        if (!stored.savedQuotes) stored.savedQuotes = defaultState.savedQuotes;
        stored.profileCompleteness = calculateProfileCompleteness(stored);
        return stored;
      }
      defaultState.profileCompleteness = calculateProfileCompleteness(defaultState);
      return defaultState;
    } catch {
      return { preferences: DEFAULT_PREFERENCES, moodLogs: [], savedQuotes: [], profileCompleteness: 0 };
    }
  });

  const [widgetOrder, setWidgetOrderState] = useState<WidgetConfig[]>(() => {
    try {
      const stored = secureStorage.getItem<WidgetConfig[]>(WIDGETS_KEY);
      if (stored) {
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

// ─── Module-level constant: prevents re-creation on every PatientProvider render ───
const MOCK_VITALS_LOGS: VitalsLog[] = [
  {
    id: "v1",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    heartRate: 72,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    spO2: 99,
    temperature: 98.4,
    bloodGlucose: 92,
    weight: 70.2,
    waterIntake: 8,
    sleepHours: 7.5,
    notes: "Felt great after morning run",
    status: "Optimal"
  },
  {
    id: "v2",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    heartRate: 76,
    bloodPressureSys: 122,
    bloodPressureDia: 80,
    spO2: 98,
    temperature: 98.6,
    bloodGlucose: 96,
    weight: 70.0,
    waterIntake: 7,
    sleepHours: 7.0,
    notes: "Regular check-in",
    status: "Normal"
  },
  {
    id: "v3",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    heartRate: 74,
    bloodPressureSys: 120,
    bloodPressureDia: 79,
    spO2: 98,
    temperature: 98.5,
    bloodGlucose: 94,
    weight: 69.8,
    waterIntake: 8,
    sleepHours: 7.5,
    notes: "Resting comfortably",
    status: "Optimal"
  },
  {
    id: "v4",
    timestamp: new Date().toISOString(),
    heartRate: 70,
    bloodPressureSys: 116,
    bloodPressureDia: 76,
    spO2: 99,
    temperature: 98.2,
    bloodGlucose: 90,
    weight: 69.7,
    waterIntake: 6,
    sleepHours: 8.0,
    notes: "Morning baseline vitals",
    status: "Optimal"
  }
];

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = secureStorage.getItem<JournalEntry[]>("medscope-journal");
      if (stored && stored.length > 0) return stored;
      return [
        {
          id: "j1",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          title: "Morning Reflections & Cardio Recovery",
          content: "Felt well-rested today after a 30-minute evening walk. Hydration was good, no palpitations noted.",
          mood: "Good",
          moodRating: 8,
          sleepQuality: 8,
          stressLevel: 3,
          energyLevel: 7,
          tags: ["Reflection", "Sleep", "Cardio"],
          aiInsight: {
            sentiment: "Positive / Regulated",
            keyThemes: ["Sleep restoration", "Physical activity tolerance"],
            clinicalConcern: false,
            recommendation: "Sustain consistent sleep schedule and 30-min walking routine."
          }
        },
        {
          id: "j2",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          title: "Managing Mid-Week Work Stress",
          content: "Practiced 4-7-8 breathing during afternoon meetings. Mild tension headache but eased up post-lunch.",
          mood: "Okay",
          moodRating: 6,
          sleepQuality: 6,
          stressLevel: 6,
          energyLevel: 5,
          tags: ["Mindfulness", "Stress"],
          aiInsight: {
            sentiment: "Mild Strain / Responsive",
            keyThemes: ["Work stress triggers", "Mindfulness coping"],
            clinicalConcern: false,
            recommendation: "Continue boundary setting and midday breathing breaks."
          }
        },
        {
          id: "j3",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          title: "Weekend Reset and Family Time",
          content: "High energy, pleasant mood. Had low-sodium dinner as advised in diet plan.",
          mood: "Great",
          moodRating: 9,
          sleepQuality: 9,
          stressLevel: 2,
          energyLevel: 8,
          tags: ["Family", "Diet", "Energy"],
          aiInsight: {
            sentiment: "Highly Positive",
            keyThemes: ["Dietary adherence", "Low stress state"],
            clinicalConcern: false,
            recommendation: "Optimal lifestyle balance observed."
          }
        },
      ];
    } catch {
      return [];
    }
  });

  const [screeningHistory, setScreeningHistory] = useState<ScreeningResult[]>(() => {
    try {
      const stored = secureStorage.getItem<ScreeningResult[]>("medscope-screening-history");
      if (stored && stored.length > 0) return stored;
      return [
        {
          id: "scr-1",
          instrument: "PHQ-9",
          score: 6,
          maxScore: 27,
          severity: "Mild",
          clinicalInterpretation: "Mild depressive symptoms noted.",
          actionRecommendation: "Engage in physical activity, sleep hygiene, and Medscope guided wellness exercises. Re-screen in 2 weeks.",
          escalationTriggered: false,
          crisisAlert: false,
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          answers: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0 },
        },
        {
          id: "scr-2",
          instrument: "GAD-7",
          score: 8,
          maxScore: 21,
          severity: "Mild",
          clinicalInterpretation: "Mild anxiety symptoms reported.",
          actionRecommendation: "Use Medscope Box Breathing, 5-4-3-2-1 grounding exercises, and daily emotional check-ins.",
          escalationTriggered: false,
          crisisAlert: false,
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          answers: { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1, 7: 0 },
        },
        {
          id: "scr-3",
          instrument: "PSS-10",
          score: 18,
          maxScore: 40,
          severity: "Moderate",
          clinicalInterpretation: "Moderate perceived stress level.",
          actionRecommendation: "Incorporate daily restorative breaks, sleep schedule stabilization, and Medscope journaling.",
          escalationTriggered: false,
          crisisAlert: false,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          answers: { 1: 2, 2: 2, 3: 3, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 1, 10: 2 },
        },
      ];
    } catch {
      return [];
    }
  });

  const [vitalsLogs, setVitalsLogs] = useState<VitalsLog[]>(() => {
    try {
      const stored = secureStorage.getItem<VitalsLog[]>("medscope-vitals-logs");
      if (stored && stored.length > 0) return stored;
      return MOCK_VITALS_LOGS;
    } catch {
      return MOCK_VITALS_LOGS;
    }
  });

  const [joinedGroups, setJoinedGroups] = useState<string[]>(() => {
    try {
      const stored = secureStorage.getItem<string[]>("medscope-joined-groups");
      return stored || ["g1", "g3"];
    } catch {
      return ["g1", "g3"];
    }
  });

  const [groups, setGroups] = useState<CommunityGroup[]>(() => {
    try {
      const stored = secureStorage.getItem<CommunityGroup[]>("medscope-custom-groups");
      return stored && stored.length > 0 ? [...MOCK_GROUPS, ...stored] : MOCK_GROUPS;
    } catch {
      return MOCK_GROUPS;
    }
  });

  // Persistence: local mirror + Firestore (patients/{uid})
  useEffect(() => {
    secureStorage.setItem(PROFILE_KEY, profile);
    const hasIdentity = Boolean(
      (profile.fullName && profile.fullName.trim()) ||
      (profile.email && profile.email.trim())
    );
    if (!hasIdentity) return;
    const { uid } = ensureAuthenticatedUser("patient");
    savePatientOnboarding(uid, profile).catch((err) =>
      console.warn("[Medscope] Patient profile sync to Firestore failed:", err)
    );
  }, [profile]);

  useEffect(() => {
    secureStorage.setItem(WIDGETS_KEY, widgetOrder);
  }, [widgetOrder]);

  useEffect(() => {
    secureStorage.setItem("medscope-reminders", reminders);
  }, [reminders]);

  useEffect(() => {
    secureStorage.setItem("medscope-journal", journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    secureStorage.setItem("medscope-screening-history", screeningHistory);
  }, [screeningHistory]);

  useEffect(() => {
    secureStorage.setItem("medscope-vitals-logs", vitalsLogs);
  }, [vitalsLogs]);

  useEffect(() => {
    secureStorage.setItem("medscope-joined-groups", joinedGroups);
  }, [joinedGroups]);

  const setProfile = (data: PatientProfile) => {
    const updated = { ...data, profileCompleteness: calculateProfileCompleteness(data) };
    setProfileState(updated);
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
      const merged = { ...prev, ...partial, preferences: newPreferences || DEFAULT_PREFERENCES };
      merged.profileCompleteness = calculateProfileCompleteness(merged);
      return merged;
    });
  };

  const setWidgetOrder = (order: WidgetConfig[]) => {
    setWidgetOrderState(order);
  };

  const addReminder = (r: Omit<Reminder, "id">) => {
    const newReminder = { 
      ...r, 
      id: Math.random().toString(36).substring(2, 9),
      missedStreak: 0,
      escalationLevel: 1
    };
    setReminders(prev => [...prev, newReminder as Reminder]);
  };

  const editReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const markReminderDone = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: "completed" as const,
      missedStreak: 0,
      escalationLevel: 1
    } : r));
  };

  const markReminderMissed = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newStreak = (r.missedStreak || 0) + 1;
      const newEscalation = newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1;
      return {
        ...r,
        status: "missed" as const,
        missedStreak: newStreak,
        escalationLevel: newEscalation,
      };
    }));
  };

  const snoozeReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "upcoming" as const, time: "In 1 Hour" } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addScreeningResult = (result: Omit<ScreeningResult, "id" | "completedAt"> & { id?: string; completedAt?: string }) => {
    const newRecord: ScreeningResult = {
      ...result,
      id: result.id || `scr-${Date.now()}`,
      completedAt: result.completedAt || new Date().toISOString(),
    };
    setScreeningHistory(prev => [newRecord, ...prev]);
  };

  const clearScreeningHistory = () => {
    setScreeningHistory([]);
  };

  const addMoodLog = (log: Omit<MoodLog, "id">) => {
    const newLog: MoodLog = { ...log, id: Math.random().toString(36).substring(2, 9) };
    setProfileState(prev => {
      const updatedLogs = [...(prev.moodLogs || []), newLog];
      return { ...prev, moodLogs: updatedLogs };
    });
  };

  const addVitalsLog = (log: Omit<VitalsLog, "id"> & { id?: string }) => {
    const newLog: VitalsLog = {
      ...log,
      id: log.id || `v_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: log.timestamp || new Date().toISOString()
    };
    setVitalsLogs(prev => [newLog, ...prev]);
  };

  const deleteVitalsLog = (id: string) => {
    setVitalsLogs(prev => prev.filter(v => v.id !== id));
  };

  const toggleQuoteFavorite = (quoteId: string) => {
    setProfileState(prev => {
      const current = prev.savedQuotes || [];
      const isSaved = current.includes(quoteId);
      const updated = isSaved ? current.filter(id => id !== quoteId) : [...current, quoteId];
      return { ...prev, savedQuotes: updated };
    });
  };

  const addJournalEntry = (entry: Omit<JournalEntry, "id">) => {
    const newEntry: JournalEntry = { ...entry, id: Math.random().toString(36).substring(2, 9) };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  const joinGroup = (id: string) => {
    setJoinedGroups(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const leaveGroup = (id: string) => {
    setJoinedGroups(prev => prev.filter(gId => gId !== id));
  };

  const createGroup = (groupData: Omit<CommunityGroup, "id" | "members" | "onlineCount">) => {
    const newGroup: CommunityGroup = {
      ...groupData,
      id: `g_${Math.random().toString(36).substring(2, 9)}`,
      members: 1,
      onlineCount: 1
    };
    setGroups(prev => [newGroup, ...prev]);
    setJoinedGroups(prev => [...prev, newGroup.id]);
    
    try {
      const custom = secureStorage.getItem<CommunityGroup[]>("medscope-custom-groups") || [];
      secureStorage.setItem("medscope-custom-groups", [newGroup, ...custom]);
    } catch {
      // fallback
    }
  };

  /* =========================================================================
     ECOSYSTEM REAL-TIME SYNCHRONIZATION STATE & MUTATOR IMPLEMENTATION
     ========================================================================= */
  const [syncedMedications, setSyncedMedications] = useState<
    { id: string; name: string; dosage: string; frequency: string; duration: string; mealTiming: string; instructions: string }[]
  >([
    {
      id: "rx-1",
      name: "Clopidogrel Bisulfate",
      dosage: "75 mg",
      frequency: "Once Daily",
      duration: "12 Months",
      mealTiming: "After Meal",
      instructions: "Take daily post-morning meal to prevent stent thrombosis.",
    },
    {
      id: "rx-2",
      name: "Atorvastatin Calcium",
      dosage: "80 mg",
      frequency: "Once Daily",
      duration: "Ongoing",
      mealTiming: "At Bedtime",
      instructions: "High-intensity statin for plaque stabilization.",
    },
  ]);

  const [syncedRecords, setSyncedRecords] = useState<
    { id: string; title: string; type: string; category: string; date: string; summary: string }[]
  >([
    {
      id: "rec-1",
      title: "Troponin T Cardiac Biomarker Panel",
      type: "Laboratory PDF",
      category: "Cardiology",
      date: "July 26, 2026",
      summary: "Troponin T elevated at 0.14 ng/mL.",
    },
    {
      id: "rec-2",
      title: "12-Lead Electrocardiogram (ECG)",
      type: "Telemetry Trace",
      category: "Cardiology",
      date: "July 26, 2026",
      summary: "ST elevation in anterolateral leads V2-V4.",
    },
  ]);

  const [syncedLifestylePlan, setSyncedLifestylePlan] = useState<string[]>([
    "Sodium restriction < 2,000 mg/day (less than 1 tsp salt).",
    "Restricted strenuous activity pending Cath Lab evaluation.",
    "Monitor daily weight and report > 2lb sudden gain.",
  ]);

  const addDoctorPrescription = (item: { name: string; dosage: string; frequency: string; duration: string; mealTiming: string; instructions: string }) => {
    const newRx = { id: `rx-${Date.now()}`, ...item };
    setSyncedMedications((prev) => [newRx, ...prev]);

    // Automatically generate patient medicine reminder
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: `${item.name} ${item.dosage}`,
      time: "08:00 AM",
      type: "Medicines",
      status: "upcoming",
      repeat: item.frequency,
      iconName: "Pill",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const addDoctorRecord = (record: { title: string; type: string; category: string; date: string; summary: string }) => {
    const newRec = { id: `rec-${Date.now()}`, ...record };
    setSyncedRecords((prev) => [newRec, ...prev]);
  };

  const updateDoctorLifestylePlan = (recs: string[]) => {
    setSyncedLifestylePlan(recs);
  };

  return (
    <PatientContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        widgetOrder,
        setWidgetOrder,
        reminders,
        addReminder,
        editReminder,
        markReminderDone,
        markReminderMissed,
        snoozeReminder,
        deleteReminder,
        addMoodLog,
        vitalsLogs,
        addVitalsLog,
        deleteVitalsLog,
        toggleQuoteFavorite,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        screeningHistory,
        addScreeningResult,
        clearScreeningHistory,
        joinedGroups,
        joinGroup,
        leaveGroup,
        groups,
        createGroup,
        syncedMedications,
        syncedRecords,
        syncedLifestylePlan,
        addDoctorPrescription,
        addDoctorRecord,
        updateDoctorLifestylePlan,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
