import { component$ } from "@builder.io/qwik";
import type { FunctionComponent } from "@builder.io/qwik";

interface AdminStatCardProps {
  title: string;
  value: string;
  icon: FunctionComponent<{ class?: string }>;
  description: string;
}

export const AdminStatCard = component$((props: AdminStatCardProps) => {
  const { title, value, icon: Icon, description } = props;
  return (
    <div class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow duration-200">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="card-title text-base-content text-lg font-semibold">
            {title}
          </h2>
          <div class="text-primary">{Icon && <Icon class="w-7 h-7" />}</div>
        </div>
        <p class="text-4xl font-bold text-base-content mb-1">{value}</p>
        <p class="text-sm text-base-content/70">{description}</p>
      </div>
    </div>
  );
});
