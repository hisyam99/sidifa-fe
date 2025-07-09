import { component$, Slot } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LoadingSpinner } from "~/components/ui";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { isLoggedIn, loading } = useAuth();
  const nav = useNavigate();

  // Redirect to login if not authenticated
  if (!loading.value && !isLoggedIn.value) {
    nav("/auth/login");
    return null;
  }

  if (loading.value) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memverifikasi akun..." />
      </div>
    );
  }

  return (
    <main class="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div class="container mx-auto py-8 px-4">
        <Slot />
      </div>
    </main>
  );
});
