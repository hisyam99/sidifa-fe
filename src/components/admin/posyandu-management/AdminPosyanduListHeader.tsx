import { component$ } from "@qwik.dev/core";

interface AdminPosyanduListHeaderProps {
  title: string;
  description: string;
}

export const AdminPosyanduListHeader = component$(
  (props: AdminPosyanduListHeaderProps) => {
    const { title, description } = props;
    return (
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-base-content/70 text-lg">{description}</p>
      </div>
    );
  },
);
