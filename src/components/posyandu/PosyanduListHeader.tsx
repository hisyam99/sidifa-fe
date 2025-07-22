import { component$ } from "@qwik.dev/core";

interface PosyanduListHeaderProps {
  title: string;
  description: string;
}

export const PosyanduListHeader = component$(
  (props: PosyanduListHeaderProps) => {
    const { title, description } = props;
    return (
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-base-content/70 text-lg">{description}</p>
      </div>
    );
  },
);
