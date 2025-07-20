import { component$, QRL, Signal } from "@builder.io/qwik";
import { LuSearch } from "~/components/icons/lucide-optimized"; // Updated import path

export interface SearchBoxProps {
  // Export the interface
  id?: string;
  placeholder: string;
  value: string | Signal<string>; // Can accept string or Signal<string>
  onInput$?: QRL<(event: Event) => void>; // Accepts a standard input event
  onEnter$?: QRL<() => void>;
  class?: string;
}

export const SearchBox = component$((props: SearchBoxProps) => {
  const {
    id,
    placeholder,
    value,
    onInput$,
    onEnter$,
    class: className,
  } = props;

  return (
    <div class={className}>
      <div class="relative">
        <LuSearch class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          class="input input-bordered w-full pl-12 pr-4 py-3 text-lg shadow-lg focus:shadow-xl transition-shadow duration-300"
          value={typeof value === "string" ? value : value.value} // Handle both string and Signal<string>
          onInput$={onInput$}
          onKeyUp$={(e) => e.key === "Enter" && onEnter$?.()}
        />
      </div>
    </div>
  );
});
