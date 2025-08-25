import { component$ } from "@builder.io/qwik";
import type { FunctionComponent } from "@builder.io/qwik";

interface StatisticCardProps {
  title: string; // Added title prop
  icon: FunctionComponent<{ class?: string }>;
  value: string;
  description: string;
  iconBgGradientClass: string; // e.g., "bg-gradient-primary"
  valueTextColorClass: string; // e.g., "text-gradient-primary"
}

export const StatisticCard = component$((props: StatisticCardProps) => {
  const {
    title, // Destructure title
    icon: Icon,
    value,
    description,
    iconBgGradientClass,
    valueTextColorClass,
  } = props;
  return (
    <div class="card text-center p-6 bg-base-100 shadow-md">
      <div
        class={`${iconBgGradientClass} rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg`}
      >
        <Icon class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-semibold text-base-content/80 mb-1">{title}</h3>{" "}
      {/* Display title */}
      <h3 class={`text-3xl font-bold ${valueTextColorClass} mb-2`}>{value}</h3>
      <p class="text-base-content/70 text-sm">{description}</p>
    </div>
  );
});
