import { component$, QRL } from "@builder.io/qwik";

interface SocialButtonProps {
  icon: any; // Lucide icon component
  ariaLabel: string;
  onClick$?: QRL<() => void>;
}

export const SocialButton = component$((props: SocialButtonProps) => {
  const { icon: Icon, ariaLabel, onClick$ } = props;
  return (
    <button
      class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 transition-all duration-300"
      aria-label={ariaLabel}
      onClick$={onClick$}
    >
      <Icon class="w-5 h-5 text-primary" />
    </button>
  );
});
