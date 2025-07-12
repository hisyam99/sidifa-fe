import { useSignal, useVisibleTask$, $, isServer } from "@builder.io/qwik";
import { profileService, authService } from "~/services/api";
import { sessionUtils, type User } from "~/utils/auth";

// Ganti 'let' dengan sebuah objek. Kita akan mengubah properti objek, bukan variabel itu sendiri.
// Ini adalah pola standar untuk menghindari "illegal reassignment" error pada bundler.
const authCheckState = {
  attempted: false,
};

export const useAuth = () => {
  const isLoggedIn = useSignal(false);
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  const checkAuthStatus = $(async () => {
    try {
      loading.value = true;
      error.value = null;
      const profileData = await profileService.getProfile();
      user.value = profileData;
      isLoggedIn.value = true;
      sessionUtils.setUserProfile(profileData);
    } catch {
      user.value = null;
      isLoggedIn.value = false;
      error.value = "Sesi tidak valid atau telah berakhir.";
      sessionUtils.clearAllAuthData();
    } finally {
      // Ubah properti 'attempted' pada objek
      authCheckState.attempted = true;
      loading.value = false;
    }
  });

  const logout = $(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      sessionUtils.clearAllAuthData();
      user.value = null;
      isLoggedIn.value = false;
      // Reset properti 'attempted' pada objek
      authCheckState.attempted = false;
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
    } catch {
      user.value = null;
      isLoggedIn.value = false;
      error.value = "Gagal memuat ulang data profil.";
      sessionUtils.clearAllAuthData();
    } finally {
      loading.value = false;
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (isServer) {
      return;
    }

    const sessionUser = sessionUtils.getUserProfile();
    if (sessionUser) {
      user.value = sessionUser;
      isLoggedIn.value = true;
      loading.value = false;
      // Ubah properti 'attempted' pada objek
      authCheckState.attempted = true;
      return;
    }

    // Baca properti 'attempted' dari objek
    if (authCheckState.attempted) {
      isLoggedIn.value = false;
      loading.value = false;
      return;
    }

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
