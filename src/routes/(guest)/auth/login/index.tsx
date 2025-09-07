// File: /src/routes/(guest)/auth/login/index.tsx
import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { LoginForm, AuthHeroContent } from "~/components/auth";
import { getUiAuthFromCookie } from "~/utils/ui-auth-cookie";

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const { isAuthenticated, role } = getUiAuthFromCookie(cookie);

  if (isAuthenticated && role) {
    switch (role) {
      case "admin":
        throw redirect(308, "/admin");
      case "kader":
        throw redirect(308, "/kader");
      case "posyandu":
        throw redirect(308, "/posyandu");
      case "psikolog":
        throw redirect(308, "/psikolog");
      default:
        throw redirect(308, "/");
    }
  }
};

export default component$(() => {
  return (
    <div class="min-h-[90vh] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <AuthHeroContent
        title="Selamat Datang Kembali"
        description="Masuk ke akun SIDIFA Anda untuk mengakses layanan kesehatan inklusif dan pemberdayaan penyandang disabilitas."
      />
      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-lg mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
});
