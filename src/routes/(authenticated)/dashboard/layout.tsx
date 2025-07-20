import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { sessionUtils } from "~/utils/auth";
import { DashboardSkeletonLoader } from "~/components/common";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);

  // Client-side hydration dan update auth state
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    isClient.value = true;
    const storedAuth = sessionUtils.getAuthStatus();
    const hasUserProfile = !!sessionUtils.getUserProfile();
    isAuthenticated.value = storedAuth === true && hasUserProfile;
  });

  // Show skeleton loading hanya saat SSR atau initial load
  if (!isClient.value) {
    return <DashboardSkeletonLoader />;
  }

  // Let the auth hook handle redirects setelah client hydration
  if (!isAuthenticated.value) {
    return null; // The auth hook will redirect
  }

  return <Slot />;
});
