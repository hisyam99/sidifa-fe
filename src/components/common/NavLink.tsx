import { component$, QRL, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: any; // Lucide icon component
  onClick$?: QRL<() => void>;
}

export const NavLink = component$((props: NavLinkProps) => {
  const { href, label, icon: Icon, onClick$ } = props;
  const loc = useLocation();
  const isActive = loc.url.pathname === href;

  return (
    <li>
      <a
        href={href}
        onClick$={onClick$}
        class={`flex items-center gap-3 hover:bg-primary/10 ${
          isActive ? "active bg-primary/10" : ""
        }`}
      >
        {Icon && <Icon class="w-5 h-5 text-primary" />}
        <span class="font-medium">{label}</span>
        <Slot /> {/* For additional content like badges or counters */}
      </a>
    </li>
  );
});
