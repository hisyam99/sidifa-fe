import { component$, Slot } from "@builder.io/qwik";
import type { JSXChildren } from "@builder.io/qwik";

interface ProfileSectionProps {
  title: string;
  icon?: JSXChildren;
}

export const ProfileSection = component$((props: ProfileSectionProps) => {
  const { title, icon } = props;
  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-6">
        <h2 class="card-title text-xl font-bold mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <Slot />
      </div>
    </div>
  );
});
