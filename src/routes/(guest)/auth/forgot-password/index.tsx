import { component$ } from "@builder.io/qwik";
import { ForgotPasswordForm } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import { LuLock, LuMail, LuShield, LuCheckCircle } from "@qwikest/icons/lucide";

export default component$(() => {
  useAuthRedirect();

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
        <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
          <div class="text-center lg:text-left mb-8">
            <div class="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
              <LuLock class="w-10 h-10" />
            </div>
            <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-primary mb-4">
              Lupa Password?
            </h1>
            <p class="text-lg text-base-content/70 leading-relaxed">
              Jangan khawatir! Kami akan membantu Anda mengatur ulang password
              dengan aman dan mudah.
            </p>
          </div>

          {/* Process */}
          <div class="space-y-6">
            <h2 class="text-xl font-semibold text-base-content mb-4">
              Cara Kerja
            </h2>

            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-primary/10 p-2">
                  <LuMail class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Masukkan Email
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Ketik email yang terdaftar di akun SIDIFA Anda.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-secondary/10 p-2">
                  <LuShield class="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Verifikasi Email
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Kami akan mengirim link reset password ke email Anda.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
                <div class="bg-accent/10 p-2">
                  <LuLock class="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 class="font-semibold text-base-content mb-1">
                    Reset Password
                  </h3>
                  <p class="text-sm text-base-content/70">
                    Klik link dan buat password baru yang aman.
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
                  <span>Gunakan password yang kuat</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Jangan bagikan link reset</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <LuCheckCircle class="w-4 h-4 text-success" />
                  <span>Segera ganti password setelah reset</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
});
