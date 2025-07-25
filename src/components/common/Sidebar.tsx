import { component$, Slot } from "@qwik.dev/core";
import { SidebarMenuItem } from "~/components/layout/SidebarMenuItem";

export interface SidebarMenuItemType {
  href: string;
  label: string;
  icon?: any; // Accepts a Qwik/React component, not QRL
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
    <aside class={`drawer-side z-40 ${props.class ?? "pt-16"}`}>
      <label
        for={props.drawerId}
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul
        class={`bg-base-100 lg:bg-transparent menu p-4 w-80 min-h-full text-base-content`}
      >
        <li class="text-xl font-bold p-4 hidden lg:block">{props.title}</li>
        {props.menuItems.map((item) => (
          <SidebarMenuItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
        <Slot />
      </ul>
    </aside>
  );
});
