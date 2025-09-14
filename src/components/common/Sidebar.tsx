import { component$, Slot } from "@qwik.dev/core";
import { SidebarMenuItem } from "~/components/layout/SidebarMenuItem";
import type { FunctionComponent } from "@qwik.dev/core";

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
  title: string;
  menuItems: SidebarMenuItemType[];
  drawerId: string;
  class?: string;
  ptClass?: string; // padding-top class, e.g. "pt-16"
}

export const Sidebar = component$<SidebarProps>((props) => {
  return (
    <aside
      class={`z-20 drawer-side h-screen pt-16 lg:pt-0 ${props.class ?? ""}`}
    >
      <label
        for={props.drawerId}
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="h-full p-2 md:py-4 bg-base-100/95 lg:bg-transparent backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
        {/* Header dihapus total sesuai permintaan */}
        <ul class="menu px-2 py-3 gap-1">
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
      </div>
    </aside>
  );
});
