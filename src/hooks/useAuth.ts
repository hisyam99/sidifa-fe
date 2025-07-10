import { useSignal, useVisibleTask$, $, isServer } from "@builder.io/qwik";
import { profileService, authService } from "~/services/api";
import { sessionUtils, type User } from "~/utils/auth";

export const useAuth = () => {
  const isLoggedIn = useSignal(false);
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  const checkAuthStatus = $(async () => {
    try {
      loading.value = true;
      error.value = null;

      // Check sessionStorage first for immediate response
      const sessionUser = sessionUtils.getUserProfile();
      if (sessionUser) {
        user.value = sessionUser;
        isLoggedIn.value = true;
        loading.value = false;
        return;
      }

      // If no session, fetch from API
      const profileData = await profileService.getProfile();
      user.value = profileData;
      isLoggedIn.value = true;

      // Store in sessionStorage only
      sessionUtils.setUserProfile(profileData);
    } catch {
      user.value = null;
      isLoggedIn.value = false;
      error.value = "Gagal memuat data profil";

      // Clear all auth data on failure
      sessionUtils.clearAllAuthData();
    } finally {
      loading.value = false;
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
    }
  });

  const refreshUserData = $(async () => {
    try {
      loading.value = true;
      error.value = null;
      const profileData = await profileService.getProfile();
      user.value = profileData;
      isLoggedIn.value = true;
      sessionUtils.setUserProfile(profileData);
    } catch (error: any) {
      user.value = null;
      isLoggedIn.value = false;
      error.value = "Gagal memuat data profil";
      sessionUtils.clearAllAuthData();
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

    // Check sessionStorage first for immediate response
    const sessionUser = sessionUtils.getUserProfile();
    if (sessionUser) {
      user.value = sessionUser;
      isLoggedIn.value = true;
      loading.value = false;
      return;
    }

    // If no session, fetch from API
    checkAuthStatus();
  });

  return {
    isLoggedIn,
    user,
    loading,
    error,
    checkAuthStatus,
    logout,
    refreshUserData,
  };
};
