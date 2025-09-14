import { component$, Slot } from "@qwik.dev/core";
import { useCheckRole } from "~/hooks/useCheckRole";
import { Breadcrumbs } from "~/components/layout";
import { Sidebar } from "~/components/common/Sidebar";
import { getPsikologMenuItems } from "~/data/psikolog-navigation-data";
import { LuBarChart } from "~/components/icons/lucide-optimized"; // Updated import path
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";

export default component$(() => {
  // const location = useLocation(); // Removed unused variable
  useCheckRole(["psikolog"]);

  const menuItems = getPsikologMenuItems();

  return (
    <div class="min-h-screen bg-base-200/60">
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
          <AnimatedPageContainer>
            <main class="bg-base-100 p-6 rounded-2xl shadow-lg">
              <Slot />
            </main>
          </AnimatedPageContainer>
        </div>
        <Sidebar
          title="Si-DIFA Psikolog"
          menuItems={menuItems}
          drawerId="my-drawer-4"
          ptClass="pt-16"
        />
      </div>
    </div>
  );
});
