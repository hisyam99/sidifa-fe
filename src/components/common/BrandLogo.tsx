import { component$ } from "@builder.io/qwik";
import ImgSidifa from "~/media/logo/sidifa.svg?jsx";

interface BrandLogoProps {
  hideTextOnMobile?: boolean;
  variant?: "plain" | "nav"; // nav: gunakan gaya tombol untuk navbar; plain: minimal untuk footer/umum
  size?: "sm" | "md" | "lg";
  href?: string | null; // jika null/undefined, tidak merender <a>
}

const variantToClass: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  nav: "btn btn-ghost px-2 h-12 min-h-0 no-underline inline-flex items-center gap-2",
  plain: "inline-flex items-center gap-3 no-underline",
};

const sizeToLogo: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const sizeToName: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const sizeToSub: Record<NonNullable<BrandLogoProps["size"]>, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

export const BrandLogo = component$((props: BrandLogoProps) => {
  const {
    hideTextOnMobile = false,
    variant = "plain",
    size = "md",
    href = "/",
  } = props;

  const anchorClass = variantToClass[variant];
  const logoSize = sizeToLogo[size];
  const brandNameSize = sizeToName[size];
  const subTextSize = sizeToSub[size];

  const content = (
    <>
      <span class={`inline-flex ${logoSize}`} aria-hidden="true">
        <ImgSidifa class="w-full h-full object-contain select-none" />
      </span>
      <span
        class={`flex flex-col items-start ${hideTextOnMobile ? "hidden sm:flex" : ""}`}
      >
        <span
          class={`font-bold text-gradient-primary leading-none whitespace-nowrap ${brandNameSize}`}
        >
          SI-DIFA
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
    <span class={anchorClass} aria-label="SIDIFA - Sistem Informasi Difabel">
      {content}
    </span>
  );
});
