import { component$, QRL } from "@builder.io/qwik";

interface FooterLinkProps {
  href?: string;
  onClick$?: QRL<() => void>;
  label: string;
  isButton?: boolean; // To differentiate between a link and a button with link styling
}

export const FooterLink = component$((props: FooterLinkProps) => {
  const { href, onClick$, label, isButton = false } = props;

  if (isButton) {
    return (
      <button
        onClick$={onClick$}
        class="link link-hover text-sm text-base-content/60 hover:text-primary transition-colors duration-300"
      >
        {label}
      </button>
    );
  }

  return (
    <li>
      <a
        href={href}
        class="link link-hover text-sm hover:text-primary transition-colors duration-300"
      >
        {label}
      </a>
    </li>
  );
});
