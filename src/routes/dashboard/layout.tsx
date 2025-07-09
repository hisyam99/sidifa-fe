import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LoadingSpinner } from "~/components/ui";
import { useAuthLoader } from "~/routes/layout";
import { LuHeart } from "@qwikest/icons/lucide";

export default component$(() => {
  const auth = useAuthLoader();
  const nav = useNavigate();

  // Redirect to login if not authenticated
  if (!auth.value.isLoggedIn) {
    nav("/auth/login");
    return null;
  }

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
});
