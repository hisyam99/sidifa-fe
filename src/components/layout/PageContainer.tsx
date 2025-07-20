import { component$, Slot } from "@builder.io/qwik";

interface PageContainerProps {
  class?: string;
  centered?: boolean;
}

export const PageContainer = component$<PageContainerProps>(
  ({ class: className = "", centered = false }) => {
    return (
      <div
        class={`min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-8 ${
          centered ? "flex items-center justify-center" : ""
        } ${className}`}
      >
        <Slot />
      </div>
    );
  },
);
