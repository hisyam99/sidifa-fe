import { component$ } from "@builder.io/qwik";
import { LoginForm, AuthHeroContent } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";

export default component$(() => {
  useAuthRedirect();

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <AuthHeroContent
        title="Selamat Datang Kembali"
        description="Masuk ke akun SIDIFA Anda untuk mengakses layanan kesehatan inklusif dan pemberdayaan penyandang disabilitas."
      />

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
});
