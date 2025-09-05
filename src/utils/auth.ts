import { isBrowser } from "@builder.io/qwik";

// Auth utilities for consistent localStorage management

export type UserRole = "admin" | "psikolog" | "posyandu" | "kader";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// LocalStorage management
export const sessionUtils = {
  setUserProfile(profile: User): void {
    if (isBrowser) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    }
  },

  getUserProfile(): User | null {
    if (isBrowser) {
      const sessionUser = localStorage.getItem("user_profile");
      if (sessionUser) {
        try {
          const parsedUser = JSON.parse(sessionUser);
          if (parsedUser?.id && parsedUser?.email && parsedUser?.role) {
            return parsedUser;
          }
        } catch {
          // Invalid JSON, clear corrupted data
          this.removeUserProfile();
        }
      }
    }
    return null;
  },

  removeUserProfile(): void {
    if (isBrowser) {
      localStorage.removeItem("user_profile");
    }
  },

  // --- NEW: Login status helpers using localStorage ---
  setAuthStatus(isLoggedIn: boolean): void {
    if (isBrowser) {
      localStorage.setItem("auth_status", JSON.stringify(isLoggedIn));
    }
  },

  getAuthStatus(): boolean | null {
    if (isBrowser) {
      const raw = localStorage.getItem("auth_status");
      if (raw !== null) {
        try {
          return JSON.parse(raw) as boolean;
        } catch {
          this.removeAuthStatus();
        }
      }
    }
    return null;
  },

  removeAuthStatus(): void {
    if (isBrowser) {
      localStorage.removeItem("auth_status");
    }
  },
  // --- END NEW ---

  clearAllAuthData(): void {
    this.removeUserProfile();
    // Pastikan status login di-reset agar diakses cepat tanpa panggilan API berikutnya
    this.setAuthStatus(false);
  },
};
