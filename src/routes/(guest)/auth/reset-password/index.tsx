import { component$ } from "@builder.io/qwik";
import { ResetPasswordForm, AuthInfoContent } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import { LuLock, LuShield, LuCheckCircle } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  useAuthRedirect();

  const passwordRequirements = [
    {
      icon: LuCheckCircle,
      title: "Minimal 8 Karakter",
      description: "Password harus memiliki minimal 8 karakter.",
      iconBgClass: "bg-success/10",
      iconColorClass: "text-success",
    },
    {
      icon: LuShield,
      title: "Kombinasi Karakter",
      description: "Harus mengandung huruf besar, huruf kecil, dan angka.",
      iconBgClass: "bg-primary/10",
      iconColorClass: "text-primary",
    },
    {
      icon: LuLock,
      title: "Konfirmasi Password",
      description: "Pastikan password dan konfirmasi password sama.",
      iconBgClass: "bg-accent/10",
      iconColorClass: "text-accent",
    },
  ];

  const securityTips = [
    "Jangan gunakan password lama",
    "Hindari informasi pribadi",
    "Simpan password dengan aman",
  ];

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <AuthInfoContent
        title="Reset Password"
        description="Buat password baru yang kuat untuk mengamankan akun SIDIFA Anda."
        heroIcon={LuLock}
        heroIconBgClass="bg-gradient-success"
        heroTitleGradientClass="text-gradient-success"
        processSteps={passwordRequirements} // Menggunakan processSteps untuk persyaratan password
        securityTips={securityTips}
      />

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
});
