import { component$, QRL, Signal } from "@builder.io/qwik";
import { LuSearch } from "~/components/icons/lucide-optimized";

export interface SearchBoxProps {
  /** Unique identifier for the input element */
  id?: string;
  /** Placeholder text for the input */
  placeholder: string;
  /** Input value - can be string or Signal<string> */
  value: string | Signal<string>;
  /** Callback function when input value changes */
  onInput$?: QRL<(event: Event) => void>;
  /** Callback function when Enter key is pressed */
  onEnter$?: QRL<() => void>;
  /** Additional CSS classes to apply */
  class?: string;
  /** Size variant of the search box */
  size?: "sm" | "md" | "lg";
  /** Visual variant of the search box */
  variant?: "default" | "minimal" | "floating";
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * SearchBox Component
 *
 * A flexible and reusable search input component with icon and various styling options.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SearchBox
 *   placeholder="Search..."
 *   value={searchValue}
 *   onInput$={(e) => searchValue.value = e.target.value}
 * />
 *
 * // With custom size and variant
 * <SearchBox
 *   placeholder="Search..."
 *   value={searchValue}
 *   onInput$={handleInput$}
 *   size="lg"
 *   variant="floating"
 * />
 *
 * // Minimal variant for tight spaces
 * <SearchBox
 *   placeholder="Filter..."
 *   value={filterValue}
 *   onInput$={handleFilter$}
 *   size="sm"
 *   variant="minimal"
 * />
 * ```
 */
export const SearchBox = component$((props: SearchBoxProps) => {
  const {
    id,
    placeholder,
    value,
    onInput$,
    onEnter$,
    class: className,
    size = "md",
    variant = "default",
    disabled = false,
  } = props;

  // Size variants - affects input padding, text size, and icon size
  const sizeClasses = {
    sm: "pl-10 pr-3 py-2 text-sm",
    md: "pl-12 pr-4 py-3",
    lg: "pl-14 pr-5 py-4 text-lg",
  };

  // Icon size and position based on input size
  const iconSizes = {
    sm: "w-4 h-4 left-3",
    md: "w-5 h-5 left-4",
    lg: "w-6 h-6 left-4",
  };

  // Visual variants for different use cases
  const variantClasses = {
    default:
      "input input-bordered shadow-lg focus:shadow-xl transition-shadow duration-300",
    minimal:
      "input input-bordered border-base-300 bg-transparent focus:border-primary",
    floating:
      "input input-bordered bg-base-100/80 backdrop-blur-sm border-base-200/50 focus:border-primary/50",
  };

  const inputClasses =
    `${variantClasses[variant]} w-full ${sizeClasses[size]} ${className || ""}`.trim();
  const iconClasses = `absolute top-1/2 transform -translate-y-1/2 ${iconSizes[size]} text-base-content/50`;

  return (
    <div class="relative">
      <LuSearch class={iconClasses} />
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        class={inputClasses}
        value={typeof value === "string" ? value : value.value}
        onInput$={onInput$}
        onKeyUp$={(e) => e.key === "Enter" && onEnter$?.()}
        disabled={disabled}
      />
    </div>
  );
});
