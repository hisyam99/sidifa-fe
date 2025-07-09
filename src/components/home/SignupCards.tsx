import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui";

export default component$(() => {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <Card class="text-center hover:shadow-xl transition-shadow duration-300">
        <div class="avatar placeholder mb-6">
          <div class="bg-primary text-primary-content rounded-full w-20">
            <span class="text-3xl">🏥</span>
          </div>
        </div>
        <h2 class="card-title text-2xl mb-4 justify-center">Posyandu</h2>
        <p class="text-base-content/70 mb-6">
          Daftar sebagai Posyandu untuk mengelola data kesehatan masyarakat dan
          memberikan layanan kesehatan terpadu.
        </p>
        <div class="card-actions justify-center">
          <a href="/auth/signup/posyandu" class="btn btn-primary btn-lg">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Daftar Posyandu
          </a>
        </div>
      </Card>

      <Card class="text-center hover:shadow-xl transition-shadow duration-300">
        <div class="avatar placeholder mb-6">
          <div class="bg-secondary text-secondary-content rounded-full w-20">
            <span class="text-3xl">🧠</span>
          </div>
        </div>
        <h2 class="card-title text-2xl mb-4 justify-center">Psikolog</h2>
        <p class="text-base-content/70 mb-6">
          Daftar sebagai Psikolog untuk memberikan layanan konseling dan
          dukungan kesehatan mental.
        </p>
        <div class="card-actions justify-center">
          <a href="/auth/signup/psikolog" class="btn btn-secondary btn-lg">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Daftar Psikolog
          </a>
        </div>
      </Card>
    </div>
  );
});
