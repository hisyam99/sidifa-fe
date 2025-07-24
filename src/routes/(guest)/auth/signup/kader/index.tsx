import { component$ } from "@qwik.dev/core";
import { SignupKaderForm, SignupHeroContent } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import {
  LuStethoscope,
  LuUsers,
  LuShield,
  LuHeart,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  useAuthRedirect();

  const kaderBenefits = [
    {
      icon: LuUsers,
      title: "Kelola Data Masyarakat",
      description:
        "Sistem terintegrasi untuk mengelola data kesehatan penyandang disabilitas.",
      iconBgClass: "bg-primary/10",
      iconColorClass: "text-primary",
    },
    {
      icon: LuShield,
      title: "Laporan Real-time",
      description: "Generate laporan dan statistik kesehatan secara otomatis.",
      iconBgClass: "bg-secondary/10",
      iconColorClass: "text-secondary",
    },
    {
      icon: LuHeart,
      title: "Kolaborasi Psikolog",
      description: "Terhubung dengan psikolog untuk layanan kesehatan mental.",
      iconBgClass: "bg-accent/10",
      iconColorClass: "text-accent",
    },
  ];

  const kaderRequirements = [
    "Posyandu aktif dan terdaftar",
    "Minimal 1 kader terlatih",
    "Komitmen layanan inklusif",
  ];

  return (
    <div class="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <SignupHeroContent
        title="Bergabung sebagai Kader Posyandu"
        description="Daftar sebagai kader posyandu untuk mengelola data kesehatan masyarakat dan memberikan layanan inklusif bagi penyandang disabilitas."
        heroIcon={LuStethoscope}
        heroIconBgClass="bg-gradient-primary"
        heroTitleGradientClass="text-gradient-primary"
        benefits={kaderBenefits}
        requirements={kaderRequirements}
      />

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <SignupKaderForm />
        </div>
      </div>
    </div>
  );
});
