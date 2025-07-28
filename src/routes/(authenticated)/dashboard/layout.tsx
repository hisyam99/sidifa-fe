import { component$, Slot, useTask$, useSignal } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { useNavigate } from "@qwik.dev/router";
import { DashboardSkeletonLoader } from "~/components/common";
import { NavigationGuest } from "~/components/layout";

export default component$(() => {
  const { user, isLoggedIn, loading } = useAuth();
  const nav = useNavigate();
  const isClient = useSignal(false);
  const hasRedirected = useSignal(false);

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => user.value?.role);
    track(loading);

    isClient.value = true;

    // Redirect to guest page if not logged in and not loading
    if (!loading.value && !isLoggedIn.value && !hasRedirected.value) {
      hasRedirected.value = true;
      nav("/auth/login");
      return;
    }

    if (
      !loading.value &&
      isLoggedIn.value &&
      user.value?.role &&
      !hasRedirected.value
    ) {
      hasRedirected.value = true;
      if (user.value.role === "admin") {
        nav("/admin");
      } else if (user.value.role === "kader") {
        nav("/kader");
      } else if (user.value.role === "psikolog") {
        nav("/psikolog");
      } else {
        nav("/auth/login");
      }
    }
  });

  // Show skeleton loading during SSR or initial load
  if (!isClient.value || loading.value) {
    return <DashboardSkeletonLoader />;
  }

  // Render nothing, as redirect will happen
  return (
    <div class="min-h-screen">
      <NavigationGuest />
      <Slot />
    </div>
  );
});
