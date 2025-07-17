import { component$, Slot, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useCheckRole } from "~/hooks/useCheckRole";
import { sessionUtils } from "~/utils/auth";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);

  useCheckRole(["posyandu"]);

  // Client-side hydration dengan localStorage untuk mencegah flickering
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    isClient.value = true;
    // Gunakan localStorage untuk initial state yang konsisten
    const storedAuth = sessionUtils.getAuthStatus();
    const hasUserProfile = !!sessionUtils.getUserProfile();
    isAuthenticated.value = storedAuth === true && hasUserProfile;
  });

  // Update auth state ketika berubah (hanya di client)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => isLoggedIn.value);
    if (isClient.value) {
      isAuthenticated.value = isLoggedIn.value;
    }
  });

  // Show skeleton loading hanya saat SSR atau initial load
  if (!isClient.value) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Let the auth hook handle redirects setelah client hydration
  if (!isAuthenticated.value) {
    return null; // The auth hook will redirect
  }

  return <Slot />;
});
