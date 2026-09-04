export type UserRole = "patient" | "doctor";

export interface UserDocument {
  uid: string;
  role: UserRole;
  email: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientDocument {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  address?: string;
  city?: string;
  createdAt?: Timestamp | FieldValue | string;
  updatedAt?: Timestamp | FieldValue | string;
}

export interface DoctorDocument {
  uid: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  phone: string;
  clinic: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  isAvailable?: boolean;
  createdAt: Timestamp | FieldValue | string;
  updatedAt?: Timestamp | FieldValue | string;
}
