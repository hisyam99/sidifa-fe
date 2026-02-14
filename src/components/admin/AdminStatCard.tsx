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
    <div class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Subtle top accent line */}
      <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent"></div>

      <div class="relative z-1 flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
            {title}
          </p>
          <p class="mt-2 text-3xl font-extrabold leading-none tracking-tight text-base-content">
            {value}
          </p>
          <p class="mt-1.5 text-xs text-base-content/50 line-clamp-1">
            {description}
          </p>
        </div>
        <div class="shrink-0">
          <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {Icon && <Icon class="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* Hover accent glow */}
      <div class="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
    </div>
  );
});
