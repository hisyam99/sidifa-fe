import { component$ } from "@qwik.dev/core";
import type { FunctionComponent } from "@qwik.dev/core";

interface AdminStatCardProps {
  title: string;
  value: string;
  icon: FunctionComponent<{ class?: string }>;
  description: string;
}

export const AdminStatCard = component$((props: AdminStatCardProps) => {
  const { title, value, icon: Icon, description } = props;
  return (
    <div class="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300 will-change-transform">
      {/* subtle glass gradient edge */}
      <div class="pointer-events-none absolute inset-px rounded-[1rem] bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-70"></div>

      <div class="relative z-[1] flex items-start justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-base-content/80 tracking-wide">
            {title}
          </h2>
          <p class="mt-1 text-3xl font-extrabold leading-none text-base-content/90">
            {value}
          </p>
          <p class="mt-1 text-xs text-base-content/60 line-clamp-2">
            {description}
          </p>
        </div>
        <div class="shrink-0 text-primary/90">
          {Icon && (
            <Icon class="h-7 w-7 md:h-8 md:w-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>
      </div>

      {/* animated accent blur blob */}
      <div class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
    </div>
  );
});
