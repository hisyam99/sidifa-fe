import { component$, Slot } from "@qwik.dev/core";

interface ProfileSectionProps {
  title: string;
  icon?: any; // Lucide icon component
}

export const ProfileSection = component$((props: ProfileSectionProps) => {
  const { title, icon: Icon } = props;
  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-6">
        <h2 class="card-title text-xl font-bold mb-4 flex items-center gap-2">
          {Icon && <Icon class="w-5 h-5 text-primary" />}
          {title}
        </h2>
        <Slot />
      </div>
    </div>
  );
});
