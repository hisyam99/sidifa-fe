// Auth utilities for consistent cookie and sessionStorage management

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface UserSession {
  id: string;
  role: string;
}

// Cookie management
export const cookieUtils = {
  setUserSession(userData: User): void {
    if (typeof document !== "undefined") {
      const sessionData: UserSession = {
        id: userData.id,
        role: userData.role,
      };
      const cookieValue = encodeURIComponent(JSON.stringify(sessionData));
      document.cookie = `user_session=${cookieValue}; path=/; secure; samesite=strict; max-age=3600`;
    }
  },

  removeUserSession(): void {
    if (typeof document !== "undefined") {
      document.cookie =
        "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
    }
  },

  getUserSession(): UserSession | null {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const userSessionCookie = cookies.find((c) =>
        c.startsWith("user_session="),
      );

      if (userSessionCookie) {
        try {
          const value = decodeURIComponent(userSessionCookie.split("=")[1]);
          const userSession = JSON.parse(value);
          if (userSession?.id && userSession?.role) {
            return userSession;
          }
        } catch {
          // Invalid JSON, clear corrupted cookie
          this.removeUserSession();
        }
      }
    }
    return null;
  },

  setToken(token: string, tokenType: "access" | "refresh"): void {
    if (typeof document !== "undefined") {
      const cookieName = `${tokenType}_token`;
      document.cookie = `${cookieName}=${encodeURIComponent(token)}; path=/; secure; samesite=strict; max-age=3600`;
    }
  },

  removeToken(tokenType: "access" | "refresh"): void {
    if (typeof document !== "undefined") {
      const cookieName = `${tokenType}_token`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
    }
  },

  getAccessToken(): string | null {
    if (typeof document !== "undefined") {
      const regex = /(?:^|; )access_token=([^;]*)/;
      const match = regex.exec(document.cookie);
      if (match?.[1]) {
        try {
          return decodeURIComponent(match[1]);
        } catch {
          // Invalid token, clear it
          this.removeToken("access");
          return null;
        }
      }
    }
    return null;
  },

  clearAllAuthCookies(): void {
    this.removeUserSession();
    this.removeToken("access");
    this.removeToken("refresh");
  },
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
    cookieUtils.clearAllAuthCookies();
  },
};
