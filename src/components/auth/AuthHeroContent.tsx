import { component$ } from "@builder.io/qwik";
import {
  LuHeart,
  LuShield,
  LuZap,
  LuUsers,
  LuBrain,
} from "~/components/icons/lucide-optimized"; // Changed import source
import { StatisticCard } from "~/components/home";
import { AuthFeatureItem } from "./AuthFeatureItem";

interface AuthHeroContentProps {
  title: string;
  description: string;
}

export const AuthHeroContent = component$((props: AuthHeroContentProps) => {
  const { title, description } = props;

  return (
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 xl:p-16">
      <div class="flex flex-col justify-center w-full max-w-lg mx-auto">
        <div class="text-center lg:text-left mb-8">
          <div class="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <LuHeart class="w-10 h-10" />
          </div>
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

          {/* Stats */}
          <div class="grid grid-cols-3 gap-4 mt-8">
            <StatisticCard
              icon={LuUsers}
              value="500+"
              description="Penyandang Disabilitas"
              iconBgGradientClass="bg-primary"
              valueTextColorClass="text-primary"
              title="Penyandang Disabilitas"
            />
            <StatisticCard
              icon={LuHeart}
              value="4"
              description="Posyandu Aktif"
              iconBgGradientClass="bg-secondary"
              valueTextColorClass="text-secondary"
              title="Posyandu Aktif"
            />
            <StatisticCard
              icon={LuBrain}
              value="100+"
              description="Kader Terlatih"
              iconBgGradientClass="bg-accent"
              valueTextColorClass="text-accent"
              title="Kader Terlatih"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
