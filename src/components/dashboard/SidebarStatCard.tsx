import { component$ } from "@builder.io/qwik";

interface SidebarStatCardProps {
  label: string;
  value: string | number;
}

export const SidebarStatCard = component$((props: SidebarStatCardProps) => {
  const { label, value } = props;
  return (
    <div class="flex justify-between">
      <span>{label}</span>
      <span class="font-bold text-primary">{value}</span>
    </div>
  );
});
