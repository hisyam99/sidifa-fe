import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  LuHelpCircle,
  LuUsers,
  LuStethoscope,
  LuSmartphone,
  LuMessageSquare,
  LuSearch,
} from "@qwikest/icons/lucide";

interface QAItem {
  pertanyaan: string;
  jawaban: string;
}

interface FAQCategory {
  judul: string;
  icon: any;
  qa: QAItem[];
  bgColor: string;
  iconColor: string;
}

export default component$(() => {
  const faqCategories: FAQCategory[] = [
    {
      judul: "Disabilitas & Praktik Lapangan",
      icon: LuUsers,
      bgColor: "bg-primary/5",
      iconColor: "text-primary",
      qa: [
        {
          pertanyaan:
            "Apa perbedaan antara keterlambatan perkembangan dan disabilitas?",
          jawaban:
            "Keterlambatan bisa bersifat sementara dan membaik dengan stimulasi, sedangkan disabilitas adalah kondisi jangka panjang yang membutuhkan intervensi khusus. Keterlambatan perkembangan biasanya dapat diperbaiki dengan stimulus yang tepat, sedangkan disabilitas memerlukan pendekatan jangka panjang dengan terapi dan dukungan berkelanjutan.",
        },
        {
          pertanyaan:
            "Bagaimana cara mengenali anak dengan disabilitas sejak dini?",
          jawaban:
            "Amati tanda keterlambatan perkembangan seperti terlambat bicara, berjalan, interaksi sosial yang terbatas, dan bandingkan dengan tahap tumbuh kembang sesuai usianya. Perhatikan juga respons anak terhadap rangsangan, kemampuan komunikasi, dan pola perilaku yang tidak sesuai dengan milestone perkembangan normal.",
        },
        {
          pertanyaan: "Apakah disabilitas bisa disembuhkan?",
          jawaban:
            "Tidak selalu bisa disembuhkan, tetapi banyak kondisi yang bisa dikembangkan dan ditingkatkan melalui terapi yang tepat, intervensi dini, dan dukungan keluarga yang konsisten. Yang terpenting adalah memberikan dukungan untuk memaksimalkan potensi dan kemandirian anak.",
        },
        {
          pertanyaan:
            "Apa saja jenis-jenis disabilitas yang perlu diketahui kader?",
          jawaban:
            "Ada 4 jenis utama: (1) Disabilitas Fisik - gangguan fungsi gerak dan mobilitas, (2) Disabilitas Intelektual - keterbatasan fungsi kognitif dan adaptif, (3) Disabilitas Mental - gangguan fungsi psikis dan emosional, (4) Disabilitas Sensorik - gangguan pendengaran, penglihatan, atau komunikasi.",
        },
        {
          pertanyaan:
            "Bagaimana menangani stigma masyarakat terhadap anak disabilitas?",
          jawaban:
            "Lakukan edukasi kepada masyarakat secara bertahap, berikan contoh nyata prestasi penyandang disabilitas, libatkan tokoh masyarakat, dan ciptakan program inklusif yang melibatkan semua anak. Penting juga untuk memberikan informasi yang benar tentang disabilitas dan kemampuan yang dimiliki anak-anak tersebut.",
        },
      ],
    },
    {
      judul: "Kader & Peran Posyandu",
      icon: LuStethoscope,
      bgColor: "bg-secondary/5",
      iconColor: "text-secondary",
      qa: [
        {
          pertanyaan: "Apa peran kader dalam menangani anak disabilitas?",
          jawaban:
            "Kader berperan dalam deteksi dini, pemantauan perkembangan rutin, edukasi keluarga tentang stimulasi yang tepat, dan rujukan ke layanan yang sesuai. Kader juga menjadi jembatan antara keluarga dengan tenaga kesehatan profesional.",
        },
        {
          pertanyaan:
            "Bagaimana cara mencatat perkembangan anak disabilitas yang benar?",
          jawaban:
            "Gunakan form perkembangan dan riwayat kunjungan dalam aplikasi SIDIFA, catat setiap perubahan perilaku, kemampuan baru yang muncul, respons terhadap terapi, dan interaksi sosial. Dokumentasikan secara objektif dan berkala.",
        },
        {
          pertanyaan:
            "Bagaimana menghadapi orang tua yang menyangkal kondisi anaknya?",
          jawaban:
            "Lakukan pendekatan empatik dan tidak menghakimi, berikan contoh konkret perkembangan anak, ajak bicara secara perlahan dengan bahasa yang mudah dipahami, dan libatkan keluarga lain yang memiliki pengalaman serupa untuk berbagi cerita.",
        },
        {
          pertanyaan:
            "Kapan harus merujuk anak ke psikolog atau dokter spesialis?",
          jawaban:
            "Rujuk ketika: (1) Ada keterlambatan signifikan dalam 2 atau lebih area perkembangan, (2) Tidak ada perbaikan setelah stimulasi rutin 3-6 bulan, (3) Muncul perilaku yang mengkhawatirkan, (4) Keluarga membutuhkan konseling intensif, (5) Diperlukan asesmen mendalam untuk diagnosa.",
        },
        {
          pertanyaan: "Bagaimana cara melakukan stimulasi dini yang efektif?",
          jawaban:
            "Sesuaikan dengan usia dan kemampuan anak, lakukan secara rutin dan konsisten, gunakan permainan yang menyenangkan, libatkan keluarga dalam proses stimulasi, dan evaluasi perkembangan secara berkala. Pastikan stimulasi dilakukan dalam suasana yang nyaman dan tidak memaksa.",
        },
      ],
    },
    {
      judul: "Teknis Aplikasi SIDIFA",
      icon: LuSmartphone,
      bgColor: "bg-accent/5",
      iconColor: "text-accent",
      qa: [
        {
          pertanyaan: "Bagaimana jika saya lupa input kunjungan bulanan?",
          jawaban:
            "Anda masih bisa menginput data kunjungan hingga 2 minggu setelah tanggal kegiatan posyandu berlangsung. Setelah itu, hubungi admin kecamatan untuk bantuan input data dengan alasan yang jelas.",
        },
        {
          pertanyaan: "Apakah data yang saya masukkan bisa diedit ulang?",
          jawaban:
            "Ya, data bisa diedit selama belum dikunci oleh admin kecamatan. Edit tersedia di menu 'Riwayat Kunjungan' dengan klik tombol edit pada data yang ingin diubah. Setelah dikunci, perubahan hanya bisa dilakukan oleh admin.",
        },
        {
          pertanyaan: "Bagaimana cara backup data agar tidak hilang?",
          jawaban:
            "Sistem otomatis melakukan backup data setiap hari. Anda juga bisa export data dalam format PDF atau Excel melalui menu 'Laporan' untuk backup manual. Pastikan koneksi internet stabil saat input data untuk mencegah kehilangan data.",
        },
        {
          pertanyaan:
            "Aplikasi error atau tidak bisa dibuka, bagaimana solusinya?",
          jawaban:
            "Coba langkah berikut: (1) Refresh halaman/tutup buka aplikasi, (2) Periksa koneksi internet, (3) Clear cache browser, (4) Coba browser lain, (5) Jika masih bermasalah, hubungi admin teknis dengan melampirkan screenshot error.",
        },
        {
          pertanyaan: "Bagaimana cara menggunakan fitur pencarian data IBK?",
          jawaban:
            "Gunakan fitur 'Cari IBK' di halaman Pendataan IBK. Anda bisa mencari berdasarkan nama lengkap atau NIK. Gunakan kata kunci yang spesifik untuk hasil yang lebih akurat. Data yang muncul sesuai dengan wilayah kerja Anda.",
        },
        {
          pertanyaan: "Siapa yang bisa mengakses data yang saya input?",
          jawaban:
            "Data dapat diakses oleh: (1) Kader yang menginput, (2) Koordinator posyandu, (3) Admin kecamatan/kabupaten, (4) Psikolog yang dirujuk. Semua akses dicatat dalam log sistem untuk keamanan data.",
        },
      ],
    },
  ];

  return (
    <main class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      {/* Hero Section */}
      <section class="relative py-16 lg:py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12 animate-fade-in-up">
            <div class="bg-gradient-primary rounded-full w-20 h-20 lg:w-24 lg:h-24 shadow-xl mx-auto mb-6 flex items-center justify-center">
              <LuHelpCircle class="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold text-gradient-primary mb-4">
              Tanya Jawab (FAQ)
            </h1>
            <p class="text-lg lg:text-xl text-base-content/70 max-w-3xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar disabilitas, peran
              kader, dan penggunaan aplikasi SIDIFA
            </p>
          </div>

          {/* Search Box */}
          <div class="max-w-2xl mx-auto mb-12">
            <div class="relative">
              <LuSearch class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Cari pertanyaan yang ingin dijawab..."
                class="input input-bordered w-full pl-12 pr-4 py-3 text-lg shadow-lg focus:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div class="max-w-5xl mx-auto space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                class={`card ${category.bgColor} shadow-lg border border-base-200/50 animate-fade-in-up`}
                style={`animation-delay: ${categoryIndex * 200}ms`}
              >
                <div class="card-body p-6">
                  {/* Category Header */}
                  <div class="flex items-center gap-4 mb-6">
                    <div
                      class={`w-12 h-12 rounded-xl ${category.bgColor} border border-current/20 flex items-center justify-center`}
                    >
                      <category.icon class={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <h2 class="text-2xl font-bold text-base-content">
                      {category.judul}
                    </h2>
                  </div>

                  {/* Questions & Answers */}
                  <div class="space-y-4">
                    {category.qa.map((item, qaIndex) => (
                      <div
                        key={qaIndex}
                        class="collapse collapse-plus bg-base-100 shadow-sm border border-base-200/50 rounded-lg"
                      >
                        <input type="checkbox" class="peer" />
                        <div class="collapse-title text-lg font-semibold text-base-content peer-checked:text-primary peer-checked:bg-primary/5 transition-colors duration-200">
                          <div class="flex items-center gap-3">
                            <LuMessageSquare class="w-5 h-5 text-primary/70" />
                            {item.pertanyaan}
                          </div>
                        </div>
                        <div class="collapse-content bg-base-50 text-base-content/80">
                          <div class="pt-4 pb-2">
                            <p class="text-base leading-relaxed">
                              {item.jawaban}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div class="max-w-3xl mx-auto mt-16">
            <div class="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border border-primary/20">
              <div class="card-body text-center p-8">
                <h3 class="text-2xl font-bold text-base-content mb-4">
                  Tidak Menemukan Jawaban yang Anda Cari?
                </h3>
                <p class="text-base-content/70 mb-6 text-lg">
                  Tim support kami siap membantu Anda. Hubungi kami melalui
                  kontak di bawah ini atau kirim pertanyaan langsung melalui
                  sistem.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-base-100 rounded-lg p-4 shadow-sm">
                    <h4 class="font-semibold text-base-content mb-2">
                      Admin Teknis
                    </h4>
                    <p class="text-sm text-base-content/70">
                      Email: support@sidifa.id
                    </p>
                    <p class="text-sm text-base-content/70">
                      WhatsApp: +62 812-3456-7890
                    </p>
                  </div>
                  <div class="bg-base-100 rounded-lg p-4 shadow-sm">
                    <h4 class="font-semibold text-base-content mb-2">
                      Admin Kesehatan
                    </h4>
                    <p class="text-sm text-base-content/70">
                      Email: kesehatan@sidifa.id
                    </p>
                    <p class="text-sm text-base-content/70">
                      WhatsApp: +62 813-4567-8901
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "FAQ - Tanya Jawab | SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Tanya jawab seputar disabilitas, peran kader posyandu, dan penggunaan aplikasi SIDIFA. Temukan jawaban untuk pertanyaan umum Anda.",
    },
    {
      property: "og:title",
      content: "FAQ - Tanya Jawab | SIDIFA",
    },
    {
      property: "og:description",
      content:
        "Tanya jawab seputar disabilitas, peran kader posyandu, dan penggunaan aplikasi SIDIFA.",
    },
  ],
};
