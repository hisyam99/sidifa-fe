import { component$ } from "@builder.io/qwik";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  class?: string;
  variant?: "spinner" | "dots" | "ring";
}

export default component$<LoadingSpinnerProps>(
  ({
    size = "lg",
    text = "Loading...",
    class: className = "",
    variant = "spinner",
  }) => {
    return (
      <div
        class={`flex flex-col items-center justify-center gap-4 ${className}`}
      >
        <span class={`loading loading-${variant} loading-${size}`}></span>
        {text && <p class="text-base-content/70 font-medium">{text}</p>}
      </div>
    );
  },
);
