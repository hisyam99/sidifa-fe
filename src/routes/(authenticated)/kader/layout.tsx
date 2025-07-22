import { component$, Slot, useSignal, useTask$ } from "@qwik.dev/core";
import { useLocation, useNavigate } from "@qwik.dev/router";
import { useAuth } from "~/hooks/useAuth";
import { useCheckRole } from "~/hooks/useCheckRole";
import { NavigationKader, Breadcrumbs } from "~/components/layout";

export default component$(() => {
  const { isLoggedIn, loading } = useAuth();
  const nav = useNavigate();

  // Redirect to login if not logged in and not loading
  useTask$(() => {
    if (!loading.value && !isLoggedIn.value) {
      nav("/login");
    }
  });

  useCheckRole(["kader"]);

  // Track navigation for global loading overlay
  const location = useLocation();
  const isNavigating = useSignal(false);
  const prevPath = useSignal(location.url.pathname);

  useTask$(({ track }) => {
    const currentPath = track(() => location.url.pathname);
    if (prevPath.value !== currentPath) {
      isNavigating.value = true;
      setTimeout(() => {
        isNavigating.value = false;
        prevPath.value = currentPath;
      }, 350);
    }
  });

  return (
    <div class="min-h-screen bg-base-200/60">
      <NavigationKader />
      <div class="relative">
        {isNavigating.value && (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-base-100/70 transition-opacity animate-fade-in">
            <span class="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        <main class="container mx-auto p-4 md:p-8 transition-all duration-300 animate-fade-in-up">
          <Breadcrumbs />
          <Slot />
        </main>
      </div>
    </div>
  );
});
