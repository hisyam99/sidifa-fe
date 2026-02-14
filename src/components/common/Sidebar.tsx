import { component$, Slot } from "@builder.io/qwik";
import { SidebarMenuItem } from "~/components/layout/SidebarMenuItem";
import type { FunctionComponent } from "@builder.io/qwik";

export interface SidebarMenuItemType {
  href: string;
  label: string;
  icon?: FunctionComponent<{ class?: string }>;
  exact?: boolean; // when true, only highlight on exact path match (ignoring trailing slash)
  hasDropdown?: boolean; // indicates this item has dropdown
  submenuItems?: Array<{
    href: string;
    label: string;
    icon?: FunctionComponent<{ class?: string }>;
    description?: string;
  }>;
}

export interface SidebarProps {
  title?: string; // kept optional for backward compat, no longer rendered
  menuItems: SidebarMenuItemType[];
  drawerId: string;
  class?: string;
  ptClass?: string; // deprecated, kept for backward compat
  bgClass?: string; // sidebar background, default: "bg-base-100 lg:bg-base-100/80 lg:backdrop-blur-sm"
}

export const Sidebar = component$<SidebarProps>((props) => {
  return (
    <aside
      class={`z-20 drawer-side pt-16 lg:pt-0 lg:top-16 lg:h-[calc(100vh-4rem)] ${props.class ?? ""}`}
    >
      <label
        for={props.drawerId}
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class={`h-full w-64 border-r border-base-200/60 overflow-y-auto ${props.bgClass ?? "bg-base-100 lg:bg-base-100/80 lg:backdrop-blur-sm"}`}
      >
        <nav class="p-3">
          <ul class="menu px-1 py-2 gap-0.5">
            {props.menuItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                exact={item.exact}
                hasDropdown={item.hasDropdown}
                submenuItems={item.submenuItems}
                drawerId={props.drawerId}
              />
            ))}
            <Slot />
          </ul>
        </nav>
      </div>
    </aside>
  );
});
