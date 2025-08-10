import { component$ } from "@builder.io/qwik";
import {
  LuArrowRight,
  LuYoutube,
  LuZap,
} from "~/components/icons/lucide-optimized";
import ImageHero from "~/media/home/section-1.jpg?jsx";
import AvatarImg from "~/media/logo/linksos-logo.png?w=80&h=80&jsx";

export const Hero = component$(() => {
  return (
    <section id="home" class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div class="absolute top-48 -right-24 w-[420px] h-[420px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div class="container mx-auto px-4 pt-10 lg:pt-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <div class="badge badge-primary badge-lg gap-2">
                <LuZap class="w-4 h-4" /> Platform Pendataan Posyandu
                Disabilitas
              </div>
              <a
                href="https://youtube.com/@lingkarsosialindonesia"
                target="_blank"
                rel="noopener"
                class="badge badge-ghost gap-2"
                aria-label="YouTube Lingkar Sosial Indonesia"
              >
                <LuYoutube class="w-4 h-4" /> Kemitraan LINKSOS
              </a>
            </div>
            <h1 class="text-4xl lg:text-6xl font-extrabold leading-tight mb-4 text-gradient-primary">
              SI-DIFA — Digitalisasi Layanan Posyandu Disabilitas
            </h1>
            <p class="text-base-content/70 text-lg lg:text-xl leading-relaxed mb-6">
              Satu portal untuk pendataan IBK, informasi inklusi, lowongan kerja
              ramah disabilitas, dan laporan statistik bagi kader, psikolog, dan
              pemangku kepentingan.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <a href="#tentang" class="btn btn-primary btn-lg gap-2 shadow-lg">
                Pelajari SI-DIFA <LuArrowRight class="w-5 h-5" />
              </a>
              <a href="#fitur" class="btn btn-ghost btn-lg gap-2">
                Lihat Fitur <LuArrowRight class="w-5 h-5" />
              </a>
            </div>

            <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div class="stat bg-base-200 rounded-box min-w-0">
                <div class="stat-title">Untuk</div>
                <div class="stat-value text-primary">Kader</div>
                <div class="stat-desc">Pencatatan IBK</div>
              </div>
              <div class="stat bg-base-200 rounded-box min-w-0">
                <div class="stat-title">Untuk</div>
                <div class="stat-value text-secondary">Psikolog</div>
                <div class="stat-desc">Asesmen & Rujukan</div>
              </div>
              <div class="stat bg-base-200 rounded-box min-w-0">
                <div class="stat-title">Untuk</div>
                <div class="stat-value text-accent">Instansi</div>
                <div class="stat-desc">Laporan & Kebijakan</div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="mockup-window border bg-base-200 shadow-xl">
              <div class="px-4 py-6 bg-base-100">
                <ImageHero />
              </div>
            </div>
            <div class="absolute -bottom-6 -left-6 hidden lg:block">
              <div class="card bg-base-100 shadow-xl border">
                <div class="card-body py-4 px-5">
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-10 rounded-full overflow-hidden">
                        <AvatarImg />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold">Berbasis Komunitas</p>
                      <p class="text-sm text-base-content/70">
                        Kolaborasi LINKSOS
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
  );
});
