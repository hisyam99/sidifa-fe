import { component$, Slot } from "@builder.io/qwik";

interface DebugSectionProps {
  title: string;
}

export const DebugSection = component$((props: DebugSectionProps) => {
  const { title } = props;
  return (
    <div class="bg-base-200 p-6 rounded-lg mb-6">
      <h2 class="text-lg font-semibold mb-4">{title}</h2>
      <Slot />
    </div>
  );
});
