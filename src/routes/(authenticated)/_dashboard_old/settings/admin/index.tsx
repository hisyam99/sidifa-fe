import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { sessionUtils } from "~/utils/auth";

export default component$(() => {
  const { user, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const isClient = useSignal(false);
  const isAuthenticated = useSignal(false);
  const isAdmin = useSignal(false);

  // Client-side hydration dan update auth state
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
      nav("/dashboard");
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

  if (!isAdmin.value) {
    return (
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Akses Ditolak</h1>
        <p class="mb-2">Halaman ini hanya dapat diakses oleh admin.</p>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>
      <div class="card bg-base-100 shadow-lg p-6">
        <p>
          Selamat datang di halaman admin. Hanya admin yang dapat melihat
          halaman ini.
        </p>
        {/* Tambahkan konten admin di sini */}
      </div>
    </div>
  );
});
