import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { sessionUtils } from "~/utils/auth";
// import { DashboardSkeletonLoader } from "~/components/common"; // Removed unused import

// interface AdminOnlyContentProps {
//   // No specific props needed beyond children, as it handles its own auth logic
// }

export const AdminOnlyContent = component$(() => { // Removed props parameter
  const { user, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);
  const isAdmin = useSignal(false);

  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes
    track(() => user.value?.role); // Re-run when user role changes

    isClient.value = true;
    const storedAuth = sessionUtils.getAuthStatus();
    const hasUserProfile = !!sessionUtils.getUserProfile();
    const userProfile = sessionUtils.getUserProfile();

    isAuthenticated.value = storedAuth === true && hasUserProfile;
    isAdmin.value = userProfile?.role === "admin";

    // Redirect jika bukan admin, only after client hydration and auth status is known
    if (isClient.value && isAuthenticated.value && !isAdmin.value) {
      nav("/dashboard"); // Redirect ke dashboard utama jika bukan admin
    }
  });

  if (!isClient.value) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated.value) {
    return null; // The auth hook/layout will handle redirect
  }

  if (!isAdmin.value) {
    return (
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Akses Ditolak</h1>
        <p class="mb-2">Halaman ini hanya dapat diakses oleh admin.</p>
      </div>
    );
  }

  return <Slot />;
});
