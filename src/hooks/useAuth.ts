import { useSignal, useVisibleTask$, $, isServer } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { profileService, authService } from "~/services/api";
import { sessionUtils, type User } from "~/utils/auth";
import { isRateLimitError, isAuthError } from "~/utils/error";

// Global state untuk mencegah multiple API calls dan initialization
const globalAuthState = {
  isInitialized: false,
  isChecking: false,
  lastCheck: 0,
  checkInterval: 5 * 60 * 1000, // 5 minutes
  // Global signals untuk konsistensi antar komponen
  globalIsLoggedIn: false,
  globalUser: null as User | null,
  globalLoading: true,
};

export const useAuth = () => {
  const isLoggedIn = useSignal(globalAuthState.globalIsLoggedIn);
  const user = useSignal<User | null>(globalAuthState.globalUser);
  const loading = useSignal(globalAuthState.globalLoading);
  const error = useSignal<string | null>(null);
  const nav = useNavigate();

  const checkAuthStatus = $(async (forceCheck = false) => {
    // Prevent multiple simultaneous checks
    if (globalAuthState.isChecking && !forceCheck) {
      return;
    }

    // Skip if checked recently (unless forced)
    const now = Date.now();
    if (!forceCheck && now - globalAuthState.lastCheck < globalAuthState.checkInterval) {
      return;
    }

    globalAuthState.isChecking = true;
    
    try {
      loading.value = true;
      globalAuthState.globalLoading = true;
      error.value = null;
      const profileData = await profileService.getProfile();
      user.value = profileData;
      isLoggedIn.value = true;
      globalAuthState.globalUser = profileData;
      globalAuthState.globalIsLoggedIn = true;
      sessionUtils.setUserProfile(profileData);
      sessionUtils.setAuthStatus(true);
      globalAuthState.lastCheck = now;
    } catch (err: any) {
      // Tangani 429 error dengan lebih spesifik
      if (isRateLimitError(err)) {
        console.log("⚠️ Rate limit detected in checkAuthStatus - preserving session");
        error.value = "Terlalu banyak permintaan, silakan coba lagi nanti.";
        // JANGAN hapus session/data apapun untuk 429 error
        return;
      }

      // Tangani error lain yang mungkin menyebabkan session clearing
      if (isAuthError(err)) {
        console.log("🔐 Unauthorized error detected - clearing session");
        user.value = null;
        isLoggedIn.value = false;
        globalAuthState.globalUser = null;
        globalAuthState.globalIsLoggedIn = false;
        error.value = "Sesi tidak valid atau telah berakhir.";
        sessionUtils.clearAllAuthData();
        sessionUtils.setAuthStatus(false);
        nav("/auth/login");
      } else {
        // Untuk error lain yang tidak spesifik, jangan hapus session
        console.log("⚠️ Non-critical error in checkAuthStatus - preserving session", err);
        error.value = "Terjadi kesalahan, silakan coba lagi.";
      }
    } finally {
      globalAuthState.isChecking = false;
      loading.value = false;
      globalAuthState.globalLoading = false;
    }
  });

  const logout = $(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      sessionUtils.clearAllAuthData();
      sessionUtils.setAuthStatus(false);
      user.value = null;
      isLoggedIn.value = false;
      globalAuthState.globalUser = null;
      globalAuthState.globalIsLoggedIn = false;
      globalAuthState.isInitialized = false;
      globalAuthState.lastCheck = 0;
      nav("/auth/login");
    }
  });

  const refreshUserData = $(async () => {
    await checkAuthStatus(true); // Force check
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (isServer) {
      return;
    }

    // Skip if already initialized
    if (globalAuthState.isInitialized) {
      // Sync dengan global state
      isLoggedIn.value = globalAuthState.globalIsLoggedIn;
      user.value = globalAuthState.globalUser;
      loading.value = globalAuthState.globalLoading;
      return;
    }

    // Cek status login yang tersimpan di localStorage
    const storedAuth = sessionUtils.getAuthStatus();
    if (storedAuth === false) {
      isLoggedIn.value = false;
      loading.value = false;
      globalAuthState.globalIsLoggedIn = false;
      globalAuthState.globalLoading = false;
      globalAuthState.isInitialized = true;
      return;
    }

    const sessionUser = sessionUtils.getUserProfile();
    
    // Jika ada data user tersimpan, gunakan data tersebut
    if (sessionUser && storedAuth === true) {
      user.value = sessionUser;
      isLoggedIn.value = true;
      loading.value = false;
      globalAuthState.globalUser = sessionUser;
      globalAuthState.globalIsLoggedIn = true;
      globalAuthState.globalLoading = false;
      globalAuthState.isInitialized = true;
      
      // Validasi dengan API di background (non-blocking)
      setTimeout(() => {
        checkAuthStatus();
      }, 100);
      return;
    }

    // Jika tidak ada data tersimpan (first visit)
    if (!sessionUser && storedAuth === null) {
      isLoggedIn.value = false;
      loading.value = false;
      globalAuthState.globalIsLoggedIn = false;
      globalAuthState.globalLoading = false;
      globalAuthState.isInitialized = true;
      return;
    }

    // Fallback: cek auth status jika ada data tapi tidak jelas statusnya
    globalAuthState.isInitialized = true;
    checkAuthStatus();
  });

  return {
    isLoggedIn,
    user,
    loading,
    error,
    logout,
    refreshUserData,
  };
};
