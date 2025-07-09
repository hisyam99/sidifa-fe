import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WelcomeCard, SignupCards } from "~/components/home";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { isLoggedIn, user } = useAuth();

  return (
    <main class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <div class="avatar placeholder mb-8">
            <div class="bg-primary text-primary-content rounded-full w-24">
              <span class="text-4xl">🏥</span>
            </div>
          </div>
          <h1 class="text-5xl font-bold text-primary mb-6">
            Selamat Datang di SIDIFA
          </h1>
          <p class="text-xl text-base-content/70 mb-4 max-w-2xl mx-auto">
            Sistem Informasi Digital Posyandu dan Psikolog
          </p>
          <p class="text-base-content/60 max-w-3xl mx-auto">
            Platform terpadu untuk mengelola data kesehatan masyarakat dan
            memberikan layanan konseling yang terintegrasi
          </p>
        </div>

        {isLoggedIn.value ? (
          <div class="max-w-4xl mx-auto">
            <WelcomeCard
              userName={user.value?.name || ""}
              userRole={user.value?.role || ""}
            />
          </div>
        ) : (
          <>
            <SignupCards />

            <div class="text-center mt-16">
              <div class="divider">atau</div>
              <div class="space-y-4">
                <p class="text-base-content/70">Sudah punya akun?</p>
                <a href="/auth/login" class="btn btn-primary btn-lg">
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Masuk ke SIDIFA
                </a>
              </div>
            </div>
          </>
        )}

        {/* Features Section */}
        {!isLoggedIn.value && (
          <div class="mt-24">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold mb-4">Fitur Unggulan</h2>
              <p class="text-base-content/70">Mengapa memilih SIDIFA?</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div class="card-body text-center">
                  <div class="avatar placeholder mx-auto mb-4">
                    <div class="bg-primary text-primary-content rounded-full w-16">
                      <span class="text-2xl">📊</span>
                    </div>
                  </div>
                  <h3 class="card-title justify-center">Data Terintegrasi</h3>
                  <p class="text-base-content/70">
                    Kelola data kesehatan masyarakat dengan sistem yang
                    terintegrasi dan aman
                  </p>
                </div>
              </div>

              <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div class="card-body text-center">
                  <div class="avatar placeholder mx-auto mb-4">
                    <div class="bg-secondary text-secondary-content rounded-full w-16">
                      <span class="text-2xl">🔒</span>
                    </div>
                  </div>
                  <h3 class="card-title justify-center">Keamanan Tinggi</h3>
                  <p class="text-base-content/70">
                    Data pribadi terlindungi dengan sistem keamanan yang canggih
                  </p>
                </div>
              </div>

              <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div class="card-body text-center">
                  <div class="avatar placeholder mx-auto mb-4">
                    <div class="bg-accent text-accent-content rounded-full w-16">
                      <span class="text-2xl">⚡</span>
                    </div>
                  </div>
                  <h3 class="card-title justify-center">Akses Cepat</h3>
                  <p class="text-base-content/70">
                    Akses informasi kesehatan dan layanan konseling dengan cepat
                    dan mudah
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
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
