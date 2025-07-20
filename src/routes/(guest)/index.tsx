import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  WelcomeCard,
  SignupCards,
  StatisticCard,
  HomeFeatureCard,
  TestimonialCard,
  FAQItem,
} from "~/components/home";
import { useAuth } from "~/hooks";
import {
  LuHeart,
  LuLogIn,
  LuArrowRight,
  LuUsers,
  LuShield,
  LuBrain,
  LuBarChart,
  LuTrendingUp,
  LuGlobe,
  LuStethoscope,
} from "~/components/icons/lucide-optimized"; // Changed import source
import { SectionHeader, AnimatedBackground } from "~/components/common";

export default component$(() => {
  const { isLoggedIn, user } = useAuth();

  const testimonialsData = [
    {
      quote:
        "SIDIFA mengubah cara kami mengelola data posyandu. Sangat mudah digunakan dan informasinya akurat. Rekomendasi tinggi!",
      name: "Ani Suryani",
      role: "Kader Posyandu Maju",
      stars: 5,
    },
    {
      quote:
        "Sebagai psikolog, SIDIFA membantu saya menjangkau lebih banyak klien disabilitas dan memberikan konseling yang terorganisasi. Fitur rekam medisnya sangat membantu.",
      name: "Dr. Budi Santoso, Psikolog",
      role: "Psikolog Praktisi",
      stars: 5,
    },
    {
      quote:
        "Saya senang sekali dengan SIDIFA. Anak saya yang disabilitas mendapatkan layanan kesehatan yang lebih baik dan saya bisa mendapatkan dukungan psikologis. Hidup kami jadi lebih mudah!",
      name: "Citra Dewi",
      role: "Orang Tua Penyandang Disabilitas",
      stars: 5,
    },
  ];

  const faqData = [
    {
      question: "Apa itu SIDIFA?",
      answer:
        "SIDIFA adalah Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu Disabilitas dan Pemberdayaan Sosial Masyarakat. Platform ini bertujuan untuk mengintegrasikan data kesehatan dan layanan konseling bagi penyandang disabilitas.",
    },
    {
      question: "Siapa saja yang dapat menggunakan SIDIFA?",
      answer:
        "SIDIFA dirancang untuk kader posyandu, psikolog, dan penyandang disabilitas beserta keluarganya.",
    },
    {
      question: "Bagaimana SIDIFA meningkatkan layanan posyandu?",
      answer:
        "SIDIFA menyediakan fitur pengelolaan data kesehatan yang terintegrasi, penjadwalan konseling, dan akses ke rekam medis digital, sehingga meningkatkan efisiensi dan kualitas layanan.",
    },
    {
      question: "Apakah data pengguna aman di SIDIFA?",
      answer:
        "Ya, keamanan data adalah prioritas utama kami. SIDIFA menggunakan teknologi enkripsi terkini dan mematuhi standar privasi data yang ketat untuk melindungi informasi pengguna.",
    },
    {
      question: "Apakah SIDIFA tersedia secara gratis?",
      answer:
        "SIDIFA menawarkan berbagai paket layanan, termasuk opsi gratis untuk fitur dasar dan paket premium dengan fitur yang lebih lengkap untuk kebutuhan profesional.",
    },
  ];

  return (
    <main class="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

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
          <SectionHeader
            title="Dampak Positif SIDIFA"
            description="Berikut adalah pencapaian dan dampak positif dari implementasi sistem SIDIFA"
          />

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <StatisticCard
              icon={LuUsers}
              value="500+"
              description="Penyandang Disabilitas"
              iconBgGradientClass="bg-gradient-primary"
              valueTextColorClass="text-gradient-primary"
              title="Penyandang Disabilitas"
            />
            <StatisticCard
              icon={LuHeart}
              value="4"
              description="Posyandu Aktif"
              iconBgGradientClass="bg-gradient-secondary"
              valueTextColorClass="text-gradient-secondary"
              title="Posyandu Aktif"
            />
            <StatisticCard
              icon={LuBrain}
              value="100+"
              description="Kader Terlatih"
              iconBgGradientClass="bg-gradient-accent"
              valueTextColorClass="text-gradient-accent"
              title="Kader Terlatih"
            />
            <StatisticCard
              icon={LuTrendingUp}
              value="70%"
              description="Peningkatan Efisiensi"
              iconBgGradientClass="bg-primary"
              valueTextColorClass="text-primary"
              title="Peningkatan Efisiensi"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <SectionHeader
            title="Fitur Unggulan"
            description="Mengapa memilih SIDIFA? Platform kami dirancang khusus untuk memenuhi kebutuhan layanan kesehatan inklusif dan pemberdayaan penyandang disabilitas."
          />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <HomeFeatureCard
              icon={LuBarChart}
              title="Data Terintegrasi"
              description="Kelola data kesehatan masyarakat dengan sistem yang terintegrasi, aman, dan mudah diakses oleh semua pihak terkait."
              iconBgGradientClass="bg-gradient-primary"
              titleTextColorClass="text-gradient-primary"
              badgeText="Real-time"
            />
            <HomeFeatureCard
              icon={LuShield}
              title="Keamanan Data"
              description="Prioritas utama kami adalah menjaga keamanan dan kerahasiaan data pribadi pengguna dengan teknologi enkripsi canggih."
              iconBgGradientClass="bg-gradient-secondary"
              titleTextColorClass="text-gradient-secondary"
              badgeText="Terlindungi"
            />
            <HomeFeatureCard
              icon={LuGlobe}
              title="Akses Universal"
              description="SIDIFA dirancang agar mudah diakses oleh semua orang, termasuk penyandang disabilitas, dengan antarmuka yang intuitif."
              iconBgGradientClass="bg-gradient-accent"
              titleTextColorClass="text-gradient-accent"
              badgeText="Inklusif"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <SectionHeader
            title="Apa Kata Mereka?"
            description="Dengarkan pengalaman nyata dari pengguna SIDIFA yang telah merasakan manfaatnya."
          />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                stars={testimonial.stars}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action (CTA) Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4 text-center">
          <div class="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl p-8 lg:p-12 animate-fade-in-up">
            <h2 class="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              Bergabunglah dengan SIDIFA Sekarang!
            </h2>
            <p class="text-lg lg:text-xl opacity-90 mb-8 mx-auto max-w-3xl">
              Mulai tingkatkan layanan kesehatan dan dukungan untuk penyandang
              disabilitas dengan platform terdepan kami.
            </p>
            <a
              href="/auth/signup/kader"
              class="btn btn-secondary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <LuStethoscope class="w-5 h-5" />
              Daftar Sebagai Kader Posyandu
              <LuArrowRight class="w-5 h-5" />
            </a>
            <a
              href="/auth/signup/psikolog"
              class="btn btn-accent btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-4 md:mt-0 md:ml-4"
            >
              <LuBrain class="w-5 h-5" />
              Daftar Sebagai Psikolog
              <LuArrowRight class="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section class="py-16 lg:py-20 relative z-10">
        <div class="container mx-auto px-4">
          <SectionHeader
            title="Pertanyaan yang Sering Diajukan"
            description="Temukan jawaban atas pertanyaan umum tentang SIDIFA."
          />

          <div class="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Selamat Datang di SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Platform terpadu untuk mengelola data kesehatan masyarakat dan memberikan layanan konseling yang terintegrasi untuk penyandang disabilitas.",
    },
  ],
};
