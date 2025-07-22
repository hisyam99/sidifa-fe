import { component$ } from "@qwik.dev/core";

interface AuthProcessStepProps {
  icon: any; // Lucide icon component
  title: string;
  description: string;
  iconBgClass: string; // e.g., "bg-primary/10"
  iconColorClass: string; // e.g., "text-primary"
}

export const AuthProcessStep = component$((props: AuthProcessStepProps) => {
  const { icon: Icon, title, description, iconBgClass, iconColorClass } = props;
  return (
    <div class="flex items-start gap-4 p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
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
