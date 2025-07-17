import { component$ } from "@builder.io/qwik";
import { SignupPosyanduForm } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import {
  LuHeart,
  LuStethoscope,
  LuUsers,
  LuShield,
  LuCheckCircle,
} from "@qwikest/icons/lucide";

export default component$(() => {
  useAuthRedirect();

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
        <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
          <div class="text-center lg:text-left mb-8">
            <div class="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
              <LuStethoscope class="w-10 h-10" />
            </div>
            <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-primary mb-4">
              Bergabung sebagai Posyandu
            </h1>
            <p class="text-lg text-base-content/70 leading-relaxed">
              Daftarkan posyandu Anda untuk mengelola data kesehatan masyarakat
              dan memberikan layanan inklusif bagi penyandang disabilitas.
            </p>
          </div>

          {/* Benefits */}
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-base-content mb-4">
              Manfaat Bergabung
            </h2>

            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-primary/10 p-2">
                  <LuUsers class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Kelola Data Masyarakat
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Sistem terintegrasi untuk mengelola data kesehatan
                    penyandang disabilitas.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-secondary/10 p-2">
                  <LuShield class="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Laporan Real-time
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Generate laporan dan statistik kesehatan secara otomatis.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-accent/10 p-2">
                  <LuHeart class="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Kolaborasi Psikolog
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Terhubung dengan psikolog untuk layanan kesehatan mental.
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div class="mt-8">
              <h3 class="font-semibold text-base-content mb-3">
                Persyaratan Pendaftaran
              </h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Posyandu aktif dan terdaftar</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Minimal 1 kader terlatih</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Komitmen layanan inklusif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <SignupPosyanduForm />
        </div>
      </div>
    </div>
  );
});
