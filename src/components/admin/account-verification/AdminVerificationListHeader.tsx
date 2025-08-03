import { component$ } from "@builder.io/qwik";

interface AdminVerificationListHeaderProps {
  title: string;
  description: string;
}

export const AdminVerificationListHeader = component$(
  (props: AdminVerificationListHeaderProps) => {
    const { title, description } = props;
    return (
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-base-content/70 text-lg">{description}</p>
      </div>
    );
  },
);
