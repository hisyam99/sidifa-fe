import { component$ } from "@qwik.dev/core";

export interface SpinnerProps {
  class?: string;
  overlay?: boolean; // jika true, pakai absolute overlay
  size?: string; // tailwind size, default: 'w-10 h-10'
  color?: string; // tailwind color, default: 'text-primary'
}

export const Spinner = component$<SpinnerProps>(
  ({
    class: className = "",
    overlay = false,
    size = "w-10 h-10",
    color = "text-primary",
  }) => (
    <div
      class={
        overlay
          ? `absolute inset-0 bg-base-100/70 rounded-3xl flex justify-center items-center z-10 ${className}`
          : `flex justify-center items-center ${className}`
      }
    >
      <svg
        class={`animate-spin ${size} ${color}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  ),
);

export default Spinner;
