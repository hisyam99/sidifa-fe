import { component$ } from "@builder.io/qwik";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  class?: string;
}

export default component$<LoadingSpinnerProps>(
  ({ size = "lg", text = "Loading...", class: className = "" }) => {
    return (
      <div class={`text-center ${className}`}>
        <span class={`loading loading-spinner loading-${size}`}></span>
        {text && <p class="mt-2">{text}</p>}
      </div>
    );
  },
);
