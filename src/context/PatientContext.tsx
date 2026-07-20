import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { secureStorage } from "@/lib/secureStorage";
import { CommunityGroup, MOCK_GROUPS } from "@/lib/communityMockData";

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

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
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
  addMoodLog: (log: Omit<MoodLog, "id">) => void;
  toggleQuoteFavorite: (quoteId: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
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

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = secureStorage.getItem<JournalEntry[]>("medscope-journal");
      if (stored && stored.length > 0) return stored;
      return [
        { id: "j1", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), title: "Morning Reflections", content: "Felt well-rested today after a 30-minute evening walk. Hydration was good.", mood: "Good", tags: ["Reflection", "Sleep"] },
        { id: "j2", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), title: "Managing Work Stress", content: "Practiced 4-7-8 breathing during afternoon meetings. Helped keep calm.", mood: "Great", tags: ["Mindfulness", "Stress"] },
      ];
    } catch {
      return [];
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

  // Persistence
  useEffect(() => {
    secureStorage.setItem(PROFILE_KEY, profile);
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
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: "upcoming" as const, time: "In 1 Hour" } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addMoodLog = (log: Omit<MoodLog, "id">) => {
    const newLog: MoodLog = { ...log, id: Math.random().toString(36).substring(2, 9) };
    setProfileState(prev => {
      const updatedLogs = [...(prev.moodLogs || []), newLog];
      return { ...prev, moodLogs: updatedLogs };
    });
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
        snoozeReminder,
        deleteReminder,
        addMoodLog,
        toggleQuoteFavorite,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        joinedGroups,
        joinGroup,
        leaveGroup,
        groups,
        createGroup
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
