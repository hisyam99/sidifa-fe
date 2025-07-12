import { useSignal, useVisibleTask$, $, isServer } from "@builder.io/qwik";
import { profileService, authService } from "~/services/api";
import { sessionUtils, globalAuthState, resetGlobalAuthState, resetAuthRedirectFlag, type User } from "~/utils/auth";

export const useAuth = () => {
  const isLoggedIn = useSignal(false);
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  const checkAuthStatus = $(async () => {
    console.log("🔍 checkAuthStatus called");
    
    // Prevent multiple concurrent calls
    if (globalAuthState.loading) {
      console.log("⏳ Auth check already in progress, skipping");
      return;
    }
    
    globalAuthState.loading = true;
    loading.value = true;
    
    try {
      // Check sessionStorage first
      const sessionUser = sessionUtils.getUserProfile();
      console.log("🔍 Session user found:", !!sessionUser);
      
      if (sessionUser) {
        console.log("✅ Using session user");
        user.value = sessionUser;
        isLoggedIn.value = true;
        
        // Update global state
        globalAuthState.user = sessionUser;
        globalAuthState.isLoggedIn = true;
        globalAuthState.initialized = true;
        return;
      }
      
      // If no session, try to get from API
      console.log("🌐 No session found, checking API...");
      const profileData = await profileService.getProfile();
      console.log("✅ API returned profile:", profileData);
      
      user.value = profileData;
      isLoggedIn.value = true;
      sessionUtils.setUserProfile(profileData);
      
      // Update global state
      globalAuthState.user = profileData;
      globalAuthState.isLoggedIn = true;
      globalAuthState.initialized = true;
      
    } catch (error: any) {
      console.log("🔍 No valid session found on server");
      user.value = null;
      isLoggedIn.value = false;
      error.value = null;
      sessionUtils.clearAllAuthData();
      
      // Update global state
      globalAuthState.user = null;
      globalAuthState.isLoggedIn = false;
      globalAuthState.initialized = true;
    } finally {
      loading.value = false;
      globalAuthState.loading = false;
    }
  });

  const logout = $(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Error during logout:", error);
    } finally {
      // Clear all auth data
      sessionUtils.clearAllAuthData();
      user.value = null;
      isLoggedIn.value = false;
      
      // Reset global state
      resetGlobalAuthState();
      
      // Reset auth redirect flag
      resetAuthRedirectFlag();
    }
  });

  const refreshUserData = $(async () => {
    console.log("🔄 refreshUserData called");
    try {
      loading.value = true;
      error.value = null;
      const profileData = await profileService.getProfile();
      console.log("✅ Profile data received:", profileData);
      
      user.value = profileData;
      isLoggedIn.value = true;
      sessionUtils.setUserProfile(profileData);
      
      // Update global state
      globalAuthState.user = profileData;
      globalAuthState.isLoggedIn = true;
      globalAuthState.initialized = true;
      globalAuthState.loading = false;
      
      console.log("✅ Global state updated:", globalAuthState);
    } catch (error: any) {
      console.error("❌ Error in refreshUserData:", error);
      user.value = null;
      isLoggedIn.value = false;
      error.value = "Gagal memuat data profil";
      sessionUtils.clearAllAuthData();
      
      // Update global state
      globalAuthState.user = null;
      globalAuthState.isLoggedIn = false;
      globalAuthState.initialized = true;
      globalAuthState.loading = false;
    } finally {
      loading.value = false;
    }
  });

  // Force refresh auth state (useful when sessionStorage is cleared)
  const forceRefreshAuth = $(async () => {
    console.log("🔄 forceRefreshAuth called");
    // Reset global state to force fresh check
    globalAuthState.initialized = false;
    globalAuthState.visibleTaskExecuted = false;
    
    // Clear current state
    user.value = null;
    isLoggedIn.value = false;
    loading.value = true;
    
    // Check API directly
    try {
      const profileData = await profileService.getProfile();
      console.log("✅ Force refresh - Profile data received:", profileData);
      
      user.value = profileData;
      isLoggedIn.value = true;
      sessionUtils.setUserProfile(profileData);
      
      // Update global state
      globalAuthState.user = profileData;
      globalAuthState.isLoggedIn = true;
      globalAuthState.initialized = true;
      globalAuthState.loading = false;
      
      console.log("✅ Force refresh - Global state updated:", globalAuthState);
    } catch (error: any) {
      console.log("🔍 Force refresh - No valid session found");
      user.value = null;
      isLoggedIn.value = false;
      error.value = null;
      sessionUtils.clearAllAuthData();
      
      // Update global state
      globalAuthState.user = null;
      globalAuthState.isLoggedIn = false;
      globalAuthState.initialized = true;
      globalAuthState.loading = false;
    } finally {
      loading.value = false;
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Server guard - don't run on server
    if (isServer) {
      return;
    }

    console.log("🔍 useVisibleTask$ - visibleTaskExecuted:", globalAuthState.visibleTaskExecuted, "initialized:", globalAuthState.initialized);

    // Add storage event listener to detect sessionStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user_profile") {
        console.log("🔄 SessionStorage changed, refreshing auth state");
        if (event.newValue) {
          // User profile was added/updated
          try {
            const userData = JSON.parse(event.newValue);
            user.value = userData;
            isLoggedIn.value = true;
            globalAuthState.user = userData;
            globalAuthState.isLoggedIn = true;
            globalAuthState.initialized = true;
          } catch (error) {
            console.error("Error parsing user profile:", error);
          }
        } else {
          // User profile was removed
          user.value = null;
          isLoggedIn.value = false;
          globalAuthState.user = null;
          globalAuthState.isLoggedIn = false;
          globalAuthState.initialized = true;
        }
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Prevent multiple executions
    if (globalAuthState.visibleTaskExecuted) {
      // Jika sudah dieksekusi, gunakan state global yang ada
      if (globalAuthState.initialized) {
        console.log("✅ Using existing global state");
        isLoggedIn.value = globalAuthState.isLoggedIn;
        user.value = globalAuthState.user;
        loading.value = false;
      } else {
        // Jika belum diinisialisasi, set loading ke false untuk mencegah stuck
        console.log("⚠️ Not initialized, forcing loading to false");
        loading.value = false;
        globalAuthState.initialized = true;
      }
      return;
    }
    globalAuthState.visibleTaskExecuted = true;

    // Check sessionStorage first for immediate response
    const sessionUser = sessionUtils.getUserProfile();
    console.log("🔍 Session user found:", !!sessionUser);
    
    if (sessionUser) {
      console.log("✅ Using session user");
      user.value = sessionUser;
      isLoggedIn.value = true;
      loading.value = false;
      
      // Update global state
      globalAuthState.user = sessionUser;
      globalAuthState.isLoggedIn = true;
      globalAuthState.initialized = true;
      return;
    }

    // Check if user is already logged in via global state
    if (globalAuthState.isLoggedIn && globalAuthState.user) {
      console.log("✅ Using existing global state for logged in user");
      user.value = globalAuthState.user;
      isLoggedIn.value = true;
      loading.value = false;
      globalAuthState.initialized = true;
      return;
    }

    console.log("🌐 No session, checking API...");
    // If no session, fetch from API with timeout fallback
    const timeoutId = setTimeout(() => {
      if (loading.value) {
        console.log("⏰ Auth check timeout, setting loading to false");
        loading.value = false;
        globalAuthState.loading = false;
        globalAuthState.initialized = true;
      }
    }, 3000); // 3 second timeout

    checkAuthStatus().finally(() => {
      clearTimeout(timeoutId);
    });
  });

  return {
    isLoggedIn,
    user,
    loading,
    error,
    checkAuthStatus,
    logout,
    refreshUserData,
    forceRefreshAuth,
  };
};
