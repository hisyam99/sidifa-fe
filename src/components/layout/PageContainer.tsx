import { component$, Slot } from "@builder.io/qwik";

interface PageContainerProps {
  maxWidth?: string;
  class?: string;
}

export default component$<PageContainerProps>(
  ({ maxWidth = "max-w-md", class: className = "" }) => {
    return (
      <div class={`container mx-auto ${maxWidth} p-4 ${className}`}>
        <Slot />
      </div>
    );
  },
);
