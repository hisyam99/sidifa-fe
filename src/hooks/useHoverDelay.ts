import { useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

export const useHoverDelay = (delayMs: number = 300) => {
  const isHovered = useSignal(false);
  const timeoutId = useSignal<number | null>(null);

  const handleMouseEnter = $(() => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }
    isHovered.value = true;
  });

  const handleMouseLeave = $(() => {
    timeoutId.value = window.setTimeout(() => {
      isHovered.value = false;
    }, delayMs);
  });

  // Cleanup timeout on component unmount
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value);
      }
    });
  });

  return {
    isHovered: isHovered.value,
    handleMouseEnter,
    handleMouseLeave,
  };
};
