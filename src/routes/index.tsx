import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

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
          <div class="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4">
                Selamat Datang, {userName.value}!
              </h2>
              <p class="text-gray-600 mb-4">
                Anda login sebagai{" "}
                <span class="badge badge-primary">{userRole.value}</span>
              </p>
              <div class="card-actions justify-center">
                <a href="/profile" class="btn btn-primary">
                  Lihat Profile
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">Posyandu</h2>
                <p class="text-gray-600 mb-4">
                  Daftar sebagai Posyandu untuk mengelola data kesehatan
                  masyarakat.
                </p>
                <div class="card-actions justify-center">
                  <a href="/signup-posyandu" class="btn btn-primary">
                    Daftar Posyandu
                  </a>
                </div>
              </div>
            </div>

            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">Psikolog</h2>
                <p class="text-gray-600 mb-4">
                  Daftar sebagai Psikolog untuk memberikan layanan konseling.
                </p>
                <div class="card-actions justify-center">
                  <a href="/signup-psikolog" class="btn btn-secondary">
                    Daftar Psikolog
                  </a>
                </div>
              </div>
            </div>
          </div>
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
