import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  LuArrowRight,
  LuBarChart,
  LuBookOpen,
  LuClipboardList,
  LuYoutube,
} from "~/components/icons/lucide-optimized";
import AboutImg from "~/media/home/section-2.png?jsx";

export const About = component$(() => {
  return (
    <section
      id="tentang"
      class="py-16 lg:py-24 bg-base-200/60"
      data-animate="section"
    >
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 class="text-3xl lg:text-5xl font-extrabold leading-tight text-gradient-primary mb-4 text-base-content">
              Tentang SI-DIFA
            </h2>
            <p class="text-base-content text-lg leading-relaxed mb-6">
              SI-DIFA adalah portal sederhana dan modern untuk mendukung layanan
              Posyandu Disabilitas: pendataan IBK terpusat, akses materi
              inklusi, publikasi lowongan kerja ramah disabilitas, serta laporan
              statistik ringkas.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                  <LuClipboardList class="w-4 h-4" />
                </span>
                <div>
                  <p class="font-semibold leading-tight text-base-content">
                    Pendataan Terpusat
                  </p>
                  <p class="text-sm text-base-content/80">
                    Form IBK terstruktur, aman, dan mudah ditelusuri.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                  <LuBookOpen class="w-4 h-4" />
                </span>
                <div>
                  <p class="font-semibold leading-tight text-base-content">
                    Edukasi Inklusi
                  </p>
                  <p class="text-sm text-base-content/80">
                    Materi ringkas untuk kader dan tenaga profesional.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                  <LuBarChart class="w-4 h-4" />
                </span>
                <div>
                  <p class="font-semibold leading-tight text-base-content">
                    Statistik & Laporan
                  </p>
                  <p class="text-sm text-base-content/80">
                    Grafik ringkas dan siap ekspor untuk pengambilan kebijakan.
                  </p>
                </div>
              </li>
            </ul>
            <div class="flex flex-wrap items-center gap-3">
              <Link href="#fitur" class="btn btn-primary gap-2">
                Jelajahi Fitur <LuArrowRight class="w-5 h-5" />
              </Link>
              <Link
                href="https://youtube.com/@lingkarsosialindonesia"
                target="_blank"
                rel="noopener"
                class="btn btn-ghost gap-2"
              >
                <LuYoutube class="w-5 h-5" /> LINKSOS
              </Link>
            </div>
          </div>
          <div>
            <div class="rounded-2xl overflow-hidden shadow-lg border bg-base-100">
              <AboutImg alt="Ilustrasi fitur inti SI-DIFA untuk kader dan instansi" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
