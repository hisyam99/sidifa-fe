import { component$, Slot } from "@builder.io/qwik";

interface CardProps {
  class?: string;
  shadow?: boolean;
}

export default component$<CardProps>(
  ({ class: className = "", shadow = true }) => {
    const cardClasses = `card bg-base-100 ${shadow ? "shadow-xl" : ""} ${className}`;

    return (
      <div class={cardClasses}>
        <div class="card-body">
          <Slot />
        </div>
      </div>
    );
  },
);
