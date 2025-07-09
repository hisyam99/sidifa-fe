import { component$, Slot } from "@builder.io/qwik";

interface PageContainerProps {
  maxWidth?: string;
  class?: string;
  centered?: boolean;
}

export default component$<PageContainerProps>(
  ({ maxWidth = "max-w-md", class: className = "", centered = false }) => {
    return (
      <div
        class={`container mx-auto ${maxWidth} p-4 ${centered ? "flex items-center justify-center min-h-[60vh]" : ""} ${className}`}
      >
        <div class="w-full">
          <Slot />
        </div>
      </div>
    );
  },
);
