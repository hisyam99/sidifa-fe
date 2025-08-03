import { component$ } from "@builder.io/qwik";

interface AdminPsikologListHeaderProps {
  title: string;
  description: string;
}

export const AdminPsikologListHeader = component$(
  (props: AdminPsikologListHeaderProps) => {
    const { title, description } = props;
    return (
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-base-content/70 text-lg">{description}</p>
      </div>
    );
  },
);
