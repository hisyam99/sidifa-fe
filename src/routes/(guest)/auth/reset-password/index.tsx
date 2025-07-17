import { component$ } from "@builder.io/qwik";
import { ResetPasswordForm } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import { LuLock, LuShield, LuCheckCircle } from "@qwikest/icons/lucide";

export default component$(() => {
  useAuthRedirect();

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
        <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
          <div class="text-center lg:text-left mb-8">
            <div class="bg-gradient-success rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
              <LuLock class="w-10 h-10" />
            </div>
            <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-success mb-4">
              Reset Password
            </h1>
            <p class="text-lg text-base-content/70 leading-relaxed">
              Buat password baru yang kuat untuk mengamankan akun SIDIFA Anda.
            </p>
          </div>

          {/* Password Requirements */}
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-base-content mb-4">
              Persyaratan Password
            </h2>

            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-success/10 p-2">
                  <LuCheckCircle class="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Minimal 8 Karakter
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Password harus memiliki minimal 8 karakter.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-primary/10 p-2">
                  <LuShield class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Kombinasi Karakter
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Harus mengandung huruf besar, huruf kecil, dan angka.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-accent/10 p-2">
                  <LuLock class="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Konfirmasi Password
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Pastikan password dan konfirmasi password sama.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div class="mt-8">
              <h3 class="font-semibold text-base-content mb-3">
                Tips Keamanan
              </h3>
              <div class="space-y-2">
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Jangan gunakan password lama</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Hindari informasi pribadi</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Simpan password dengan aman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
});
