import { component$ } from "@qwik.dev/core";
import type { FunctionComponent } from "@qwik.dev/core";

interface FeatureCardProps {
  icon: FunctionComponent<{ class?: string }>;
  title: string;
  description: string;
}

export const FeatureCard = component$((props: FeatureCardProps) => {
  const { icon: Icon, title, description } = props;
  return (
    <div class="flex items-center justify-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
      <Icon class="w-6 h-6 text-primary" />
      <div class="text-left">
        <h4 class="font-semibold text-sm">{title}</h4>
        <p class="text-xs text-base-content/60">{description}</p>
      </div>
    </div>
  );
});
