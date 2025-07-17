import { component$, Slot } from "@builder.io/qwik";
import { useCheckRole } from "~/hooks/useCheckRole";
import { NavigationKader } from "~/components/layout";
import { Breadcrumbs } from "~/components/layout/Breadcrumbs";

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
