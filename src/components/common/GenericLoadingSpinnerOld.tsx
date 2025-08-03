import { component$ } from "@builder.io/qwik";
import { LuLoader2 } from "~/components/icons/lucide-optimized"; // Updated import path

interface GenericLoadingSpinnerOldProps {
  size?: string; // e.g., "w-12 h-12", "w-8 h-8"
  color?: string; // e.g., "text-primary", "text-info"
}

export const GenericLoadingSpinnerOld = component$(
  (props: GenericLoadingSpinnerOldProps) => {
    const { size = "w-12 h-12", color = "text-primary" } = props;
    return (
      <div class="flex justify-center items-center min-h-screen">
        <LuLoader2 class={`animate-spin ${size} ${color}`} />
      </div>
    );
  },
);
