import {
  component$,
  useSignal,
  useTask$,
  useComputed$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import clsx from "clsx";

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
export const RoutingIndicator = component$<RoutingIndicatorProps>(
  ({
    style = "bars",
    size = "md",
    color = "primary",
    class: className,
    ariaLabel,
  }) => {
    const location = useLocation();
    const state = useSignal<"start" | "loading" | "end">("start");

    useTask$(({ track, cleanup }) => {
      if (track(() => location.isNavigating)) {
        state.value = "loading";
      } else if (state.value === "loading") {
        state.value = "end";
        const timeout = setTimeout(() => (state.value = "start"), 750);
        cleanup(() => clearTimeout(timeout));
      }
    });

    // useComputed$ untuk aria-label dinamis
    const computedAriaLabel = useComputed$(
      () =>
        ariaLabel ?? `App is ${location.isNavigating ? "" : "not "}navigating`,
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
      // Bar panjang custom, efek transparan lebih singkat, support color & size
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
            state.value === "start" && "scale-x-0 opacity-0",
            state.value === "loading" && "scale-x-100 opacity-100",
            state.value === "end" &&
              "scale-x-100 opacity-0 [transition:opacity_.3s_linear_.1s]",
            className,
          )}
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
          state.value === "start" && "opacity-0 scale-0",
          state.value === "loading" && "opacity-100 scale-100",
          state.value === "end" && "opacity-0 scale-75",
          className,
        )}
        aria-live="polite"
        aria-label={computedAriaLabel.value}
      >
        <span class={computedLoadingClass.value} />
      </output>
    );
  },
);
