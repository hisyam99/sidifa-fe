// Auth utilities for consistent sessionStorage management

export type UserRole = "admin" | "psikolog" | "posyandu";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// SessionStorage management
export const sessionUtils = {
  setUserProfile(profile: User): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user_profile", JSON.stringify(profile));
    }
  },

  getUserProfile(): User | null {
    if (typeof window !== "undefined") {
      const sessionUser = sessionStorage.getItem("user_profile");
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user_profile");
    }
  },

  clearAllAuthData(): void {
    this.removeUserProfile();
  },
};
