import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECURE_STORAGE_KEY || 'default-dev-secret-key-12345';

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

export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error("Secure storage write error", e);
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
      } catch (e) {
        // Not old btoa format, proceed to AES decryption
      }
      
      const bytes = CryptoJS.AES.decrypt(stored, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch (e) {
      console.error("Secure storage read error", e);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};
