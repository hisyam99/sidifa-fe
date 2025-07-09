import { useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  no_telp: string;
  nama_posyandu?: string;
  lokasi?: string;
  spesialis?: string;
}

export const useAuth = () => {
  const isLoggedIn = useSignal(false);
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);

  const checkAuthStatus = $(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          isLoggedIn.value = true;
          user.value = parsedUser;
        } catch (error) {
          console.error("Error parsing user data:", error);
          isLoggedIn.value = false;
          user.value = null;
        }
      } else {
        isLoggedIn.value = false;
        user.value = null;
      }
      loading.value = false;
    }
  });

  useVisibleTask$(({ cleanup }) => {
    // Check initial auth status
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "user") {
        checkAuthStatus();
      }
    };

    // Listen for window focus (when user comes back to tab)
    const handleWindowFocus = () => {
      checkAuthStatus();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleWindowFocus);

    // Cleanup event listeners
    cleanup(() => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleWindowFocus);
    });
  });

  return {
    isLoggedIn,
    user,
    loading,
    checkAuthStatus,
  };
};
