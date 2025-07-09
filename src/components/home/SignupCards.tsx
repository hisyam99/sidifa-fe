import { component$ } from "@builder.io/qwik";
import {
  LuStethoscope,
  LuBrain,
  LuPlus,
  LuArrowRight,
  LuHeart,
  LuUsers,
  LuShield,
  LuZap,
} from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Posyandu Card */}
      <div class="card-elegant text-center group hover:shadow-2xl transition-all duration-500">
        <div class="card-body p-8">
          <div class="avatar placeholder mb-6 group-hover:scale-110 transition-transform duration-300">
            <div class="bg-gradient-primary text-white rounded-full w-24 h-24 shadow-xl">
              <LuStethoscope class="w-12 h-12" />
            </div>
          </div>

          <h2 class="card-title text-3xl font-bold text-gradient-primary mb-4 justify-center">
            Posyandu
          </h2>

          <p class="text-base-content/70 mb-8 text-lg leading-relaxed">
            Daftar sebagai Posyandu untuk mengelola data kesehatan masyarakat
            dan memberikan layanan kesehatan terpadu yang inklusif untuk
            penyandang disabilitas.
          </p>

          {/* Features */}
          <div class="grid grid-cols-1 gap-3 mb-8">
            <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <LuHeart class="w-5 h-5 text-primary" />
              <span class="text-sm font-medium">Layanan Kesehatan Terpadu</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <LuUsers class="w-5 h-5 text-primary" />
              <span class="text-sm font-medium">Kelola Data Masyarakat</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <LuShield class="w-5 h-5 text-primary" />
              <span class="text-sm font-medium">Keamanan Data Terjamin</span>
            </div>
          </div>

          <div class="card-actions justify-center">
            <a
              href="/auth/signup/posyandu"
              class="btn-hero inline-flex items-center gap-3"
            >
              <LuPlus class="w-5 h-5" />
              Daftar Posyandu
              <LuArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Psikolog Card */}
      <div class="card-elegant text-center group hover:shadow-2xl transition-all duration-500">
        <div class="card-body p-8">
          <div class="avatar placeholder mb-6 group-hover:scale-110 transition-transform duration-300">
            <div class="bg-gradient-secondary text-white rounded-full w-24 h-24 shadow-xl">
              <LuBrain class="w-12 h-12" />
            </div>
          </div>

          <h2 class="card-title text-3xl font-bold text-gradient-secondary mb-4 justify-center">
            Psikolog
          </h2>

          <p class="text-base-content/70 mb-8 text-lg leading-relaxed">
            Daftar sebagai Psikolog untuk memberikan layanan konseling dan
            dukungan kesehatan mental yang profesional dan berkualitas.
          </p>

          {/* Features */}
          <div class="grid grid-cols-1 gap-3 mb-8">
            <div class="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
              <LuBrain class="w-5 h-5 text-secondary" />
              <span class="text-sm font-medium">Konseling Profesional</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
              <LuZap class="w-5 h-5 text-secondary" />
              <span class="text-sm font-medium">Akses Cepat & Mudah</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
              <LuHeart class="w-5 h-5 text-secondary" />
              <span class="text-sm font-medium">Dukungan Inklusif</span>
            </div>
          </div>

          <div class="card-actions justify-center">
            <a
              href="/auth/signup/psikolog"
              class="btn btn-secondary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <LuPlus class="w-5 h-5" />
              Daftar Psikolog
              <LuArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
