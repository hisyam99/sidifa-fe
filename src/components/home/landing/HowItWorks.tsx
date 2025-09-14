import { component$ } from "@qwik.dev/core";
import {
  LuBarChart,
  LuBookOpen,
  LuBriefcase,
  LuClipboardList,
} from "~/components/icons/lucide-optimized";

export const HowItWorks = component$(() => {
  const steps = [
    {
      icon: LuClipboardList,
      title: "1. Input Data",
      desc: "Kader mengisi data IBK saat layanan berlangsung.",
    },
    {
      icon: LuBookOpen,
      title: "2. Edukasi",
      desc: "Kader akses materi inklusi & panduan layanan.",
    },
    {
      icon: LuBriefcase,
      title: "3. Peluang Kerja",
      desc: "Publikasi lowongan ramah disabilitas.",
    },
    {
      icon: LuBarChart,
      title: "4. Laporan",
      desc: "Data tersaji dalam grafik & siap diekspor.",
    },
  ];
  return (
    <section
      id="cara-kerja"
      class="py-14 lg:py-20 bg-base-200/60"
      data-animate="section"
    >
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10">
          <h2 class="text-3xl lg:text-4xl font-bold mb-3">Cara Kerja</h2>
          <p class="text-base-content/70">
            Langkah sederhana untuk alur layanan di posyandu disabilitas
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }) => (
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
