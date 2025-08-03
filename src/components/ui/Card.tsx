import { component$, Slot } from "@builder.io/qwik";

interface CardProps {
  class?: string;
  shadow?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export default component$<CardProps>(
  ({
    class: className = "",
    shadow = true,
    bordered = true,
    compact = false,
  }) => {
    const cardClasses = `card bg-base-100 ${shadow ? "shadow-lg" : ""} ${bordered ? "border border-base-300" : ""} ${compact ? "card-compact" : ""} ${className}`;

    return (
      <div class={cardClasses}>
        <div class="card-body">
          <Slot />
        </div>
      </div>
    );
  },
);
