import { component$, Slot } from "@builder.io/qwik";
import { useCheckRole } from "~/hooks/useCheckRole";
import { Navigation, Breadcrumbs, SidebarMenuItem } from "~/components/layout";
import { getPsikologMenuItems } from "~/data/psikolog-navigation-data";
import { LuBarChart } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  // const location = useLocation(); // Removed unused variable
  useCheckRole(["psikolog"]);

  const menuItems = getPsikologMenuItems();

  return (
    <div class="min-h-screen bg-base-200/60">
      <Navigation />
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col p-4 md:p-8">
          <label
            for="my-drawer-4"
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
            for="my-drawer-4"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
            <li class="text-xl font-bold p-4 hidden lg:block">
              Si-DIFA Psikolog
            </li>
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
