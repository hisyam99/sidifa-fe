import { component$ } from "@builder.io/qwik";
import Card from "~/components/ui/Card";

export default component$(() => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card>
        <h2 class="card-title text-2xl mb-4">Posyandu</h2>
        <p class="text-gray-600 mb-4">
          Daftar sebagai Posyandu untuk mengelola data kesehatan masyarakat.
        </p>
        <div class="card-actions justify-center">
          <a href="/signup-posyandu" class="btn btn-primary">
            Daftar Posyandu
          </a>
        </div>
      </Card>

      <Card>
        <h2 class="card-title text-2xl mb-4">Psikolog</h2>
        <p class="text-gray-600 mb-4">
          Daftar sebagai Psikolog untuk memberikan layanan konseling.
        </p>
        <div class="card-actions justify-center">
          <a href="/signup-psikolog" class="btn btn-secondary">
            Daftar Psikolog
          </a>
        </div>
      </Card>
    </div>
  );
});
