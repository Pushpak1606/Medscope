import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { secureStorage } from "@/lib/secureStorage";
import { toast } from "sonner";

export interface WorkingDaySchedule {
  dayName: string;
  active: boolean;
  startTime: string;
  endTime: string;
  breakSchedule: string;
}

export interface DoctorProfile {
  // Personal Information
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  biography: string;
  languages: string;

  // Professional Credentials (READ-ONLY)
  specialty: string;
  subSpecialty: string;
  qualifications: string;
  registrationNumber: string;
  licenseNumber: string;
  verificationStatus: "Verified Clinician" | "Pending Verification";
  experienceYears: string;

  // Practice Information
  hospital: string;
  department: string;
  clinicAddress: string;
  consultationMode: string;
  consultationFee: string;
  emergencyAvailable: boolean;

  // Availability & Shift Schedule
  availabilityStatus: "Online" | "Consulting" | "Break" | "Offline";
  workingHours: WorkingDaySchedule[];

  // Preferences
  theme: "dark" | "light" | "system";
  language: string;
  notifications: {
    emergencyAlerts: boolean;
    appointments: boolean;
    labReports: boolean;
    aiSuggestions: boolean;
    patientMessages: boolean;
    communityActivity: boolean;
  };
}

const DEFAULT_DOCTOR_PROFILE: DoctorProfile = {
  fullName: "Dr. Sarah Jenkins, MD",
  avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Dr.%20Sarah%20Jenkins",
  email: "sarah.jenkins@medscope.health",
  phone: "+1 (555) 984-2091",
  gender: "Female",
  dob: "1982-04-14",
  biography:
    "Senior Attending Cardiologist specializing in subacute coronary syndromes, post-PCI rehabilitation, and lipid lowering statin protocols with 14+ years of clinical practice.",
  languages: "English, Spanish, French",

  specialty: "Cardiology & Internal Medicine",
  subSpecialty: "Interventional Cardiology & Coronary Angiography",
  qualifications: "MD • FACC • FSCAI",
  registrationNumber: "NPI #19842091",
  licenseNumber: "MD-98421",
  verificationStatus: "Verified Clinician",
  experienceYears: "14+ Years Experience",

  hospital: "St. Jude Medical Center",
  department: "Department of Cardiology • Cath Lab 2",
  clinicAddress: "742 Evergreen Terrace, Medical Wing 3B, New York, NY 10021",
  consultationMode: "Video & In-Person Clinic",
  consultationFee: "150",
  emergencyAvailable: true,

  availabilityStatus: "Consulting",
  workingHours: [
    { dayName: "Monday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
    { dayName: "Tuesday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
    { dayName: "Wednesday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
    { dayName: "Thursday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
    { dayName: "Friday", active: true, startTime: "08:00 AM", endTime: "04:00 PM", breakSchedule: "12:30 PM - 01:30 PM (Lunch)" },
    { dayName: "Saturday", active: true, startTime: "09:00 AM", endTime: "01:00 PM", breakSchedule: "No Break" },
    { dayName: "Sunday", active: false, startTime: "Closed", endTime: "Closed", breakSchedule: "Off Day" },
  ],

  theme: "dark",
  language: "English (US)",
  notifications: {
    emergencyAlerts: true,
    appointments: true,
    labReports: true,
    aiSuggestions: true,
    patientMessages: true,
    communityActivity: true,
  },
};

interface DoctorContextType {
  doctorProfile: DoctorProfile;
  setDoctorProfile: (profile: DoctorProfile) => void;
  updateDoctorProfile: (partial: Partial<DoctorProfile>) => void;
  setAvailabilityStatus: (status: DoctorProfile["availabilityStatus"]) => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

const STORAGE_KEY = "medscope-doctor-profile";

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const [doctorProfile, setDoctorProfileState] = useState<DoctorProfile>(() => {
    try {
      const stored = secureStorage.getItem<DoctorProfile>(STORAGE_KEY);
      if (stored && stored.fullName) {
        return { ...DEFAULT_DOCTOR_PROFILE, ...stored };
      }
    } catch {
      // fallback
    }
    return DEFAULT_DOCTOR_PROFILE;
  });

  const setDoctorProfile = (newProfile: DoctorProfile) => {
    setDoctorProfileState(newProfile);
    try {
      secureStorage.setItem(STORAGE_KEY, newProfile);
    } catch {
      // fallback
    }
  };

  const updateDoctorProfile = (partial: Partial<DoctorProfile>) => {
    setDoctorProfileState((prev) => {
      const updated = { ...prev, ...partial };
      try {
        secureStorage.setItem(STORAGE_KEY, updated);
      } catch {
        // fallback
      }
      return updated;
    });
  };

  const setAvailabilityStatus = (status: DoctorProfile["availabilityStatus"]) => {
    updateDoctorProfile({ availabilityStatus: status });
    toast.success(`Availability status updated to ${status}`);
  };

  return (
    <DoctorContext.Provider
      value={{
        doctorProfile,
        setDoctorProfile,
        updateDoctorProfile,
        setAvailabilityStatus,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};

export default DoctorContext;
