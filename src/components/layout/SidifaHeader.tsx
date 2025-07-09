import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <header class="bg-primary text-primary-content p-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold">SIDIFA</h1>
            <p class="text-sm opacity-90">
              Sistem Informasi Digital Posyandu dan Psikolog
            </p>
          </div>
        </div>
      </div>
    </header>
  );
});
