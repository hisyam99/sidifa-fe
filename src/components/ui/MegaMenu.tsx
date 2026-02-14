import { component$, Slot } from "@builder.io/qwik";
import { useHoverDelay } from "~/hooks/useHoverDelay";
import "./MegaMenu.css";

interface MegaMenuProps {
  delayMs?: number;
  class?: string;
}

export const MegaMenu = component$<MegaMenuProps>(
  ({ delayMs = 300, class: className = "" }) => {
    const { isHovered, handleMouseEnter, handleMouseLeave } =
      useHoverDelay(delayMs);

    return (
      <div
        class={`relative ${className}`}
        onMouseEnter$={handleMouseEnter}
        onMouseLeave$={handleMouseLeave}
      >
        <Slot name="trigger" />
        {isHovered && (
          <div
            class={`absolute top-full z-1000 mt-1 mega-menu-content ${className.includes("dropdown-start") ? "right-0" : "left-0"}`}
            style={{
              animation: "mega-menu-enter 0.2s ease-out forwards",
            }}
          >
            <Slot name="content" />
          </div>
        )}
      </div>
    );
  },
);
