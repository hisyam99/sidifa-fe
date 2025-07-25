import { component$, Slot, useSignal, useTask$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { useCheckRole } from "~/hooks/useCheckRole";
import {
  Breadcrumbs,
  SidebarMenuItem,
  NavigationAdmin,
} from "~/components/layout";
import { getAdminMenuItems } from "~/data/admin-navigation-data";
import { LuBarChart } from "~/components/icons/lucide-optimized"; // Updated import path
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  useCheckRole(["admin"]);
  const menuItems = getAdminMenuItems();

  // Track navigation for global loading overlay
  const location = useLocation();
  const isNavigating = useSignal(false);
  const prevPath = useSignal(location.url.pathname);

  useTask$(({ track }) => {
    const currentPath = track(() => location.url.pathname);
    if (prevPath.value !== currentPath) {
      isNavigating.value = true;
      // End loading after a short delay to allow for smooth transition
      setTimeout(() => {
        isNavigating.value = false;
        prevPath.value = currentPath;
      }, 350); // Adjust duration for fade effect
    }
  });

  return (
    <div class="min-h-screen bg-base-200/60">
      <NavigationAdmin />
      <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col p-4 md:p-8 relative">
          {/* Global loading overlay */}
          {isNavigating.value && (
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-base-100/70 transition-opacity">
              <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
          <label
            for="my-drawer-2"
            class="btn btn-primary drawer-button lg:hidden mb-4 self-start"
          >
            <LuBarChart class="w-5 h-5" />
            Buka Menu
          </label>
          <Breadcrumbs />
          <AnimatedPageContainer>
            <main class="bg-base-100 p-6 rounded-2xl shadow-lg transition-all duration-300">
              <Slot />
            </main>
          </AnimatedPageContainer>
        </div>
        <aside class="drawer-side z-40">
          <label
            for="my-drawer-2"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-100 text-base-content pt-16">
            {/* pt-16 ensures sidebar starts below navbar (navbar height = 4rem) */}
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
