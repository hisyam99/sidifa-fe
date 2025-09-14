import { useSignal, useTask$, type QRL } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

/**
 * Custom hook to detect route changes and trigger callbacks
 * Useful for triggering animations or other effects on navigation
 */
export const useRouteChange = (callback?: QRL<() => void>) => {
  const location = useLocation();
  const previousPath = useSignal(location.url.pathname);
  const isChanging = useSignal(false);

  useTask$(({ track }) => {
    const currentPath = track(() => location.url.pathname);

    if (currentPath !== previousPath.value) {
      // Route has changed
      isChanging.value = true;

      // Execute callback if provided
      if (callback) {
        // Execute callback in next tick to avoid lexical scope issues
        setTimeout(() => {
          callback();
        }, 0);
      }

      // Reset state after animation/effect completes
      setTimeout(() => {
        isChanging.value = false;
      }, 500); // Match typical animation duration

      previousPath.value = currentPath;
    }
  });

  return {
    isChanging: isChanging.value,
    currentPath: location.url.pathname,
    previousPath: previousPath.value,
  };
};
