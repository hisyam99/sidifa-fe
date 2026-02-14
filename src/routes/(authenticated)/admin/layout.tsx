import { component$, Slot } from "@builder.io/qwik";
import { useCheckRole } from "~/hooks/useCheckRole";
import { Breadcrumbs, NavigationAdmin } from "~/components/layout";
import { Sidebar } from "~/components/common/Sidebar";
import { getAdminMenuItems } from "~/data/admin-navigation-data";
import { LuMenu } from "~/components/icons/lucide-optimized";

export default component$(() => {
  useCheckRole(["admin"]);
  const menuItems = getAdminMenuItems();

  return (
    <>
      <NavigationAdmin />
      <div class="min-h-screen bg-base-200/50">
        <div class="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

          {/* Main content area — full width, no container constraint */}
          <div class="drawer-content flex flex-col min-h-[calc(100vh-4rem)]">
            <div class="flex-1 p-4 md:p-6 lg:p-8">
              {/* Mobile sidebar toggle */}
              <label
                for="my-drawer-2"
                class="btn btn-ghost btn-sm gap-2 drawer-button lg:hidden mb-4 -ml-1"
              >
                <LuMenu class="w-5 h-5" />
                <span class="text-sm font-medium">Menu</span>
              </label>

              <Breadcrumbs />

              <main class="transition-all duration-200">
                <Slot />
              </main>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar menuItems={menuItems} drawerId="my-drawer-2" />
        </div>
      </div>
    </>
  );
});
