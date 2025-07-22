import { component$, Slot, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { sessionUtils } from "~/utils/auth";

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
    return (
      <div class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
        <div class="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div class="flex items-center justify-between mb-8">
            <div class="skeleton h-8 w-32"></div>
            <div class="skeleton h-10 w-24"></div>
          </div>

          {/* Main Content Skeleton */}
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Skeleton */}
            <div class="lg:col-span-1">
              <div class="card bg-base-100 shadow-lg">
                <div class="card-body">
                  <div class="skeleton h-6 w-24 mb-4"></div>
                  <div class="space-y-3">
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-3/4"></div>
                    <div class="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div class="lg:col-span-3">
              <div class="card bg-base-100 shadow-lg">
                <div class="card-body">
                  <div class="skeleton h-8 w-48 mb-6"></div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="skeleton h-24 w-full"></div>
                    <div class="skeleton h-24 w-full"></div>
                    <div class="skeleton h-24 w-full"></div>
                  </div>
                  <div class="skeleton h-32 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Let the auth hook handle redirects setelah client hydration
  if (!isAuthenticated.value) {
    return null; // The auth hook will redirect
  }

  return <Slot />;
});
