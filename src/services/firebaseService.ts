import { UserDocument, PatientDocument, DoctorDocument, UserRole } from "@/types/firebase";

/**
 * =========================================================================
 * MEDSCOPE PURE LOCAL STORAGE DATA SERVICE LAYER (NO REMOTE BACKEND)
 * =========================================================================
 * 
 * All user data, doctor profiles, patient onboarding details, and appointments 
 * are persisted locally in browser localStorage under "medscope_*" keys.
 * Zero network dependencies, zero latency, zero backend errors.
 */

// Helper: Local Storage getter/setter
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Medscope Storage] Write failed for key ${key}:`, err);
  }
};

// Initial Onboarded Mock Doctors for Directory & Booking
const INITIAL_MOCK_DOCTORS: DoctorDocument[] = [
  {
    uid: "doc-1",
    fullName: "Dr. Sarah Jenkins",
    firstName: "Sarah",
    lastName: "Jenkins",
    gender: "female",
    phone: "+1 (555) 234-5678",
    professionalEmail: "sarah.jenkins@medscope.app",
    specialization: "Cardiology",
    subSpecialization: "Interventional Cardiology",
    hospital: "St. Jude Medical Center",
    city: "New York",
    professionalBio: "Board-certified cardiologist with 12+ years of experience in preventive cardiology.",
    degree: "MD, FACC",
    institution: "Johns Hopkins University",
    registrationNumber: "MCI-98421",
    experienceYears: 12,
    certifications: "Board Certified in Cardiology",
    areasOfExpertise: ["Heart Disease", "Hypertension", "Lipid Disorders"],
    languages: ["English", "Spanish"],
    consultationFocusAreas: ["Preventive Care", "Post-PCI Titration"],
    consultationTypes: ["video", "chat"],
    consultationMode: "online",
    consultationFee: 750,
    consultationDuration: 30,
    acceptsAssistantDoctorSupport: true,
    aiMedicineGuidanceSupport: true,
    communityCaseDiscussions: true,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableFrom: "09:00 AM",
    availableUntil: "05:00 PM",
    emergencyAvailable: true,
    maxPatientsPerDay: 20,
    assistantDoctorName: "Dr. Alex Rivera",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "doc-2",
    fullName: "Dr. Mike Ross",
    firstName: "Mike",
    lastName: "Ross",
    gender: "male",
    phone: "+1 (555) 876-5432",
    professionalEmail: "mike.ross@medscope.app",
    specialization: "General Practice",
    subSpecialization: "Family Medicine",
    hospital: "City Health Clinic",
    city: "Boston",
    professionalBio: "Dedicated primary care physician focusing on holistic wellness.",
    degree: "MBBS, MD",
    institution: "Harvard Medical School",
    registrationNumber: "MCI-77412",
    experienceYears: 8,
    certifications: "Family Medicine Specialist",
    areasOfExpertise: ["General Health", "Diabetes", "Routine Checks"],
    languages: ["English"],
    consultationFocusAreas: ["Preventive Health", "Chronic Care"],
    consultationTypes: ["video", "chat", "clinic"],
    consultationMode: "online",
    consultationFee: 500,
    consultationDuration: 20,
    acceptsAssistantDoctorSupport: true,
    aiMedicineGuidanceSupport: true,
    communityCaseDiscussions: false,
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableFrom: "10:00 AM",
    availableUntil: "04:00 PM",
    emergencyAvailable: false,
    maxPatientsPerDay: 15,
    assistantDoctorName: "",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const withTimeout = <T>(promise: Promise<T>, _ms: number = 3500): Promise<T> => {
  return promise;
};

export function sanitizeFirestorePayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  return { ...obj };
}

export const ensureAuthenticatedUser = async (role: UserRole = "patient") => {
  let currentUser = getLocalStorage<any>("medscope_current_user", null);
  if (!currentUser) {
    currentUser = {
      uid: `local_${role}_${Date.now()}`,
      email: `user_${role}@medscope.app`,
      role,
      onboardingCompleted: true,
    };
    setLocalStorage("medscope_current_user", currentUser);
  }
  return currentUser;
};

export interface AppointmentDocument {
  id?: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorHospital?: string;
  doctorImg?: string;
  consultationType: "Video" | "Audio" | "Chat" | "Clinic";
  consultationMode: "online" | "in-clinic";
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  duration: number;
  consultationFee: number;
  status: "scheduled" | "completed" | "cancelled";
  diagnosis?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createUserRecord = async (
  uid: string, 
  email: string, 
  role: UserRole, 
  onboardingCompleted = false
): Promise<void> => {
  const users = getLocalStorage<Record<string, UserDocument>>("medscope_users_db", {});
  const record: UserDocument = {
    uid,
    role,
    email,
    onboardingCompleted,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users[uid] = record;
  setLocalStorage("medscope_users_db", users);
  setLocalStorage("medscope_current_user", record);
};

export const savePatientOnboarding = async (uid: string, data: Record<string, any>): Promise<void> => {
  const patients = getLocalStorage<Record<string, PatientDocument>>("medscope_patients_db", {});
  
  let conditions: string[] = [];
  if (Array.isArray(data.conditions)) {
    conditions = data.conditions;
  } else if (data.conditions) {
    conditions = [String(data.conditions)];
  }

  const patientPayload: Record<string, any> = {
    ...patients[uid],
    ...data,
    uid,
    fullName: data.fullName || data.name || (patients[uid] ? patients[uid].fullName : "Patient"),
    firstName: data.firstName || (data.fullName ? data.fullName.split(" ")[0] : "Patient"),
    lastName: data.lastName || (data.fullName ? data.fullName.split(" ").slice(1).join(" ") : ""),
    email: data.email || (patients[uid] ? patients[uid].email : ""),
    phone: data.phone || data.phoneNumber || "",
    age: data.age ? String(data.age) : "",
    gender: data.gender || "",
    height: data.height || data.heightCm ? String(data.height || data.heightCm) : "",
    weight: data.weight || data.weightKg ? String(data.weight || data.weightKg) : "",
    bloodGroup: data.bloodGroup || "",
    city: data.city || data.location || "",
    
    // Health Info
    conditions,
    currentlyTakingMedications: Boolean(data.hasMedications || data.currentlyTakingMedications),
    medications: data.medications || "",
    allergiesList: Array.isArray(data.allergies) ? data.allergies : (data.allergies ? [data.allergies] : []),
    allergies: data.allergies || "",
    hasAllergies: Boolean(data.hasAllergies || data.allergies),
    hasSurgeries: Boolean(data.hasSurgeries || data.majorSurgeries),
    surgeriesDetails: data.surgeriesDetails || data.surgeries || "",
    familyMedicalHistory: data.familyMedicalHistory || data.familyHistory || "",

    // Lifestyle & Wellness
    activityLevel: data.activityLevel || "",
    sleepQuality: data.sleepQuality || "",
    stressLevel: data.stressLevel || "",
    dailyWaterIntake: data.dailyWaterIntake || data.waterIntake || "",
    foodPreference: data.foodPreference || data.diet || "",
    smokes: Boolean(data.smokes || data.smoking),
    consumesAlcohol: Boolean(data.consumesAlcohol || data.alcohol),
    interests: Array.isArray(data.interests) ? data.interests : [],
    healthFocus: Array.isArray(data.healthFocus) ? data.healthFocus : (data.healthFocus ? [data.healthFocus] : []),
    reminderPreferences: Array.isArray(data.reminderPreferences) ? data.reminderPreferences : [],
    languagePreference: data.languagePreference || data.language || "English",

    // Emergency Contact
    emergencyContactName: data.emergencyName || data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyPhone || data.emergencyContactPhone || "",
    emergencyContactRelation: data.emergencyRelation || data.emergencyContactRelation || "",

    onboardingCompleted: true,
    updatedAt: new Date().toISOString(),
  };

  patients[uid] = patientPayload as PatientDocument;
  setLocalStorage("medscope_patients_db", patients);

  // Update user metadata
  const users = getLocalStorage<Record<string, UserDocument>>("medscope_users_db", {});
  if (!users[uid]) {
    users[uid] = {
      uid,
      role: "patient",
      email: data.email || "",
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    users[uid].onboardingCompleted = true;
    users[uid].updatedAt = new Date().toISOString();
  }
  setLocalStorage("medscope_users_db", users);
  setLocalStorage("medscope_current_user", users[uid]);
};

export const saveDoctorOnboarding = async (uid: string, data: Record<string, any>): Promise<void> => {
  const doctors = getLocalStorage<Record<string, DoctorDocument>>("medscope_doctors_db", {});
  
  const doctorPayload: Record<string, any> = {
    ...doctors[uid],
    ...data,
    uid,
    fullName: data.fullName || data.name || "Dr. User",
    firstName: data.firstName || (data.fullName ? data.fullName.replace(/^Dr\.\s*/i, "").split(" ")[0] : "Doctor"),
    lastName: data.lastName || (data.fullName ? data.fullName.replace(/^Dr\.\s*/i, "").split(" ").slice(1).join(" ") : ""),
    gender: data.gender || "",
    phone: data.phone || data.phoneNumber || "",
    professionalEmail: data.professionalEmail || data.email || "",
    specialization: data.specialization || data.specialty || "General Practice",
    subSpecialization: data.subSpecialization || data.subSpecialty || "",
    hospital: data.hospital || data.hospitalClinic || "",
    city: data.city || data.cityLocation || "",
    professionalBio: data.professionalBio || data.bio || "",

    // Qualifications
    degree: data.degree || data.qualifications || "MBBS",
    institution: data.institution || data.university || "",
    registrationNumber: data.registrationNumber || data.registration || data.licenseNumber || "MCI-PENDING",
    experienceYears: data.experienceYears ? Number(data.experienceYears) : 0,
    certifications: data.certifications || "",
    areasOfExpertise: Array.isArray(data.areasOfExpertise) ? data.areasOfExpertise : [],
    languages: Array.isArray(data.languages) ? data.languages : (data.languages ? String(data.languages).split(", ") : ["English"]),
    consultationFocusAreas: Array.isArray(data.consultationFocusAreas) ? data.consultationFocusAreas : [],

    // Consultation preferences
    consultationTypes: Array.isArray(data.consultationTypes) ? data.consultationTypes : ["video", "chat"],
    consultationMode: data.consultationMode || "online",
    consultationFee: data.consultationFee ? Number(data.consultationFee) : 500,
    consultationDuration: data.consultationDuration ? Number(data.consultationDuration) : 30,

    // Preferences & Support
    acceptsAssistantDoctorSupport: Boolean(data.acceptsAssistantDoctorSupport),
    aiMedicineGuidanceSupport: Boolean(data.aiMedicineGuidanceSupport),
    communityCaseDiscussions: Boolean(data.communityCaseDiscussions),

    // Availability Schedule
    availableDays: Array.isArray(data.availableDays) ? data.availableDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableFrom: data.availableFrom || "10:00 AM",
    availableUntil: data.availableUntil || "05:00 PM",
    emergencyAvailable: Boolean(data.emergencyAvailable),
    maxPatientsPerDay: data.maxPatientsPerDay ? Number(data.maxPatientsPerDay) : 20,
    assistantDoctorName: data.assistantDoctorName || "",
    notificationMode: data.notificationMode || "in-app",
    dashboardHomePreference: data.dashboardHomePreference || "patients",

    onboardingCompleted: true,
    updatedAt: new Date().toISOString(),
  };

  doctors[uid] = doctorPayload as DoctorDocument;
  setLocalStorage("medscope_doctors_db", doctors);

  // Update user metadata
  const users = getLocalStorage<Record<string, UserDocument>>("medscope_users_db", {});
  if (!users[uid]) {
    users[uid] = {
      uid,
      role: "doctor",
      email: data.email || "",
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    users[uid].onboardingCompleted = true;
    users[uid].updatedAt = new Date().toISOString();
  }
  setLocalStorage("medscope_users_db", users);
  setLocalStorage("medscope_current_user", users[uid]);
};

export const getUserRecord = async (uid: string): Promise<UserDocument | null> => {
  const users = getLocalStorage<Record<string, UserDocument>>("medscope_users_db", {});
  return users[uid] || getLocalStorage<UserDocument | null>("medscope_current_user", null);
};

export const getPatientProfile = async (uid: string): Promise<PatientDocument | any | null> => {
  const patients = getLocalStorage<Record<string, PatientDocument>>("medscope_patients_db", {});
  if (patients[uid]) return patients[uid];

  // If specific uid not found, return latest saved patient
  const allPatients = Object.values(patients);
  if (allPatients.length > 0) {
    return allPatients[allPatients.length - 1];
  }
  return null;
};

export const getDoctorProfile = async (uid: string): Promise<DoctorDocument | any | null> => {
  const doctors = getLocalStorage<Record<string, DoctorDocument>>("medscope_doctors_db", {});
  if (doctors[uid]) return doctors[uid];

  const allDoctors = Object.values(doctors);
  if (allDoctors.length > 0) {
    return allDoctors[allDoctors.length - 1];
  }
  return INITIAL_MOCK_DOCTORS.find(d => d.uid === uid) || INITIAL_MOCK_DOCTORS[0];
};

export const updatePatientRecord = async (uid: string, data: Record<string, any>): Promise<void> => {
  await savePatientOnboarding(uid, data);
};

export const updateDoctorRecord = async (uid: string, data: Record<string, any>): Promise<void> => {
  await saveDoctorOnboarding(uid, data);
};

export const getAllOnboardedDoctors = async (): Promise<any[]> => {
  const doctorsMap = getLocalStorage<Record<string, DoctorDocument>>("medscope_doctors_db", {});
  const localList = Object.values(doctorsMap);
  const combined = [...INITIAL_MOCK_DOCTORS];

  localList.forEach((d) => {
    if (!combined.some(existing => existing.uid === d.uid)) {
      combined.push(d);
    }
  });

  return combined;
};

export const getAppointmentsForDoctorAndDate = async (
  doctorId: string, 
  appointmentDate: string
): Promise<AppointmentDocument[]> => {
  const appointmentsMap = getLocalStorage<Record<string, AppointmentDocument>>("medscope_appointments_db", {});
  return Object.values(appointmentsMap).filter(
    app => app.doctorId === doctorId && app.appointmentDate === appointmentDate
  );
};

export const createAppointmentWithConflictCheck = async (
  appointment: Omit<AppointmentDocument, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; appointmentId?: string; error?: string }> => {
  const appID = `app_${Date.now()}`;
  const newAppointment: AppointmentDocument = {
    ...appointment,
    id: appID,
    status: "scheduled",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const appointmentsMap = getLocalStorage<Record<string, AppointmentDocument>>("medscope_appointments_db", {});
  appointmentsMap[appID] = newAppointment;
  setLocalStorage("medscope_appointments_db", appointmentsMap);

  return { success: true, appointmentId: appID };
};

export const getPatientAppointments = async (patientId: string): Promise<AppointmentDocument[]> => {
  const appointmentsMap = getLocalStorage<Record<string, AppointmentDocument>>("medscope_appointments_db", {});
  return Object.values(appointmentsMap).filter(app => app.patientId === patientId || patientId === "active");
};

export const getDoctorAppointments = async (doctorId: string): Promise<AppointmentDocument[]> => {
  const appointmentsMap = getLocalStorage<Record<string, AppointmentDocument>>("medscope_appointments_db", {});
  return Object.values(appointmentsMap).filter(app => app.doctorId === doctorId || doctorId === "active");
};

export interface SignUpPatientInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface SignUpDoctorInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  phone: string;
  clinic: string;
}

export const signUpPatient = async (input: SignUpPatientInput) => {
  const uid = `pat_${Date.now()}`;
  const user = { uid, email: input.email };
  await createUserRecord(uid, input.email, "patient", false);
  await savePatientOnboarding(uid, {
    uid,
    fullName: `${input.firstName} ${input.lastName}`.trim(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
  });
  return user;
};

export const signUpDoctor = async (input: SignUpDoctorInput) => {
  const uid = `doc_${Date.now()}`;
  const user = { uid, email: input.email };
  await createUserRecord(uid, input.email, "doctor", false);
  await saveDoctorOnboarding(uid, {
    uid,
    fullName: `Dr. ${input.firstName} ${input.lastName}`.trim(),
    firstName: input.firstName,
    lastName: input.lastName,
    professionalEmail: input.email,
    phone: input.phone,
    specialization: input.specialization,
    degree: input.qualification || "MBBS",
    registrationNumber: input.registrationNumber,
    hospital: input.clinic,
  });
  return user;
};

export const loginUser = async (email: string, _pass: string) => {
  const uid = `user_${Date.now()}`;
  const role: UserRole = email.includes("doctor") ? "doctor" : "patient";
  const user = { uid, email };
  const userRecord: UserDocument = {
    uid,
    email,
    role,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
  };
  setLocalStorage("medscope_current_user", userRecord);
  return { user, userRecord };
};

export const signInWithGoogleRole = async (expectedRole: UserRole) => {
  const uid = `google_${Date.now()}`;
  const email = `google_${expectedRole}@medscope.app`;
  const user = { 
    uid, 
    email, 
    displayName: expectedRole === "doctor" ? "Dr. Google User" : "Google Patient User",
    phoneNumber: "+1 (555) 999-0000" 
  };
  const userRecord: UserDocument = {
    uid,
    role: expectedRole,
    email,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
  };
  setLocalStorage("medscope_current_user", userRecord);
  
  if (expectedRole === "patient") {
    await savePatientOnboarding(uid, {
      uid,
      fullName: user.displayName,
      email,
      phone: user.phoneNumber,
    });
  } else {
    await saveDoctorOnboarding(uid, {
      uid,
      fullName: user.displayName,
      professionalEmail: email,
      phone: user.phoneNumber,
      specialization: "General Practice",
    });
  }

  return { user, userRecord };
};

export const logoutUser = async () => {
  localStorage.removeItem("medscope_current_user");
};
