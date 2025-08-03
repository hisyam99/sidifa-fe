import { component$, QRL } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import * as LucideIcons from "~/components/icons/lucide-optimized";

const ICON_LOOKUP_MAP: Record<string, any> = LucideIcons;

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon: string; // Sekarang string, bukan any
  onClick$?: QRL<() => void>;
}

export const SidebarMenuItem = component$((props: SidebarMenuItemProps) => {
  const { href, label, icon, onClick$ } = props;
  const location = useLocation();

  const isActive = location.url.pathname === href;
  const Icon = icon ? ICON_LOOKUP_MAP[icon] : null;

  return (
    <li class={isActive ? "bordered" : ""}>
      <a href={href} onClick$={onClick$}>
        {Icon && <Icon class="w-5 h-5" />}
        {label}
      </a>
    </li>
  );
});
