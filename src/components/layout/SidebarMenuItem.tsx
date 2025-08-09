import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import * as LucideIcons from "~/components/icons/lucide-optimized";

const ICON_LOOKUP_MAP: Record<string, any> = LucideIcons;

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon?: any; // accept component reference or string key
}

export const SidebarMenuItem = component$((props: SidebarMenuItemProps) => {
  const { href, label, icon } = props;
  const location = useLocation();

  const current = location.url.pathname;
  const isActive = current === href || current.startsWith(href + "/");
  const IconComp = typeof icon === "string" ? ICON_LOOKUP_MAP[icon] : icon;

  return (
    <li>
      <a
        href={href}
        class={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
          isActive ? "bg-primary/10 text-primary font-semibold" : ""
        }`}
      >
        {IconComp && (
          <span
            class={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? "bg-primary/15" : "bg-base-200"}`}
          >
            <IconComp class="w-4 h-4" />
          </span>
        )}
        <span class="truncate">{label}</span>
      </a>
    </li>
  );
});
