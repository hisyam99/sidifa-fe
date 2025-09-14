import { component$, QRL } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

interface FooterLinkProps {
  href?: string;
  onClick$?: QRL<() => void>;
  label: string;
  isButton?: boolean; // To differentiate between a link and a button with link styling
}

export const FooterLink = component$((props: FooterLinkProps) => {
  const { href, onClick$, label, isButton = false } = props;

  const baseClass =
    "link link-hover text-sm text-base-content/70 hover:text-primary transition-colors duration-300";

  if (isButton) {
    return (
      <button onClick$={onClick$} class={baseClass} aria-label={label}>
        {label}
      </button>
    );
  }

  return (
    <li>
      <Link href={href} class={baseClass} aria-label={label}>
        {label}
      </Link>
    </li>
  );
});
