import { component$, QRL } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon: any; // Lucide icon component
  onClick$?: QRL<() => void>;
}

export const SidebarMenuItem = component$((props: SidebarMenuItemProps) => {
  const { href, label, icon: Icon, onClick$ } = props;
  const location = useLocation();

  const isActive = location.url.pathname === href;

  return (
    <li class={isActive ? "bordered" : ""}>
      <a href={href} onClick$={onClick$}>
        {Icon && <Icon class="w-5 h-5" />}
        {label}
      </a>
    </li>
  );
});
