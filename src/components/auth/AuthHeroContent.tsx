import { component$ } from "@qwik.dev/core";
import { LuHeart, LuShield, LuZap } from "~/components/icons/lucide-optimized"; // Changed import source
import { AuthFeatureItem } from "./AuthFeatureItem";

interface AuthHeroContentProps {
  title: string;
  description: string;
}

export const AuthHeroContent = component$((props: AuthHeroContentProps) => {
  const { title, description } = props;

  return (
    <div class="min-h-screen hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
      <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
        <div class="text-center lg:text-left mb-8">
          <h1 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-primary mb-4">
            {title}
          </h1>
          <p class="text-lg text-base-content/70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features */}
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-base-content mb-4">
            Mengapa Memilih SIDIFA?
          </h2>

          <div class="space-y-4">
            <AuthFeatureItem
              icon={LuHeart}
              title="Layanan Inklusif"
              description="Platform yang dirancang khusus untuk memenuhi kebutuhan penyandang disabilitas."
              iconBgClass="bg-primary/10"
              iconColorClass="text-primary"
            />
            <AuthFeatureItem
              icon={LuShield}
              title="Aman & Terpercaya"
              description="Data pribadi terlindungi dengan sistem keamanan tingkat tinggi."
              iconBgClass="bg-secondary/10"
              iconColorClass="text-secondary"
            />
            <AuthFeatureItem
              icon={LuZap}
              title="Akses Cepat"
              description="Antarmuka yang intuitif dan mudah digunakan di semua perangkat."
              iconBgClass="bg-accent/10"
              iconColorClass="text-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
