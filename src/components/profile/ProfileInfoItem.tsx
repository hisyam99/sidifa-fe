import { component$ } from "@builder.io/qwik";

interface ProfileInfoItemProps {
  label: string;
  value: string;
  icon?: any; // Lucide icon component
}

export const ProfileInfoItem = component$((props: ProfileInfoItemProps) => {
  const { label, value, icon: Icon } = props;
  return (
    <div class="flex items-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
      {Icon && <Icon class="w-5 h-5 text-primary" />}
      <div>
        <p class="text-sm text-base-content/60">{label}</p>
        <p class="font-semibold text-base-content">{value}</p>
      </div>
    </div>
  );
});
