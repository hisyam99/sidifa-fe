import { component$, QRL } from "@qwik.dev/core";
import type { FunctionComponent } from "@qwik.dev/core";

interface SocialButtonProps {
  icon: FunctionComponent<{ class?: string }>;
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
      type="button"
    >
      <Icon class="w-5 h-5 text-primary" aria-hidden="true" />
    </button>
  );
});
