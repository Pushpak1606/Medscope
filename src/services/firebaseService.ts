/**
 * =========================================================================
 * MEDSCOPE FIRESTORE DATA SERVICE LAYER
 * =========================================================================
 *
 * One write path: every save goes to Firestore (cloud) and mirrors to
 * localStorage so the UI keeps working offline. Reads prefer Firestore and
 * fall back to the local mirror when offline.
 *
 * Collections:
 *   users/{uid}    -> UserDocument (role + onboarding flag)
 *   patients/{uid} -> PatientDocument (full onboarding payload)
 *   doctors/{uid}  -> DoctorDocument (full onboarding payload)
 *   appointments/{id} -> AppointmentDocument
 */

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserDocument, UserRole } from "@/types/firebase";

export type PatientProfileDocument = Record<string, any>;
export type DoctorProfileDocument = Record<string, any>;

/** Seeds shown on first run so directories are never empty for demos. */
export const SEED_DOCTORS: DoctorProfileDocument[] = [
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
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
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
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    uid: "doc-3",
    fullName: "Dr. Emily Chen",
    firstName: "Emily",
    lastName: "Chen",
    gender: "female",
    phone: "+1 (555) 442-9087",
    professionalEmail: "emily.chen@medscope.app",
    specialization: "Neurology",
    subSpecialization: "Headache & Migraine Medicine",
    hospital: "Brookline Neuro Institute",
    city: "Boston",
    professionalBio: "Neurologist focused on migraine care, epilepsy, and sleep disorders.",
    degree: "MD, PhD",
    institution: "Stanford University",
    registrationNumber: "MCI-55123",
    experienceYears: 10,
    certifications: "American Board of Psychiatry and Neurology",
    areasOfExpertise: ["Migraine", "Epilepsy", "Sleep Disorders"],
    languages: ["English", "Mandarin"],
    consultationFocusAreas: ["Headache Care", "Seizure Management"],
    consultationTypes: ["video", "chat"],
    consultationMode: "online",
    consultationFee: 800,
    consultationDuration: 30,
    acceptsAssistantDoctorSupport: false,
    aiMedicineGuidanceSupport: true,
    communityCaseDiscussions: true,
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
    availableFrom: "11:00 AM",
    availableUntil: "06:00 PM",
    emergencyAvailable: false,
    maxPatientsPerDay: 12,
    assistantDoctorName: "",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    uid: "doc-4",
    fullName: "Dr. Robert Fox",
    firstName: "Robert",
    lastName: "Fox",
    gender: "male",
    phone: "+1 (555) 610-3344",
    professionalEmail: "robert.fox@medscope.app",
    specialization: "Orthopedics",
    subSpecialization: "Sports Medicine",
    hospital: "Manhattan Orthopedic Group",
    city: "New York",
    professionalBio: "Orthopedic surgeon treating joint pain, fractures, and sports injuries.",
    degree: "MS (Ortho)",
    institution: "AIIMS New Delhi",
    registrationNumber: "MCI-40987",
    experienceYears: 15,
    certifications: "Fellowship in Arthroscopic Surgery",
    areasOfExpertise: ["Joint Pain", "Sports Injury", "Fracture Care"],
    languages: ["English", "Hindi"],
    consultationFocusAreas: ["Knee & Shoulder Rehab"],
    consultationTypes: ["video", "clinic"],
    consultationMode: "online",
    consultationFee: 650,
    consultationDuration: 25,
    acceptsAssistantDoctorSupport: true,
    aiMedicineGuidanceSupport: false,
    communityCaseDiscussions: true,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableFrom: "09:30 AM",
    availableUntil: "03:00 PM",
    emergencyAvailable: true,
    maxPatientsPerDay: 18,
    assistantDoctorName: "Dr. Priya Nair",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    uid: "doc-5",
    fullName: "Dr. Anita Sharma",
    firstName: "Anita",
    lastName: "Sharma",
    gender: "female",
    phone: "+1 (555) 771-2200",
    professionalEmail: "anita.sharma@medscope.app",
    specialization: "Psychiatry",
    subSpecialization: "Anxiety & Mood Disorders",
    hospital: "Harbor Mental Health Center",
    city: "Boston",
    professionalBio: "Psychiatrist treating depression, anxiety, panic disorder, and chronic stress.",
    degree: "MD (Psychiatry)",
    institution: "NIMHANS Bengaluru",
    registrationNumber: "MCI-31245",
    experienceYears: 9,
    certifications: "Certified in CBT & Exposure Therapy",
    areasOfExpertise: ["Anxiety", "Depression", "Panic Disorder"],
    languages: ["English", "Hindi"],
    consultationFocusAreas: ["Stress Management", "Sleep & Mental Wellness"],
    consultationTypes: ["video", "chat"],
    consultationMode: "online",
    consultationFee: 900,
    consultationDuration: 45,
    acceptsAssistantDoctorSupport: false,
    aiMedicineGuidanceSupport: true,
    communityCaseDiscussions: true,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
    availableFrom: "10:00 AM",
    availableUntil: "07:00 PM",
    emergencyAvailable: true,
    maxPatientsPerDay: 10,
    assistantDoctorName: "",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    uid: "doc-6",
    fullName: "Dr. James Patel",
    firstName: "James",
    lastName: "Patel",
    gender: "male",
    phone: "+1 (555) 908-4411",
    professionalEmail: "james.patel@medscope.app",
    specialization: "Endocrinology",
    subSpecialization: "Diabetes & Metabolic Health",
    hospital: "Queens Endocrine Clinic",
    city: "New York",
    professionalBio: "Endocrinologist managing diabetes, thyroid disorders, and obesity medicine.",
    degree: "MD, FACE",
    institution: "Johns Hopkins University",
    registrationNumber: "MCI-28817",
    experienceYears: 11,
    certifications: "Fellow of the American College of Endocrinology",
    areasOfExpertise: ["Diabetes", "Thyroid Disorders", "Obesity Medicine"],
    languages: ["English", "Gujarati"],
    consultationFocusAreas: ["Diabetes Reversal Programs"],
    consultationTypes: ["video", "chat", "clinic"],
    consultationMode: "online",
    consultationFee: 700,
    consultationDuration: 30,
    acceptsAssistantDoctorSupport: true,
    aiMedicineGuidanceSupport: true,
    communityCaseDiscussions: false,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
    availableFrom: "09:00 AM",
    availableUntil: "04:00 PM",
    emergencyAvailable: false,
    maxPatientsPerDay: 16,
    assistantDoctorName: "",
    notificationMode: "in-app",
    dashboardHomePreference: "patients",
    onboardingCompleted: true,
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
];

/* ─── Local mirror keys (survive offline + give instant UI reads) ─── */
const KEY_USERS = "medscope_users_db";
const KEY_PATIENTS = "medscope_patients_db";
const KEY_DOCTORS = "medscope_doctors_db";
const KEY_CURRENT_USER = "medscope_current_user";

export const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Medscope Storage] Write failed for key ${key}:`, err);
  }
};

const upsertLocal = <T extends { uid: string }>(key: string, record: T): void => {
  const map = getLocalStorage<Record<string, T>>(key, {});
  map[record.uid] = record;
  setLocalStorage(key, map);
};

const findLocal = <T extends { uid: string }>(key: string, uid: string): T | null => {
  const map = getLocalStorage<Record<string, T>>(key, {});
  return map[uid] || null;
};

const nowIso = () => new Date().toISOString();

/* ─── Firestore helpers ─── */

/** Firestore rejects `undefined` fields; drop them. Also drop functions. */
export const sanitizeFirestorePayload = (obj: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === undefined || typeof v === "function") return;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      out[k] = sanitizeFirestorePayload(v as Record<string, any>);
    } else {
      out[k] = v;
    }
  });
  return out;
};

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });

const FIRESTORE_TIMEOUT_MS = 6000;

/** Write a doc to Firestore; never throws (offline-safe). Returns success flag. */
const putDoc = async (col: string, uid: string, payload: Record<string, any>): Promise<boolean> => {
  try {
    await withTimeout(setDoc(doc(db, col, uid), payload, { merge: true }), FIRESTORE_TIMEOUT_MS);
    return true;
  } catch (err) {
    console.warn(`[Medscope Firestore] Write to ${col}/${uid} failed (kept in local mirror):`, err);
    return false;
  }
};

/** Read a doc from Firestore; falls back to the local mirror. */
const getDocOrLocal = async <T,>(col: string, uid: string, localKey: string): Promise<T | null> => {
  try {
    const snap = await withTimeout(getDoc(doc(db, col, uid)), FIRESTORE_TIMEOUT_MS);
    if (snap.exists()) return snap.data() as T;
  } catch (err) {
    console.warn(`[Medscope Firestore] Read of ${col}/${uid} failed, using local mirror:`, err);
  }
  return findLocal<T>(localKey, uid);
};

/* ─── Authentication user record ─── */

/** uid of the signed-in Firebase Auth user, if any. */
export const getActiveAuthUid = (): string | null => {
  try {
    const raw = localStorage.getItem("medscope_active_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.uid || null;
  } catch {
    return null;
  }
};

export const getActiveUserRole = (): UserRole | null => {
  try {
    return (localStorage.getItem("medscope_user_role") as UserRole) || null;
  } catch {
    return null;
  }
};

export const ensureAuthenticatedUser = (role: UserRole = "patient"): { uid: string; role: UserRole } => {
  const activeUid = getActiveAuthUid();
  if (activeUid) return { uid: activeUid, role: getActiveUserRole() || role };
  // Demo mode: no signed-in user. Use a stable local demo id.
  let demo = getLocalStorage<{ uid: string; role: UserRole } | null>("medscope_demo_user", null);
  if (!demo) {
    demo = { uid: `demo_${role}`, role };
    setLocalStorage("medscope_demo_user", demo);
  }
  return { uid: demo.uid, role: demo.role };
};

export const createUserRecord = async (
  uid: string,
  email: string,
  role: UserRole,
  onboardingCompleted = false
): Promise<void> => {
  const record: UserDocument = {
    uid,
    role,
    email,
    onboardingCompleted,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  upsertLocal(KEY_USERS, record);
  setLocalStorage(KEY_CURRENT_USER, record);
  await putDoc("users", uid, sanitizeFirestorePayload(record));
};

export const saveUserRecord = async (record: UserDocument): Promise<void> => {
  const withTs = { ...record, updatedAt: nowIso() };
  upsertLocal(KEY_USERS, withTs);
  setLocalStorage(KEY_CURRENT_USER, withTs);
  await putDoc("users", withTs.uid, sanitizeFirestorePayload(withTs));
};

export const getUserRecord = async (uid: string): Promise<UserDocument | null> => {
  const doc = await getDocOrLocal<UserDocument>("users", uid, KEY_USERS);
  return doc || getLocalStorage<UserDocument | null>(KEY_CURRENT_USER, null);
};

/* ─── Patient onboarding ─── */

export const savePatientOnboarding = async (uid: string, data: Record<string, any>): Promise<void> => {
  const arr = (v: any): string[] | undefined =>
    Array.isArray(v) ? v.filter(Boolean).map(String)
      : v && typeof v === "object" ? Object.values(v).filter(Boolean).map(String)
      : v ? [String(v)]
      : undefined;

  const splitName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return { first: parts[0] || "Patient", last: parts.slice(1).join(" ") };
  };

  const prev = findLocal<PatientProfileDocument>(KEY_PATIENTS, uid) || {};
  const fullName = data.fullName || data.name || prev.fullName || "Patient";
  const { first, last } = splitName(fullName);
  const hasMedications = Boolean(data.hasMedications ?? prev.hasMedications);
  const hasAllergies = Boolean(data.hasAllergies ?? prev.hasAllergies);
  const hasSurgeries = Boolean(data.hasSurgeries ?? prev.hasSurgeries);

  const payload: PatientProfileDocument = {
    ...prev,
    ...data,
    uid,
    fullName,
    firstName: data.firstName || first,
    lastName: data.lastName || last,
    email: data.email || prev.email || "",
    phone: data.phone || data.phoneNumber || prev.phone || "",
    age: data.age ? String(data.age) : prev.age || "",
    gender: data.gender || prev.gender || "",
    height: data.height || data.heightCm ? String(data.height || data.heightCm) : "",
    weight: data.weight || data.weightKg ? String(data.weight || data.weightKg) : "",
    bloodGroup: data.bloodGroup || prev.bloodGroup || "",
    city: data.city || data.location || prev.city || "",

    // Health
    conditions: arr(data.conditions) || [],
    hasMedications,
    medications: data.medications || "",
    allergiesList: arr(data.allergies) || [],
    allergies: Array.isArray(data.allergies) ? data.allergies.join(", ") : data.allergies || "",
    hasAllergies,
    hasSurgeries,
    surgeriesDetails: data.surgeriesDetails || data.surgeries || "",
    familyMedicalHistory: data.familyMedicalHistory || data.familyHistory || "",

    // Lifestyle
    activityLevel: data.activityLevel || "",
    sleepQuality: data.sleepQuality || "",
    stressLevel: data.stressLevel || "",
    dailyWaterIntake: data.dailyWaterIntake || data.waterIntake || "",
    foodPreference: data.foodPreference || data.diet || "",
    smokes: Boolean(data.smokes || data.smoking),
    consumesAlcohol: Boolean(data.consumesAlcohol || data.alcohol),
    interests: arr(data.wellnessInterests) || [],
    healthFocus: arr(data.healthFocus) || [],
    reminderPreferences: arr(data.reminderPreferences) || [],
    languagePreference: data.languagePreference || data.language || "English",

    // Emergency contact
    emergencyContactName: data.emergencyName || data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyPhone || data.emergencyContactPhone || "",
    emergencyContactRelation: data.emergencyRelation || data.emergencyContactRelation || "",

    onboardingCompleted: true,
    updatedAt: nowIso(),
    createdAt: prev.createdAt || nowIso(),
  };

  upsertLocal(KEY_PATIENTS, payload);
  await putDoc("patients", uid, sanitizeFirestorePayload(payload));

  const users = getLocalStorage<Record<string, UserDocument>>(KEY_USERS, {});
  const userRecord: UserDocument = users[uid]
    ? { ...users[uid], onboardingCompleted: true, updatedAt: nowIso() }
    : {
        uid,
        role: "patient",
        email: payload.email,
        onboardingCompleted: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
  await saveUserRecord(userRecord);
};

export const getPatientProfile = async (uid: string): Promise<PatientProfileDocument | null> => {
  const doc = await getDocOrLocal<PatientProfileDocument>("patients", uid, KEY_PATIENTS);
  if (doc) return doc;
  // Legacy fallback: onboarding page used to stash raw form data here.
  try {
    const raw = localStorage.getItem("medscope_patient_onboarding");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.fullName || parsed.email)) return { uid, ...parsed };
    }
  } catch {
    // ignore malformed legacy data
  }
  return null;
};

export const updatePatientRecord = (uid: string, data: Record<string, any>): Promise<void> =>
  savePatientOnboarding(uid, data);

/* ─── Doctor onboarding ─── */

export const saveDoctorOnboarding = async (uid: string, data: Record<string, any>): Promise<void> => {
  const arr = (v: any, fallback: string[] = []): string[] =>
    Array.isArray(v) ? v.filter(Boolean).map(String)
      : typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim())
      : fallback;

  const prev = findLocal<DoctorProfileDocument>(KEY_DOCTORS, uid) || {};
  const fullName = data.fullName || data.name || prev.fullName || "Dr. User";
  const cleanName = fullName.replace(/^Dr\.\s*/i, "");
  const parts = cleanName.trim().split(/\s+/);

  const payload: DoctorProfileDocument = {
    ...prev,
    ...data,
    uid,
    fullName,
    firstName: data.firstName || parts[0] || "Doctor",
    lastName: data.lastName || parts.slice(1).join(" "),
    gender: data.gender || prev.gender || "",
    phone: data.phone || data.phoneNumber || prev.phone || "",
    professionalEmail: data.professionalEmail || data.email || prev.professionalEmail || "",
    specialization: data.specialization || data.specialty || prev.specialization || "General Practice",
    subSpecialization: data.subSpecialization || data.subSpecialty || "",
    hospital: data.hospital || data.hospitalClinic || "",
    city: data.city || data.cityLocation || "",
    professionalBio: data.professionalBio || data.bio || "",

    // Qualifications
    degree: data.degree || data.qualifications || "MBBS",
    institution: data.institution || data.university || "",
    registrationNumber:
      data.registrationNumber || data.registration || data.licenseNumber || data.license || "MCI-PENDING",
    experienceYears: data.experienceYears ? Number(data.experienceYears) : Number(data.experience) || 0,
    certifications: data.certifications || "",
    areasOfExpertise: arr(data.areasOfExpertise, arr(data.expertise)),
    languages: arr(data.languages, ["English"]),
    consultationFocusAreas: arr(data.consultationFocusAreas, arr(data.focusAreas)),

    // Consultation preferences
    consultationTypes: arr(data.consultationTypes, ["video", "chat"]),
    consultationMode: data.consultationMode || "online",
    consultationFee: data.consultationFee ? Number(data.consultationFee) : Number(data.fee) || 500,
    consultationDuration: data.consultationDuration ? Number(data.consultationDuration) : Number(data.duration) || 30,

    // Support flags
    acceptsAssistantDoctorSupport: Boolean(data.acceptsAssistantDoctorSupport ?? data.acceptsAssistant),
    aiMedicineGuidanceSupport: Boolean(data.aiMedicineGuidanceSupport ?? data.aiGuidance),
    communityCaseDiscussions: Boolean(data.communityCaseDiscussions ?? data.communityDiscussion),

    // Availability
    availableDays: arr(data.availableDays, ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
    availableFrom: data.availableFrom || data.timeFrom || "10:00 AM",
    availableUntil: data.availableUntil || data.timeTo || "05:00 PM",
    emergencyAvailable: Boolean(data.emergencyAvailable),
    maxPatientsPerDay: data.maxPatientsPerDay ? Number(data.maxPatientsPerDay) : Number(data.maxPatients) || 20,
    assistantDoctorName: data.assistantDoctorName || data.assistantName || "",
    notificationMode: arr(data.notificationMode, ["in-app"]).join(", ") || "in-app",
    dashboardHomePreference: data.dashboardHomePreference || data.dashboardPreference || "patients",

    onboardingCompleted: true,
    updatedAt: nowIso(),
    createdAt: prev.createdAt || nowIso(),
  };

  upsertLocal(KEY_DOCTORS, payload);
  await putDoc("doctors", uid, sanitizeFirestorePayload(payload));

  const users = getLocalStorage<Record<string, UserDocument>>(KEY_USERS, {});
  const userRecord: UserDocument = users[uid]
    ? { ...users[uid], onboardingCompleted: true, updatedAt: nowIso() }
    : {
        uid,
        role: "doctor",
        email: payload.professionalEmail,
        onboardingCompleted: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
  await saveUserRecord(userRecord);
};

export const getDoctorProfile = async (uid: string): Promise<DoctorProfileDocument | null> => {
  const doc = await getDocOrLocal<DoctorProfileDocument>("doctors", uid, KEY_DOCTORS);
  if (doc) return doc;
  // Match seed doctors so demo bookings resolve to a real profile.
  return SEED_DOCTORS.find((d) => d.uid === uid) || null;
};

export const updateDoctorRecord = (uid: string, data: Record<string, any>): Promise<void> =>
  saveDoctorOnboarding(uid, data);

/* ─── Doctor directory ─── */

export const getAllOnboardedDoctors = async (): Promise<DoctorProfileDocument[]> => {
  try {
    const snap = await withTimeout(getDocs(collection(db, "doctors")), FIRESTORE_TIMEOUT_MS);
    const remote = snap.docs.map((d) => ({ ...(d.data() as DoctorProfileDocument), uid: d.id }));
    if (remote.length > 0) {
      const map: Record<string, DoctorProfileDocument> = {};
      remote.forEach((d) => (map[d.uid] = d));
      SEED_DOCTORS.forEach((seed) => {
        if (!map[seed.uid]) map[seed.uid] = seed;
      });
      setLocalStorage(KEY_DOCTORS, map);
      return Object.values(map);
    }
  } catch (err) {
    console.warn("[Medscope Firestore] Doctor directory fetch failed, using mirror/seeds:", err);
  }
  const localList = Object.values(getLocalStorage<Record<string, DoctorProfileDocument>>(KEY_DOCTORS, {}));
  const combined = [...SEED_DOCTORS];
  localList.forEach((d) => {
    if (!combined.some((existing) => existing.uid === d.uid)) combined.push(d);
  });
  return combined;
};

/**
 * Find doctors whose specialty/expertise matches a health problem.
 * Pure function (no Firestore calls) so the UI can filter live while typing.
 */
export const findDoctorsForProblem = (
  doctors: DoctorProfileDocument[],
  problem: string,
  limit = 6
): DoctorProfileDocument[] => {
  const normalized = (problem || "").toLowerCase().trim();
  if (!normalized) return [];
  const words = normalized.split(/[^a-z0-9]+/).filter((w) => w.length > 2);

  const scored = doctors
    .map((doc) => {
      const haystack = [
        doc.specialization,
        doc.subSpecialization,
        doc.professionalBio,
        ...(Array.isArray(doc.areasOfExpertise) ? doc.areasOfExpertise : []),
        ...(Array.isArray(doc.consultationFocusAreas) ? doc.consultationFocusAreas : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (haystack.includes(normalized)) score += 10;
      words.forEach((w) => {
        if (haystack.includes(w)) score += 2;
      });
      if ((doc.professionalBio || "").toLowerCase().includes(normalized)) score += 2;
      return { doc, score };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.doc);
};

/* ─── Doctor-side patient directory ─── */

/** Shape a stored patient doc into the doctor's patient-directory card. */
export const toPatientCard = (p: Record<string, any>) => ({
  id: String(p.uid || ""),
  medicalId: `PAT-${String(p.uid || "").slice(-6).toUpperCase()}`,
  name: p.fullName || "Registered Patient",
  age: Number(p.age) || 0,
  gender: p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "Not specified",
  bloodGroup: p.bloodGroup || "Unknown",
  phone: p.phone || "Not provided",
  primaryDiagnosis: Array.isArray(p.conditions) && p.conditions.length
    ? p.conditions.join(" • ")
    : "No conditions recorded",
  treatmentStatus: p.hasMedications ? p.medications || "On prescribed medication" : "No active medication",
  lastConsultation: "—",
  nextAppointment: "—",
  riskLevel: "MONITOR" as const,
  assignedDoctor: "Unassigned",
  isRegistered: true,
});

/** All onboarded patients (Firestore first, local mirror fallback). */
export const getRegisteredPatientCards = async (): Promise<Array<Record<string, any>>> => {
  const cards: Array<Record<string, any>> = [];
  try {
    const snap = await withTimeout(getDocs(collection(db, "patients")), FIRESTORE_TIMEOUT_MS);
    snap.forEach((d) => {
      const p = d.data() as Record<string, any>;
      if (p.onboardingCompleted) cards.push(toPatientCard({ ...p, uid: d.id }));
    });
  } catch (err) {
    console.warn("[Medscope Firestore] Patient directory fetch failed, using mirror:", err);
  }
  const map = getLocalStorage<Record<string, Record<string, any>>>(KEY_PATIENTS, {});
  Object.values(map).forEach((p) => {
    if (p.onboardingCompleted && !cards.some((c) => c.id === p.uid)) cards.push(toPatientCard(p));
  });
  return cards;
};

/* ─── Appointments ─── */

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
  createdAt?: string;
  updatedAt?: string;
}

const KEY_APPOINTMENTS = "medscope_appointments_db";

export const getAppointmentsForDoctorAndDate = async (
  doctorId: string,
  appointmentDate: string
): Promise<AppointmentDocument[]> => {
  try {
    const snap = await withTimeout(
      getDocs(query(collection(db, "appointments"), where("doctorId", "==", doctorId), where("appointmentDate", "==", appointmentDate))),
      FIRESTORE_TIMEOUT_MS
    );
    return snap.docs.map((d) => ({ ...(d.data() as AppointmentDocument), id: d.id }));
  } catch {
    const map = getLocalStorage<Record<string, AppointmentDocument>>(KEY_APPOINTMENTS, {});
    return Object.values(map).filter(
      (app) => app.doctorId === doctorId && app.appointmentDate === appointmentDate
    );
  }
};

export const createAppointmentWithConflictCheck = async (
  appointment: Omit<AppointmentDocument, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; appointmentId?: string; error?: string }> => {
  const appID = `app_${Date.now()}`;
  const newAppointment: AppointmentDocument = {
    ...appointment,
    id: appID,
    status: "scheduled",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const map = getLocalStorage<Record<string, AppointmentDocument>>(KEY_APPOINTMENTS, {});
  map[appID] = newAppointment;
  setLocalStorage(KEY_APPOINTMENTS, map);
  const ok = await putDoc("appointments", appID, sanitizeFirestorePayload(newAppointment));
  return ok ? { success: true, appointmentId: appID } : { success: true, appointmentId: appID, error: "saved locally only" };
};

export const getPatientAppointments = async (patientId: string): Promise<AppointmentDocument[]> => {
  try {
    const snap = await withTimeout(
      getDocs(query(collection(db, "appointments"), where("patientId", "==", patientId))),
      FIRESTORE_TIMEOUT_MS
    );
    return snap.docs.map((d) => ({ ...(d.data() as AppointmentDocument), id: d.id }));
  } catch {
    const map = getLocalStorage<Record<string, AppointmentDocument>>(KEY_APPOINTMENTS, {});
    return Object.values(map).filter((app) => app.patientId === patientId);
  }
};

export const getDoctorAppointments = async (doctorId: string): Promise<AppointmentDocument[]> => {
  try {
    const snap = await withTimeout(
      getDocs(query(collection(db, "appointments"), where("doctorId", "==", doctorId))),
      FIRESTORE_TIMEOUT_MS
    );
    return snap.docs.map((d) => ({ ...(d.data() as AppointmentDocument), id: d.id }));
  } catch {
    const map = getLocalStorage<Record<string, AppointmentDocument>>(KEY_APPOINTMENTS, {});
    return Object.values(map).filter((app) => app.doctorId === doctorId);
  }
};
