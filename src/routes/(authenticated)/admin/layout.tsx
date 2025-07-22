import { component$, Slot } from "@builder.io/qwik";
import { useCheckRole } from "~/hooks/useCheckRole";
import {
  Breadcrumbs,
  SidebarMenuItem,
  NavigationAdmin,
} from "~/components/layout";
import { getAdminMenuItems } from "~/data/admin-navigation-data";
import { LuBarChart } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  // const location = useLocation(); // Removed as it's unused
  useCheckRole(["admin"]);

  const menuItems = getAdminMenuItems();

  return (
    <div class="min-h-screen bg-base-200/60">
      <NavigationAdmin />
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col p-4 md:p-8">
          <label
            for="my-drawer-2"
            class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            <LuBarChart class="w-5 h-5" />
            Buka Menu
          </label>
          <Breadcrumbs />
          <main class="bg-base-100 p-6 rounded-2xl shadow-lg">
            <Slot />
          </main>
        </div>
        <aside class="drawer-side z-40">
          <label
            for="my-drawer-2"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
            <li class="text-xl font-bold p-4 hidden lg:block">Si-DIFA Admin</li>
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
});
