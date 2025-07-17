import { component$ } from "@builder.io/qwik";
import { LoginForm } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import { LuHeart, LuShield, LuZap } from "@qwikest/icons/lucide";

export default component$(() => {
  useAuthRedirect();

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
        <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
          <div class="text-center lg:text-left mb-8">
            <div class="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
              <LuHeart class="w-10 h-10" />
            </div>
            <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-primary mb-4">
              Selamat Datang Kembali
            </h1>
            <p class="text-lg text-base-content/70 leading-relaxed">
              Masuk ke akun SIDIFA Anda untuk mengakses layanan kesehatan
              inklusif dan pemberdayaan penyandang disabilitas.
            </p>
          </div>

          {/* Features */}
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-base-content mb-4">
              Mengapa Memilih SIDIFA?
            </h2>

            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-primary/10 p-2">
                  <LuHeart class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Layanan Inklusif
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Platform yang dirancang khusus untuk memenuhi kebutuhan
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
                    Aman & Terpercaya
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Data pribadi terlindungi dengan sistem keamanan tingkat
                    tinggi.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-accent/10 p-2">
                  <LuZap class="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Akses Cepat
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Antarmuka yang intuitif dan mudah digunakan di semua
                    perangkat.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div class="grid grid-cols-3 gap-4 mt-8">
              <div class="text-center p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="text-2xl font-bold text-primary">500+</div>
                <div class="text-xs text-base-content/70">
                  Penyandang Disabilitas
                </div>
              </div>
              <div class="text-center p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="text-2xl font-bold text-secondary">4</div>
                <div class="text-xs text-base-content/70">Posyandu Aktif</div>
              </div>
              <div class="text-center p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="text-2xl font-bold text-accent">100+</div>
                <div class="text-xs text-base-content/70">Kader Terlatih</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
});
