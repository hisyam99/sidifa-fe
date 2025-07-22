import { component$, Slot } from "@qwik.dev/core";
import { useCheckRole } from "~/hooks/useCheckRole";
import { NavigationKader } from "~/components/layout"; // Use the unified Navigation
import { Breadcrumbs } from "~/components/layout"; // Import from unified layout index

export default component$(() => {
  useCheckRole(["kader"]);

  return (
    <div class="min-h-screen bg-base-200/60">
      <NavigationKader />
      <main class="container mx-auto p-4 md:p-8">
        <Breadcrumbs />
        <Slot />
      </main>
    </div>
  );
});
