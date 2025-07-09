import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { SidifaHeader, SidifaFooter, Navigation } from "~/components/layout";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <SidifaHeader />
      <Navigation />
      <main class="min-h-screen">
        <Slot />
      </main>
      <SidifaFooter />
    </>
  );
});
