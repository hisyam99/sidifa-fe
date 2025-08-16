import { component$ } from "@builder.io/qwik";
import { MegaMenu } from "./MegaMenu";

export const MegaMenuDemo = component$(() => {
  return (
    <div class="p-8 bg-base-200 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">
          MegaMenu Demo dengan Hover Delay
        </h1>

        <div class="flex justify-center gap-8">
          {/* Demo 1: Default delay (300ms) */}
          <MegaMenu delayMs={300}>
            <button q:slot="trigger" class="btn btn-primary">
              Menu 1 (300ms delay)
            </button>
            <div
              q:slot="content"
              class="bg-base-100 border rounded-lg shadow-lg p-4 w-64"
            >
              <h3 class="font-semibold mb-2">Menu Content 1</h3>
              <p class="text-sm text-base-content/70">
                Hover dan lepas untuk melihat delay 300ms
              </p>
            </div>
          </MegaMenu>

          {/* Demo 2: Custom delay (500ms) */}
          <MegaMenu delayMs={500}>
            <button q:slot="trigger" class="btn btn-secondary">
              Menu 2 (500ms delay)
            </button>
            <div
              q:slot="content"
              class="bg-base-100 border rounded-lg shadow-lg p-4 w-64"
            >
              <h3 class="font-semibold mb-2">Menu Content 2</h3>
              <p class="text-sm text-base-content/70">
                Hover dan lepas untuk melihat delay 500ms
              </p>
            </div>
          </MegaMenu>

          {/* Demo 3: Long delay (1000ms) */}
          <MegaMenu delayMs={1000}>
            <button q:slot="trigger" class="btn btn-accent">
              Menu 3 (1000ms delay)
            </button>
            <div
              q:slot="content"
              class="bg-base-100 border rounded-lg shadow-lg p-4 w-64"
            >
              <h3 class="font-semibold mb-2">Menu Content 3</h3>
              <p class="text-sm text-base-content/70">
                Hover dan lepas untuk melihat delay 1000ms
              </p>
            </div>
          </MegaMenu>
        </div>

        <div class="mt-8 text-center">
          <p class="text-base-content/70">
            Coba hover pada menu di atas dan lepas untuk melihat efek delay yang
            berbeda
          </p>
        </div>
      </div>
    </div>
  );
});
