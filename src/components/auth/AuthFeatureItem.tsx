import { component$ } from "@qwik.dev/core";
import type { FunctionComponent } from "@qwik.dev/core";

interface AuthFeatureItemProps {
  icon: FunctionComponent<{ class?: string }>;
  title: string;
  description: string;
  iconBgClass: string; // e.g., "bg-primary/10"
  iconColorClass: string; // e.g., "text-primary"
}

export const AuthFeatureItem = component$((props: AuthFeatureItemProps) => {
  const { icon: Icon, title, description, iconBgClass, iconColorClass } = props;
  return (
    <div class="card flex-row items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm">
      <div class={`${iconBgClass} p-2 rounded-md`}>
        <Icon class={`w-5 h-5 ${iconColorClass}`} />
      </div>
      <div>
        <h3 class="font-semibold text-base-content mb-1">{title}</h3>
        <p class="text-sm text-base-content/70">{description}</p>
      </div>
    </div>
  );
});
