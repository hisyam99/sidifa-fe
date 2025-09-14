import { component$, Slot, useSignal, useTask$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

/**
 * Enhanced AnimatedPageContainer that detects route changes and triggers animations
 * even when using prefetch links. It tracks location changes and applies
 * animation classes dynamically.
 */
export const AnimatedPageContainer = component$(() => {
  const location = useLocation();
  const isAnimating = useSignal(false);
  const currentPath = useSignal(location.url.pathname);

  useTask$(({ track }) => {
    const newPath = track(() => location.url.pathname);

    if (newPath !== currentPath.value) {
      // Trigger animation on route change
      isAnimating.value = true;
      currentPath.value = newPath;

      // Reset animation state after animation completes
      setTimeout(() => {
        isAnimating.value = false;
      }, 500); // Match CSS animation duration
    }
  });

  return (
    <div class="page-transition">
      <div
        class={[isAnimating.value && "page-transition"]
          .filter(Boolean)
          .join(" ")}
      >
        <Slot />
      </div>
    </div>
  );
});
