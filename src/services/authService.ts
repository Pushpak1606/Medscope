/**
 * =========================================================================
 * MEDSCOPE FIREBASE AUTHENTICATION SERVICE
 * =========================================================================
 * 
 * Used EXCLUSIVELY for authentication (Login, Signup, Google OAuth).
 * Stores only login & signup user account records.
 * Onboarding and medical data are stored strictly in browser localStorage.
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export type AuthRole = "patient" | "doctor";

export interface AuthUserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: AuthRole;
  createdAt: string;
  lastLoginAt: string;
}

const STORAGE_ACTIVE_USER_KEY = "medscope_active_user";
const STORAGE_USER_ROLE_KEY = "medscope_user_role";

/**
 * Helper to get currently active auth user from localStorage
 */
export function getStoredAuthUser(): AuthUserRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Helper to save auth user record to localStorage
 */
export function persistAuthUser(record: AuthUserRecord): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(record));
    localStorage.setItem(STORAGE_USER_ROLE_KEY, record.role);
  } catch (err) {
    console.warn("Failed to persist auth user:", err);
  }
}

/**
 * Clears auth user record from localStorage
 */
export function clearStoredAuthUser(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
    localStorage.removeItem(STORAGE_USER_ROLE_KEY);
  } catch (err) {
    console.warn("Failed to clear auth user:", err);
  }
}

/**
 * Sign up with Email & Password via Firebase Authentication
 */
export async function signupWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: AuthRole
): Promise<AuthUserRecord> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update displayName on Firebase Auth profile
  if (fullName && fullName.trim()) {
    try {
      await updateProfile(user, { displayName: fullName.trim() });
    } catch (profileErr) {
      console.warn("Could not update displayName on Firebase profile:", profileErr);
    }
  }

  const record: AuthUserRecord = {
    uid: user.uid,
    email: user.email,
    displayName: fullName.trim() || user.displayName,
    photoURL: user.photoURL,
    role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  persistAuthUser(record);
  return record;
}

/**
 * Log in with Email & Password via Firebase Authentication
 */
export async function loginWithEmail(
  email: string,
  password: string,
  role: AuthRole
): Promise<AuthUserRecord> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Retrieve existing stored role or default to current attempted role
  const existingUser = getStoredAuthUser();
  const assignedRole = (existingUser && existingUser.uid === user.uid) ? existingUser.role : role;

  const record: AuthUserRecord = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || existingUser?.displayName || "User",
    photoURL: user.photoURL,
    role: assignedRole,
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  persistAuthUser(record);
  return record;
}

/**
 * Sign in / Sign up with Google via Firebase Authentication
 */
export async function signInWithGoogle(
  role: AuthRole
): Promise<{ record: AuthUserRecord; isNewUser: boolean }> {
  // Ensure popup prompts user to pick an account
  googleProvider.setCustomParameters({
    prompt: "select_account"
  });

  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  const existingUser = getStoredAuthUser();
  const isNewUser = !existingUser || existingUser.uid !== user.uid;
  const assignedRole = (!isNewUser && existingUser?.role) ? existingUser.role : role;

  const record: AuthUserRecord = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (role === "doctor" ? "Doctor" : "Patient"),
    photoURL: user.photoURL,
    role: assignedRole,
    createdAt: (!isNewUser && existingUser?.createdAt) ? existingUser.createdAt : new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  persistAuthUser(record);
  return { record, isNewUser };
}

/**
 * Log out from Firebase Authentication & clear session
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Firebase signOut error:", err);
  }
  clearStoredAuthUser();
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Friendly error message parser for Firebase Auth error codes
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/cancelled-popup-request":
      return "Google sign-in request was cancelled.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by browser. Please allow popups.";
    case "auth/unauthorized-domain": {
      const currentHost = typeof window !== "undefined" ? window.location.hostname : "current domain";
      return `Domain "${currentHost}" is not authorized in your Firebase project. If accessing via 127.0.0.1 or a local IP, switch your URL to http://localhost:8080/ or add "${currentHost}" in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    }
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}
