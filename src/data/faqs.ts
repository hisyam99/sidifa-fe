import { Component, SVGProps } from "@builder.io/qwik";
import {
  LuUsers,
  LuStethoscope,
  LuSmartphone,
  LuHelpCircle,
} from "~/components/icons/lucide-optimized"; // Changed import source

interface QAItem {
  pertanyaan: string;
  jawaban: string;
}

export interface FAQCategory {
  judul: string;
  icon: Component<SVGProps<SVGSVGElement>>; // Corrected type for the icon component
  bgColor: string;
  iconColor: string;
  qa: QAItem[];
}

export const faqCategories: FAQCategory[] = [
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
      // FAQ from src/routes/(guest)/index.tsx
      {
        pertanyaan: "Apa itu SIDIFA?",
        jawaban:
          "SIDIFA adalah Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu Disabilitas dan Pemberdayaan Sosial Masyarakat. Platform ini bertujuan untuk mengintegrasikan data kesehatan dan layanan konseling bagi penyandang disabilitas.",
      },
      {
        pertanyaan: "Siapa saja yang dapat menggunakan SIDIFA?",
        jawaban:
          "SIDIFA dirancang untuk kader posyandu, psikolog, dan penyandang disabilitas beserta keluarganya.",
      },
      {
        pertanyaan: "Bagaimana SIDIFA meningkatkan layanan posyandu?",
        jawaban:
          "SIDIFA menyediakan fitur pengelolaan data kesehatan yang terintegrasi, penjadwalan konseling, dan akses ke rekam medis digital, sehingga meningkatkan efisiensi dan kualitas layanan.",
      },
      {
        pertanyaan: "Apakah data pengguna aman di SIDIFA?",
        jawaban:
          "Ya, keamanan data adalah prioritas utama kami. SIDIFA menggunakan teknologi enkripsi terkini dan mematuhi standar privasi data yang ketat untuk melindungi informasi pengguna.",
      },
      {
        pertanyaan: "Apakah SIDIFA tersedia secara gratis?",
        jawaban:
          "Ya. SIDIFA sepenuhnya gratis untuk digunakan. Tidak ada paket berbayar atau biaya langganan.",
      },
    ],
  },
  {
    judul: "Umum",
    icon: LuHelpCircle,
    bgColor: "bg-info/5",
    iconColor: "text-info",
    qa: [
      {
        pertanyaan: "Apa itu SIDIFA?",
        jawaban:
          "SIDIFA adalah Sistem Informasi Digital untuk Meningkatkan Layanan Posyandu Disabilitas dan Pemberdayaan Sosial Masyarakat. Platform ini bertujuan untuk mengintegrasikan data kesehatan dan layanan konseling bagi penyandang disabilitas.",
      },
      {
        pertanyaan: "Siapa saja yang dapat menggunakan SIDIFA?",
        jawaban:
          "SIDIFA dirancang untuk kader posyandu, psikolog, dan penyandang disabilitas beserta keluarganya.",
      },
      {
        pertanyaan: "Bagaimana SIDIFA meningkatkan layanan posyandu?",
        jawaban:
          "SIDIFA menyediakan fitur pengelolaan data kesehatan yang terintegrasi, penjadwalan konseling, dan akses ke rekam medis digital, sehingga meningkatkan efisiensi dan kualitas layanan.",
      },
      {
        pertanyaan: "Apakah data pengguna aman di SIDIFA?",
        jawaban:
          "Ya, keamanan data adalah prioritas utama kami. SIDIFA menggunakan teknologi enkripsi terkini dan mematuhi standar privasi data yang ketat untuk melindungi informasi pengguna.",
      },
      {
        pertanyaan: "Apakah SIDIFA tersedia secara gratis?",
        jawaban:
          "Ya. SIDIFA sepenuhnya gratis untuk digunakan. Tidak ada paket berbayar atau biaya langganan.",
      },
    ],
  },
];
