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

  // Create stars array for testimonials
  const stars = Array.from({ length: 5 }, (_, i) => `star-${i}`);

  return (
    <main class="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Floating Elements */}
      <div class="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div
        class="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float"
        style="animation-delay: 2s;"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float"
        style="animation-delay: 4s;"
      ></div>

      {/* Hero Section */}
      <section class="relative z-10 py-12 lg:py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16 animate-fade-in-up">
            <div class="bg-gradient-primary rounded-full w-24 h-24 lg:w-32 lg:h-32 shadow-2xl mx-auto mb-8 flex items-center justify-center">
              <LuHeart class="w-12 h-12 lg:w-16 lg:h-16" />
            </div>
            <h1 class="text-4xl lg:text-6xl xl:text-7xl font-bold text-gradient-primary mb-6 leading-tight">
              Selamat Datang di{" "}
              <span class="text-gradient-secondary">SIDIFA</span>
            </h1>
            <p class="text-lg lg:text-xl text-base-content/70 mb-6 mx-auto max-w-4xl leading-relaxed">
              Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu
              Disabilitas dan Pemberdayaan Sosial Masyarakat
            </p>
            <p class="text-base lg:text-lg text-base-content/60 mx-auto max-w-3xl leading-relaxed">
              Platform terpadu yang menghubungkan kader posyandu, psikolog, dan
              penyandang disabilitas untuk memberikan layanan kesehatan dan
              dukungan psikologis yang inklusif dan berkualitas.
            </p>
          </div>

          {isLoggedIn.value ? (
            <div class="mx-auto animate-slide-in-right">
              <WelcomeCard
                userName={user.value?.email || ""}
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
                    class="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <LuLogIn class="w-5 h-5" />
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
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-8 lg:p-12">
              <div class="text-center mb-12">
                <h2 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-4">
                  Dampak Positif SIDIFA
                </h2>
                <p class="text-lg text-base-content/70 mx-auto max-w-2xl">
                  Berikut adalah pencapaian dan dampak positif dari implementasi
                  sistem SIDIFA
                </p>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                <div class="text-center p-6 bg-base-200/50">
                  <div class="bg-gradient-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <LuUsers class="w-8 h-8" />
                  </div>
                  <h3 class="text-3xl font-bold text-gradient-primary mb-2">
                    500+
                  </h3>
                  <p class="text-base-content/70 text-sm">
                    Penyandang Disabilitas
                  </p>
                </div>

                <div class="text-center p-6 bg-base-200/50">
                  <div class="bg-gradient-secondary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <LuHeart class="w-8 h-8" />
                  </div>
                  <h3 class="text-3xl font-bold text-gradient-secondary mb-2">
                    4
                  </h3>
                  <p class="text-base-content/70 text-sm">Posyandu Aktif</p>
                </div>

                <div class="text-center p-6 bg-base-200/50">
                  <div class="bg-gradient-accent rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <LuBrain class="w-8 h-8" />
                  </div>
                  <h3 class="text-3xl font-bold text-gradient-accent mb-2">
                    100+
                  </h3>
                  <p class="text-base-content/70 text-sm">Kader Terlatih</p>
                </div>

                <div class="text-center p-6 bg-base-200/50">
                  <div class="bg-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <LuTrendingUp class="w-8 h-8" />
                  </div>
                  <h3 class="text-3xl font-bold text-primary mb-2">70%</h3>
                  <p class="text-base-content/70 text-sm">
                    Peningkatan Efisiensi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-4">
              Fitur Unggulan
            </h2>
            <p class="text-lg text-base-content/70 mx-auto max-w-2xl">
              Mengapa memilih SIDIFA? Platform kami dirancang khusus untuk
              memenuhi kebutuhan layanan kesehatan inklusif dan pemberdayaan
              penyandang disabilitas.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuBarChart class="w-10 h-10" />
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

            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-gradient-secondary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuShield class="w-10 h-10" />
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

            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-secondary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuBrain class="w-10 h-10" />
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

            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-accent rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuGlobe class="w-10 h-10" />
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

            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuZap class="w-10 h-10" />
                </div>
                <h3 class="card-title text-xl mb-4 justify-center text-primary">
                  Akses Cepat
                </h3>
                <p class="text-base-content/70 leading-relaxed">
                  Antarmuka yang intuitif dan responsif, memastikan akses mudah
                  dari berbagai perangkat dan lokasi.
                </p>
                <div class="card-actions justify-center mt-6">
                  <div class="badge badge-primary badge-lg gap-2">
                    <LuZap class="w-4 h-4" />
                    Responsif
                  </div>
                </div>
              </div>
            </div>

            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div class="card-body text-center p-8">
                <div class="bg-success rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LuHeart class="w-10 h-10" />
                </div>
                <h3 class="card-title text-xl mb-4 justify-center text-success">
                  Layanan Inklusif
                </h3>
                <p class="text-base-content/70 leading-relaxed">
                  Dirancang khusus untuk memenuhi kebutuhan penyandang
                  disabilitas dengan aksesibilitas yang optimal.
                </p>
                <div class="card-actions justify-center mt-6">
                  <div class="badge badge-success badge-lg gap-2">
                    <LuHeart class="w-4 h-4" />
                    Inklusif
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body p-8 lg:p-12">
              <div class="text-center mb-16">
                <h2 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-4">
                  Apa Kata Mereka
                </h2>
                <p class="text-lg text-base-content/70 mx-auto max-w-2xl">
                  Testimoni dari kader posyandu dan psikolog yang telah
                  menggunakan SIDIFA
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div class="card bg-base-200/50 hover:shadow-lg transition-all duration-300">
                  <div class="card-body p-6">
                    <div class="flex items-center gap-2 mb-4">
                      {stars.map((starId) => (
                        <LuStar
                          key={starId}
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
                      <div class="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                        <span class="text-sm font-bold">S</span>
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

                <div class="card bg-base-200/50 hover:shadow-lg transition-all duration-300">
                  <div class="card-body p-6">
                    <div class="flex items-center gap-2 mb-4">
                      {stars.map((starId) => (
                        <LuStar
                          key={starId}
                          class="w-4 h-4 text-warning fill-current"
                        />
                      ))}
                    </div>
                    <p class="text-base-content/70 italic mb-4">
                      "Platform yang sangat inovatif untuk memberikan layanan
                      psikologis yang lebih terstruktur dan mudah diakses."
                    </p>
                    <div class="flex items-center gap-3">
                      <div class="bg-secondary rounded-full w-10 h-10 flex items-center justify-center">
                        <span class="text-sm font-bold">D</span>
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

                <div class="card bg-base-200/50 hover:shadow-lg transition-all duration-300">
                  <div class="card-body p-6">
                    <div class="flex items-center gap-2 mb-4">
                      {stars.map((starId) => (
                        <LuStar
                          key={starId}
                          class="w-4 h-4 text-warning fill-current"
                        />
                      ))}
                    </div>
                    <p class="text-base-content/70 italic mb-4">
                      "Efisiensi kerja meningkat signifikan. Laporan dan
                      statistik yang dihasilkan sangat membantu dalam evaluasi
                      program."
                    </p>
                    <div class="flex items-center gap-3">
                      <div class="bg-accent rounded-full w-10 h-10 flex items-center justify-center">
                        <span class="text-sm font-bold">R</span>
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <div class="card bg-gradient-primary shadow-xl">
            <div class="card-body p-8 lg:p-12 text-center">
              <h2 class="text-3xl lg:text-4xl font-bold mb-6 ">
                Bergabunglah dengan SIDIFA Sekarang
              </h2>
              <p class="text-xl mb-8 /90 max-w-2xl mx-auto">
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
          </div>
        </div>
      </section>
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
