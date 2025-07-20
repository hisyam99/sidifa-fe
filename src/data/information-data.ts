export interface ArticleItem { // Export the interface
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content?: string; // Optional: for full article content
}

export const articlesData: ArticleItem[] = [
  {
    title: "Memahami Tumbuh Kembang Anak dengan Autisme",
    category: "Panduan Orang Tua",
    image:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
    excerpt:
      "Panduan praktis bagi orang tua dan kader dalam mendampingi tumbuh kembang anak dengan spektrum autisme.",
  },
  {
    title: "Tips Komunikasi Efektif dengan Anak Tuna Rungu",
    category: "Komunikasi",
    image:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
    excerpt:
      "Pelajari cara membangun komunikasi yang hangat dan efektif dengan anak yang memiliki hambatan pendengaran.",
  },
  {
    title: "Menciptakan Lingkungan Ramah Disabilitas di Rumah",
    category: "Lingkungan Inklusif",
    image:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
    excerpt:
      "Beberapa penyesuaian sederhana di rumah yang dapat sangat membantu kemandirian individu berkebutuhan khusus.",
  },
  {
    title: "Hak-Hak Penyandang Disabilitas di Indonesia",
    category: "Advokasi",
    image:
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
    excerpt:
      "Pahami hak-hak dasar yang dimiliki oleh penyandang disabilitas sesuai dengan peraturan yang berlaku.",
  },
];
