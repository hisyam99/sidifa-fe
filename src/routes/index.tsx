import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WelcomeCard, SignupCards } from "~/components/home";

export default component$(() => {
  const isLoggedIn = useSignal(false);
  const userName = useSignal<string | null>(null);
  const userRole = useSignal<string | null>(null);

  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          isLoggedIn.value = true;
          userName.value = user.name;
          userRole.value = user.role;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary mb-4">
          Selamat Datang di SIDIFA
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Sistem Informasi Digital Posyandu dan Psikolog
        </p>

        {isLoggedIn.value ? (
          <WelcomeCard userName={userName.value!} userRole={userRole.value!} />
        ) : (
          <SignupCards />
        )}

        {!isLoggedIn.value && (
          <div class="mt-8 text-center">
            <p class="text-gray-600 mb-4">Sudah punya akun?</p>
            <a href="/login" class="btn btn-outline btn-lg">
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "SIDIFA - Sistem Informasi Digital Posyandu dan Psikolog",
  meta: [
    {
      name: "description",
      content: "Sistem Informasi Digital untuk Posyandu dan Psikolog",
    },
  ],
};
