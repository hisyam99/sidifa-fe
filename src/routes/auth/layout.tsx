import { component$, Slot } from "@builder.io/qwik";
import { LuHeart } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <main class="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Floating Elements */}
      <div class="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        class="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"
        style="animation-delay: 1s;"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse-slow"
        style="animation-delay: 2s;"
      ></div>

      <div class="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div class="text-center mb-8">
          <a
            href="/"
            class="inline-flex items-center gap-3 mb-4 hover:scale-105 transition-transform duration-300"
          >
            <div class="avatar placeholder">
              <div class="bg-gradient-primary  rounded-full w-12 h-12 shadow-lg">
                <LuHeart class="w-6 h-6" />
              </div>
            </div>
            <div class="flex flex-col items-start">
              <span class="font-bold text-xl text-gradient-primary">
                SIDIFA
              </span>
              <span class="text-sm text-base-content/60 font-medium">
                Sistem Informasi Difabel
              </span>
            </div>
          </a>
        </div>

        <Slot />
      </div>
    </main>
  );
});
