import { component$ } from "@qwik.dev/core";
import { SignupPsikologForm, SignupHeroContent } from "~/components/auth";
import { useAuthRedirect } from "~/hooks/useAuthRedirect";
import {
  LuBrain,
  LuUsers,
  LuShield,
} from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  useAuthRedirect();

  const psikologBenefits = [
    {
      icon: LuUsers,
      title: "Kelola Pasien",
      description:
        "Sistem manajemen pasien yang terintegrasi dan mudah digunakan.",
      iconBgClass: "bg-secondary/10",
      iconColorClass: "text-secondary",
    },
    {
      icon: LuShield,
      title: "Rekam Medis Digital",
      description:
        "Simpan dan kelola rekam medis pasien secara digital dan aman.",
      iconBgClass: "bg-primary/10",
      iconColorClass: "text-primary",
    },
    {
      icon: LuBrain,
      title: "Kolaborasi Posyandu",
      description: "Terhubung dengan posyandu untuk layanan kesehatan terpadu.",
      iconBgClass: "bg-accent/10",
      iconColorClass: "text-accent",
    },
  ];

  const psikologRequirements = [
    "Psikolog berlisensi aktif",
    "Pengalaman minimal 2 tahun",
    "Komitmen layanan inklusif",
  ];

  return (
    <div class="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row">
      {/* Left Side - Content (Hidden on mobile, visible on desktop) */}
      <SignupHeroContent
        title="Bergabung sebagai Psikolog"
        description="Daftarkan diri Anda sebagai psikolog untuk memberikan layanan kesehatan mental yang berkualitas bagi penyandang disabilitas."
        heroIcon={LuBrain}
        heroIconBgClass="bg-gradient-secondary"
        heroTitleGradientClass="text-gradient-secondary"
        benefits={psikologBenefits}
        requirements={psikologRequirements}
      />

      {/* Right Side - Form (Full width on mobile, half width on desktop) */}
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8 xl:p-12">
        <div class="w-full max-w-md">
          <SignupPsikologForm />
        </div>
      </div>
    </div>
  );
});
