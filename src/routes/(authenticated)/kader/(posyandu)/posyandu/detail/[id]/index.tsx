// File: /sidifa-fev2/src/routes/posyandu/index.tsx

import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { getPosyanduDetail } from "~/services/api";
import type { PosyanduDetail } from "~/types";
import { extractErrorMessage } from "~/utils/error";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.id;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<PosyanduDetail | null>(null);

  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getPosyanduDetail(id);
      data.value = res;
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="max-w-xl mx-auto mt-8 card bg-base-100 shadow-xl p-6">
      <h1 class="text-2xl font-bold mb-4">Detail Posyandu</h1>
      {loading.value && <div>Loading...</div>}
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}
      {data.value && !loading.value && !error.value && (
        <div class="space-y-3">
          <div>
            <b>Nama Posyandu:</b> {data.value.nama_posyandu}
          </div>
          <div>
            <b>Alamat:</b> {data.value.alamat}
          </div>
          <div>
            <b>No. Telp:</b> {data.value.no_telp}
          </div>
          <div>
            <b>ID:</b> {data.value.id}
          </div>
          <div>
            <b>User ID:</b> {data.value.users_id}
          </div>
          <div>
            <b>Dibuat pada:</b>{" "}
            {new Date(data.value.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
});
