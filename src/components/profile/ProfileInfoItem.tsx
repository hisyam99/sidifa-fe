import { component$ } from "@qwik.dev/core";
import type { JSXChildren } from "@qwik.dev/core";

interface ProfileInfoItemProps {
  label: string;
  value: string;
  icon?: JSXChildren;
}

export const ProfileInfoItem = component$((props: ProfileInfoItemProps) => {
  const { label, value, icon } = props;
  return (
    <div class="flex items-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
      {icon}
      <div>
        <p class="text-sm text-base-content/60">{label}</p>
        <p class="font-semibold text-base-content">{value}</p>
      </div>
    </div>
  );
});
