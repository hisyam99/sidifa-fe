import { component$, Slot } from "@builder.io/qwik";

/**
 * AnimatedPageContainer wraps its children in PageContainer
 * and applies a smooth page transition animation.
 * It also ensures overflow is handled to prevent layout issues.
 */
export const AnimatedPageContainer = component$(() => {
  return (
    <div class="page-transition">
      <Slot />
    </div>
  );
});
