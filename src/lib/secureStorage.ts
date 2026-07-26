import CryptoJS from 'crypto-js';

// TODO (Backend Team): Set VITE_SECURE_STORAGE_KEY in your .env file.
// This MUST be a long, random secret (32+ chars). Never commit this to source control.
// In production: use your CI/CD secret manager (e.g., GitHub Secrets, Vercel env vars).
const _envKey = import.meta.env.VITE_SECURE_STORAGE_KEY;
if (!_envKey && import.meta.env.DEV) {
  console.warn(
    '[Medscope Security] VITE_SECURE_STORAGE_KEY is not set in your .env file.\n' +
    'PHI (Personal Health Information) will be encrypted with a session-only fallback key.\n' +
    'Data stored in localStorage will not persist between sessions until this key is configured.\n' +
    'See .env.example for setup instructions.'
  );
}
// Production safety: if env key is missing, use a per-session random key so PHI
// is NEVER encrypted with a known/hardcoded string. Data won't persist between
// sessions, but this is safer than a known fallback.
const SECRET_KEY = _envKey || (typeof window !== 'undefined'
  ? (() => {
      const sk = sessionStorage.getItem('_msk');
      if (sk) return sk;
      const rand = CryptoJS.lib.WordArray.random(32).toString();
      sessionStorage.setItem('_msk', rand);
      return rand;
    })()
  : 'unreachable-server-side');

/**
 * Secure Storage Utility for Healthcare Data
 * 
 * In a production environment, local storage should absolutely never contain 
 * plain-text PHI (Personal Health Information). This wrapper encrypts data 
 * before storing it in the browser's persistent storage.
 * 
 * NOTE: For maximum security, sensitive data should ideally not be stored 
 * on the client-side at all, or stored using short-lived HttpOnly cookies.
 */

// TODO (Backend Team):
// Replace local secureStorage/localStorage persistence with encrypted backend API calls and session cookies.

export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch {
      // Fail silently in production
    }
  },
  
  getItem: <T>(key: string): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      // Fallback for legacy unencrypted data during transition
      if (stored.startsWith('{') || stored.startsWith('[')) {
        return JSON.parse(stored) as T;
      }
      
      // Try basic base64 decode if it was encoded with old method
      try {
        const decoded = decodeURIComponent(atob(stored));
        if (decoded.startsWith('{') || decoded.startsWith('[')) {
           // Auto-migrate to AES encryption
           const parsed = JSON.parse(decoded) as T;
           secureStorage.setItem(key, parsed);
           return parsed;
        }
      } catch {
        // Not old btoa format, proceed to AES decryption
      }
      
      const bytes = CryptoJS.AES.decrypt(stored, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};
