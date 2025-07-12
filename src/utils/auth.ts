// Auth utilities for consistent sessionStorage management

export interface User {
  id: string;
  email: string;
  role: string;
}

// Global auth state management
export const globalAuthState = {
  isLoggedIn: false,
  user: null as User | null,
  loading: false,
  initialized: false,
  checkPromise: null as Promise<void> | null,
  lastCheckTime: 0,
  visibleTaskExecuted: false,
};

// Debounce utility
const DEBOUNCE_DELAY = 1000; // 1 second

export const debounceAuthCheck = () => {
  const now = Date.now();
  if (now - globalAuthState.lastCheckTime < DEBOUNCE_DELAY) {
    return true; // Should debounce
  }
  globalAuthState.lastCheckTime = now;
  return false; // Should proceed
};

// Reset global auth state
export const resetGlobalAuthState = () => {
  globalAuthState.isLoggedIn = false;
  globalAuthState.user = null;
  globalAuthState.loading = false;
  globalAuthState.initialized = false;
  globalAuthState.checkPromise = null;
  globalAuthState.lastCheckTime = 0;
  globalAuthState.visibleTaskExecuted = false;
};

// Reset auth redirect flag
export const resetAuthRedirectFlag = () => {
  // This will be imported in useAuthRedirect.ts
  if (typeof window !== "undefined") {
    (window as any).authRedirectExecuted = false;
  }
};

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
