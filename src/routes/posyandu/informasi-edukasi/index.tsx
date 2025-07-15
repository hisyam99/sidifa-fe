import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const articles = [
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

  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">Informasi & Edukasi</h1>
      <p class="mb-6">
        Kumpulan artikel, panduan, dan materi edukasi untuk Anda.
      </p>

      <div class="mb-6">
        <input
          type="text"
          placeholder="Cari artikel atau panduan..."
          class="input input-bordered w-full max-w-sm"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.title}
            class="card bg-base-100 shadow-xl image-full"
          >
            <figure>
              <img
                src={article.image}
                alt={article.title}
                width="400"
                height="250"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">{article.title}</h2>
              <p>{article.excerpt}</p>
              <div class="card-actions justify-end">
                <div class="badge badge-outline">{article.category}</div>
                <button class="btn btn-primary">Baca Selengkapnya</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Informasi & Edukasi - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Informasi dan Edukasi untuk Kader Posyandu Si-DIFA",
    },
  ],
};
