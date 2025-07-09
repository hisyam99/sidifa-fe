import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WelcomeCard, SignupCards } from "~/components/home";
import { useAuth } from "~/hooks";
import {
  LuStethoscope,
  LuBarChart,
  LuZap,
  LuLogIn,
  LuHeart,
  LuUsers,
  LuShield,
  LuBrain,
  LuTrendingUp,
  LuCheckCircle,
  LuArrowRight,
  LuStar,
  LuGlobe,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const { isLoggedIn, user } = useAuth();

  return (
    <main class="min-h-screen">
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        <div class="container mx-auto px-4 py-20 relative z-10">
          <div class="text-center mb-16 animate-fade-in-up">
            <div class="avatar placeholder mb-8">
              <div class="bg-gradient-primary text-white rounded-full w-32 h-32 shadow-2xl">
                <LuHeart class="w-16 h-16" />
              </div>
            </div>
            <h1 class="text-responsive-xl font-bold text-gradient-primary mb-6 leading-tight">
              Selamat Datang di{" "}
              <span class="text-gradient-secondary">SIDIFA</span>
            </h1>
            <p class="text-responsive-md text-base-content/70 mb-6 max-w-3xl mx-auto leading-relaxed">
              Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu
              Disabilitas dan Pemberdayaan Sosial Masyarakat
            </p>
            <p class="text-lg text-base-content/60 max-w-4xl mx-auto leading-relaxed">
              Platform terpadu yang menghubungkan kader posyandu, psikolog, dan
              penyandang disabilitas untuk memberikan layanan kesehatan dan
              dukungan psikologis yang inklusif dan berkualitas.
            </p>
          </div>

          {isLoggedIn.value ? (
            <div class="max-w-4xl mx-auto animate-slide-in-right">
              <WelcomeCard
                userName={user.value?.name || ""}
                userRole={user.value?.role || ""}
              />
            </div>
          ) : (
            <div class="animate-slide-in-right">
              <SignupCards />

              <div class="text-center mt-16">
                <div class="divider">atau</div>
                <div class="space-y-6">
                  <p class="text-base-content/70 text-lg">Sudah punya akun?</p>
                  <a
                    href="/auth/login"
                    class="btn-hero inline-flex items-center gap-3"
                  >
                    <LuLogIn class="w-6 h-6" />
                    Masuk ke SIDIFA
                    <LuArrowRight class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {!isLoggedIn.value && (
        <section class="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div class="container mx-auto px-4">
            <div class="text-center mb-12">
              <h2 class="text-responsive-lg font-bold text-gradient-primary mb-4">
                Dampak Positif SIDIFA
              </h2>
              <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
                Berikut adalah pencapaian dan dampak positif dari implementasi
                sistem SIDIFA
              </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div class="text-center">
                <div class="bg-gradient-primary text-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <LuUsers class="w-8 h-8" />
                </div>
                <h3 class="text-3xl font-bold text-gradient-primary mb-2">
                  500+
                </h3>
                <p class="text-base-content/70 text-sm">
                  Penyandang Disabilitas
                </p>
              </div>

              <div class="text-center">
                <div class="bg-gradient-secondary text-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <LuHeart class="w-8 h-8" />
                </div>
                <h3 class="text-3xl font-bold text-gradient-secondary mb-2">
                  4
                </h3>
                <p class="text-base-content/70 text-sm">Posyandu Aktif</p>
              </div>

              <div class="text-center">
                <div class="bg-gradient-accent text-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <LuBrain class="w-8 h-8" />
                </div>
                <h3 class="text-3xl font-bold text-gradient-accent mb-2">
                  100+
                </h3>
                <p class="text-base-content/70 text-sm">Kader Terlatih</p>
              </div>

              <div class="text-center">
                <div class="bg-primary text-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <LuTrendingUp class="w-8 h-8" />
                </div>
                <h3 class="text-3xl font-bold text-primary mb-2">70%</h3>
                <p class="text-base-content/70 text-sm">
                  Peningkatan Efisiensi
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!isLoggedIn.value && (
        <section class="py-20 bg-base-100">
          <div class="container mx-auto px-4">
            <div class="text-center mb-16">
              <h2 class="text-responsive-lg font-bold text-gradient-primary mb-4">
                Fitur Unggulan
              </h2>
              <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
                Mengapa memilih SIDIFA? Platform kami dirancang khusus untuk
                memenuhi kebutuhan layanan kesehatan inklusif dan pemberdayaan
                penyandang disabilitas.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-gradient-primary text-white rounded-full w-20 h-20 shadow-lg">
                      <LuBarChart class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-gradient-primary">
                    Data Terintegrasi
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Kelola data kesehatan masyarakat dengan sistem yang
                    terintegrasi, aman, dan mudah diakses oleh semua pihak
                    terkait.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-primary badge-lg gap-2">
                      <LuCheckCircle class="w-4 h-4" />
                      Real-time
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-gradient-secondary text-white rounded-full w-20 h-20 shadow-lg">
                      <LuShield class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-gradient-secondary">
                    Keamanan Tinggi
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Data pribadi terlindungi dengan sistem keamanan yang canggih
                    dan mematuhi standar privasi data kesehatan.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-secondary badge-lg gap-2">
                      <LuShield class="w-4 h-4" />
                      Terenkripsi
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-gradient-accent text-white rounded-full w-20 h-20 shadow-lg">
                      <LuZap class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-gradient-accent">
                    Akses Cepat
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Akses informasi kesehatan dan layanan konseling dengan
                    cepat, mudah, dan responsif di berbagai perangkat.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-accent badge-lg gap-2">
                      <LuZap class="w-4 h-4" />
                      Responsif
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-primary text-white rounded-full w-20 h-20 shadow-lg">
                      <LuHeart class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-primary">
                    Layanan Inklusif
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Dirancang khusus untuk mendukung penyandang disabilitas
                    dengan fitur aksesibilitas yang komprehensif.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-primary badge-lg gap-2">
                      <LuHeart class="w-4 h-4" />
                      Inklusif
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-secondary text-white rounded-full w-20 h-20 shadow-lg">
                      <LuBrain class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-secondary">
                    Dukungan Psikologis
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Terhubung dengan psikolog profesional untuk memberikan
                    dukungan kesehatan mental yang berkualitas.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-secondary badge-lg gap-2">
                      <LuBrain class="w-4 h-4" />
                      Profesional
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant group">
                <div class="card-body text-center p-8">
                  <div class="avatar placeholder mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div class="bg-accent text-white rounded-full w-20 h-20 shadow-lg">
                      <LuGlobe class="w-10 h-10" />
                    </div>
                  </div>
                  <h3 class="card-title text-xl mb-4 justify-center text-accent">
                    Kolaborasi Nasional
                  </h3>
                  <p class="text-base-content/70 leading-relaxed">
                    Mendukung program nasional untuk pemberdayaan penyandang
                    disabilitas dan pencapaian SDG's Indonesia.
                  </p>
                  <div class="card-actions justify-center mt-6">
                    <div class="badge badge-accent badge-lg gap-2">
                      <LuGlobe class="w-4 h-4" />
                      Nasional
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {!isLoggedIn.value && (
        <section class="py-20 bg-gradient-to-br from-base-200 to-base-300">
          <div class="container mx-auto px-4">
            <div class="text-center mb-16">
              <h2 class="text-responsive-lg font-bold text-gradient-primary mb-4">
                Apa Kata Mereka
              </h2>
              <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
                Testimoni dari kader posyandu dan psikolog yang telah
                menggunakan SIDIFA
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div class="card-elegant">
                <div class="card-body p-6">
                  <div class="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <LuStar
                        key={index}
                        class="w-4 h-4 text-warning fill-current"
                      />
                    ))}
                  </div>
                  <p class="text-base-content/70 italic mb-4">
                    "SIDIFA sangat membantu dalam mengelola data penyandang
                    disabilitas. Sistem yang user-friendly dan terintegrasi
                    dengan baik."
                  </p>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-primary text-white rounded-full w-10 h-10">
                        <span class="text-sm font-bold">S</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Siti Aminah</p>
                      <p class="text-xs text-base-content/60">
                        Kader Posyandu Bedali
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant">
                <div class="card-body p-6">
                  <div class="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <LuStar
                        key={index}
                        class="w-4 h-4 text-warning fill-current"
                      />
                    ))}
                  </div>
                  <p class="text-base-content/70 italic mb-4">
                    "Platform yang sangat inovatif untuk memberikan layanan
                    psikologis yang lebih terstruktur dan mudah diakses."
                  </p>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-secondary text-white rounded-full w-10 h-10">
                        <span class="text-sm font-bold">D</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Dr. Budi Santoso</p>
                      <p class="text-xs text-base-content/60">
                        Psikolog Klinis
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-elegant">
                <div class="card-body p-6">
                  <div class="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <LuStar
                        key={index}
                        class="w-4 h-4 text-warning fill-current"
                      />
                    ))}
                  </div>
                  <p class="text-base-content/70 italic mb-4">
                    "Efisiensi kerja meningkat signifikan. Laporan dan statistik
                    yang dihasilkan sangat membantu dalam evaluasi program."
                  </p>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-accent text-white rounded-full w-10 h-10">
                        <span class="text-sm font-bold">R</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-sm">Rina Kartika</p>
                      <p class="text-xs text-base-content/60">
                        Kader Posyandu Wonorejo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isLoggedIn.value && (
        <section class="py-20 bg-gradient-primary">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-responsive-lg font-bold mb-6">
              Bergabunglah dengan SIDIFA Sekarang
            </h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Mari bersama-sama mewujudkan layanan kesehatan yang inklusif dan
              pemberdayaan penyandang disabilitas yang lebih baik.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup/posyandu"
                class="btn btn-secondary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <LuStethoscope class="w-5 h-5" />
                Daftar sebagai Posyandu
              </a>
              <a
                href="/auth/signup/psikolog"
                class="btn btn-accent btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <LuBrain class="w-5 h-5" />
                Daftar sebagai Psikolog
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: "SIDIFA - Sistem Informasi Digital Posyandu dan Psikolog",
  meta: [
    {
      name: "description",
      content:
        "Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu Disabilitas dan Pemberdayaan Sosial Masyarakat",
    },
    {
      name: "keywords",
      content:
        "posyandu, disabilitas, psikolog, kesehatan, inklusif, pemberdayaan",
    },
  ],
};
