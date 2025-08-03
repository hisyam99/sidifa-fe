import { component$ } from "@builder.io/qwik";
import { ForgotPasswordForm, AuthInfoContent } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import { LuLock, LuMail, LuShield } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  useAuthRedirect();

  const processSteps = [
    {
      icon: LuMail,
      title: "Masukkan Email",
      description: "Ketik email yang terdaftar di akun SIDIFA Anda.",
      iconBgClass: "bg-primary/10",
      iconColorClass: "text-primary",
    },
    {
      icon: LuShield,
      title: "Verifikasi Email",
      description: "Kami akan mengirim link reset password ke email Anda.",
      iconBgClass: "bg-secondary/10",
      iconColorClass: "text-secondary",
    },
    {
      icon: LuLock,
      title: "Reset Password",
      description: "Klik link dan buat password baru yang aman.",
      iconBgClass: "bg-accent/10",
      iconColorClass: "text-accent",
    },
  ];

  const securityTips = [
    "Gunakan password yang kuat",
    "Jangan bagikan link reset",
    "Segera ganti password setelah reset",
  ];

  return (
    <div class="flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <AuthInfoContent
        title="Lupa Password?"
        description="Jangan khawatir! Kami akan membantu Anda mengatur ulang password dengan aman dan mudah."
        heroIcon={LuLock}
        heroIconBgClass="bg-gradient-primary"
        heroTitleGradientClass="text-gradient-primary"
        processSteps={processSteps}
        securityTips={securityTips}
      />

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
});
