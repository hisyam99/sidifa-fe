import { component$ } from "@builder.io/qwik";
import { LuHeart } from "~/components/icons/lucide-optimized"; // Updated import path

interface BrandLogoProps {
  hideTextOnMobile?: boolean;
  variant?: "plain" | "nav"; // nav: gunakan gaya tombol untuk navbar; plain: minimal untuk footer/umum
  size?: "sm" | "md" | "lg";
  href?: string | null; // jika null/undefined, tidak merender <a>
}

export const BrandLogo = component$((props: BrandLogoProps) => {
  const {
    hideTextOnMobile = false,
    variant = "plain",
    size = "md",
    href = "/",
  } = props;

  const anchorClass =
    variant === "nav"
      ? "btn btn-ghost px-2 h-12 min-h-0 no-underline inline-flex items-center gap-2"
      : "inline-flex items-center gap-3 no-underline";

  const circleSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  const brandNameSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";
  const subTextSize =
    size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";

  const content = (
    <>
      <span
        class={`bg-gradient-primary rounded-full ${circleSize} flex items-center justify-center shadow-lg`}
      >
        <LuHeart class={iconSize} />
      </span>
      <span
        class={`flex flex-col items-start ${hideTextOnMobile ? "hidden sm:flex" : ""}`}
      >
        <span
          class={`font-bold text-gradient-primary leading-none whitespace-nowrap ${brandNameSize}`}
        >
          SIDIFA
        </span>
        <span
          class={`text-base-content/60 font-medium leading-none ${subTextSize}`}
        >
          Sistem Informasi Difabel
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        class={anchorClass}
        aria-label="SIDIFA - Sistem Informasi Difabel"
      >
        {content}
      </a>
    );
  }

  return (
    <span
      class={anchorClass}
      role="link"
      aria-label="SIDIFA - Sistem Informasi Difabel"
    >
      {content}
    </span>
  );
});
