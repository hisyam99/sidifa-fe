import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <main class="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div class="container mx-auto py-8 px-4">
        <Slot />
      </div>
    </main>
  );
});
