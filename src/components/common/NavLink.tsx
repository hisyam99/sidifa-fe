import { component$, QRL, Slot } from "@qwik.dev/core";
import { useLocation, Link } from "@qwik.dev/router";
import type { FunctionComponent } from "@qwik.dev/core";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: FunctionComponent<{ class?: string }>;
  onClick$?: QRL<() => void>;
}

export const NavLink = component$((props: NavLinkProps) => {
  const { href, label, icon: Icon, onClick$ } = props;
  const loc = useLocation();
  const isActive = loc.url.pathname === href;

  return (
    <li>
      <Link
        href={href}
        onClick$={onClick$}
        class={`flex items-center gap-3 hover:bg-primary/10 ${
          isActive ? "active bg-primary/10" : ""
        }`}
      >
        {Icon && <Icon class="w-5 h-5 text-primary" />}
        <span class="font-medium">{label}</span>
        <Slot /> {/* For additional content like badges or counters */}
      </Link>
    </li>
  );
});
