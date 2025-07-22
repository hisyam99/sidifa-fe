import { component$ } from "@qwik.dev/core";
import { LuHeart } from "~/components/icons/lucide-optimized"; // Updated import path

interface BrandLogoProps {
  hideTextOnMobile?: boolean;
}

export const BrandLogo = component$((props: BrandLogoProps) => {
  const { hideTextOnMobile = false } = props;
  return (
    <a
      href="/"
      class="btn btn-ghost text-xl hover:bg-primary/10 transition-all duration-300"
    >
      <div class="bg-gradient-primary rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-lg">
        <LuHeart class="w-6 h-6" />
      </div>
      <div
        class={`flex flex-col items-start ${hideTextOnMobile ? "hidden sm:flex" : ""}`}
      >
        <span class="font-bold text-gradient-primary">SIDIFA</span>
        <span class="text-xs text-base-content/60 font-medium">
          Sistem Informasi Difabel
        </span>
      </div>
    </a>
  );
});
