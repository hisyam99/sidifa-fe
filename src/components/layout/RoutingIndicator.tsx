import { component$, useComputed$, useContext } from "@qwik.dev/core";
import clsx from "clsx";
import {
  RoutingProgressContextId,
  useRoutingProgressProvider,
} from "./RoutingIndicatorContext";

export type RoutingIndicatorStyle =
  | "spinner"
  | "dots"
  | "ring"
  | "ball"
  | "bars"
  | "infinity";
export type RoutingIndicatorSize = "xs" | "sm" | "md" | "lg" | "xl";
export type RoutingIndicatorColor =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface RoutingIndicatorProps {
  style?: RoutingIndicatorStyle;
  size?: RoutingIndicatorSize;
  color?: RoutingIndicatorColor;
  class?: string;
  ariaLabel?: string;
}

/**
 * RoutingIndicator: Visual feedback for route changes using DaisyUI loading animations.
 * - Fully customizable via props (style, size, color)
 * - Accessible (ARIA, role, screen reader)
 */
export const RoutingIndicator = component$<RoutingIndicatorProps>((props) => {
  useRoutingProgressProvider(); // Pastikan provider dipanggil di parent/root, jika tidak, panggil di sini
  const { progress, isLoading } = useContext(RoutingProgressContextId);
  const {
    style = "bars",
    size = "md",
    color = "primary",
    class: className,
    ariaLabel,
  } = props;

  // useComputed$ untuk aria-label dinamis
  const computedAriaLabel = useComputed$(
    () => ariaLabel ?? `App is ${isLoading.value ? "" : "not "}navigating`,
  );

  // useComputed$ untuk loadingClass DaisyUI
  const computedLoadingClass = useComputed$(() =>
    style !== "bars"
      ? clsx(
          "loading",
          `loading-${style}`,
          `loading-${size}`,
          color && `text-${color}`,
        )
      : undefined,
  );

  if (style === "bars") {
    const sizeMap: Record<RoutingIndicatorSize, string> = {
      xs: "h-0.5",
      sm: "h-1",
      md: "h-1.5",
      lg: "h-2",
      xl: "h-3",
    };
    const colorMap: Record<RoutingIndicatorColor, string> = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      neutral: "bg-neutral",
      info: "bg-info",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
    };
    return (
      <output
        class={clsx(
          "fixed z-[9999] left-0 top-0 w-full origin-left pointer-events-none transition-all duration-300",
          sizeMap[size],
          colorMap[color],
          className,
        )}
        style={`transform:scaleX(${progress.value / 100}); opacity:${progress.value > 0 ? 1 : 0};`}
        aria-live="polite"
        aria-label={computedAriaLabel.value}
      />
    );
  }
  // DaisyUI loading spinner/dots/dll
  return (
    <output
      class={clsx(
        "fixed z-[9999] left-0 top-0 w-full flex items-center justify-center pointer-events-none transition-all duration-500",
        isLoading.value ? "opacity-100 scale-100" : "opacity-0 scale-0",
        className,
      )}
      aria-live="polite"
      aria-label={computedAriaLabel.value}
    >
      <span class={computedLoadingClass.value} />
    </output>
  );
});
