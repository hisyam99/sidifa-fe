import { component$ } from "@builder.io/qwik";
import {
  LuBarChart,
  LuBookOpen,
  LuBriefcase,
  LuClipboardList,
} from "~/components/icons/lucide-optimized";

export const Features = component$(() => {
  const items = [
    {
      icon: LuClipboardList,
      title: "Pendataan IBK",
      desc: "Form terstruktur, data terpusat, akses real‑time.",
    },
    {
      icon: LuBookOpen,
      title: "Informasi & Edukasi",
      desc: "Artikel hak disabilitas, kesehatan & pendidikan.",
    },
    {
      icon: LuBriefcase,
      title: "Lowongan Kerja",
      desc: "Pekerjaan ramah disabilitas & kontak langsung.",
    },
    {
      icon: LuBarChart,
      title: "Laporan & Statistik",
      desc: "Grafik ringkas, ekspor untuk kebijakan.",
    },
  ];
  return (
    <section id="fitur" class="py-14 lg:py-20" data-animate="section">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-3">
            Fitur Utama
          </h2>
          <p class="text-base-content/70">
            Dirancang untuk kebutuhan posyandu disabilitas dan ekosistem inklusi
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              class="card bg-base-100 shadow-md hover:shadow-xl transition"
              data-animate="feature"
            >
              <div class="card-body">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <Icon class="w-6 h-6" />
                </div>
                <h3 class="card-title">{title}</h3>
                <p class="text-base-content/70">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
