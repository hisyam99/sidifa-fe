import { component$ } from "@builder.io/qwik";
import { LuHeart } from "~/components/icons/lucide-optimized"; // Updated import path

interface BrandLogoProps {
  hideTextOnMobile?: boolean;
  variant?: "plain" | "nav"; // nav: gunakan gaya tombol untuk navbar; plain: minimal untuk footer/umum
  size?: "sm" | "md" | "lg";
}

export const BrandLogo = component$((props: BrandLogoProps) => {
  const { hideTextOnMobile = false, variant = "plain", size = "md" } = props;

  const anchorClass =
    variant === "nav"
      ? "btn btn-ghost px-2 h-12 min-h-0 no-underline"
      : "inline-flex items-center gap-3 no-underline";

  const circleSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  return (
    <a
      href="/"
      class={anchorClass}
      aria-label="SIDIFA - Sistem Informasi Difabel"
    >
      <span
        class={`bg-gradient-primary rounded-full ${circleSize} flex items-center justify-center shadow-lg`}
      >
        <LuHeart class={iconSize} />
      </span>
      <span
        class={`flex flex-col items-start ${hideTextOnMobile ? "hidden sm:flex" : ""}`}
      >
        <span class="font-bold text-gradient-primary leading-none">SIDIFA</span>
        <span class="text-xs text-base-content/60 font-medium leading-none">
          Sistem Informasi Difabel
        </span>
      </span>
    </a>
  );
});
