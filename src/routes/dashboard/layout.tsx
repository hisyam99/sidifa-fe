import { component$, Slot } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LoadingSpinner } from "~/components/ui";
import { useAuth } from "~/hooks";
import { LuHeart } from "@qwikest/icons/lucide";

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
      <div class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 flex items-center justify-center">
        <div class="text-center">
          <div class="avatar placeholder mb-6">
            <div class="bg-gradient-primary text-white rounded-full w-20 h-20 shadow-xl animate-pulse">
              <LuHeart class="w-10 h-10" />
            </div>
          </div>
          <LoadingSpinner size="lg" text="Memverifikasi akun..." />
        </div>
      </div>
    );
  }

  return (
    <main class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto py-8 px-4">
        <Slot />
      </div>
    </main>
  );
});
