// File: /sidifa-fev2/src/routes/posyandu/index.tsx

import { component$, useSignal, useTask$ } from "@qwik.dev/core";
import { useAuth } from "~/hooks/useAuth";
import { useLocation } from "@qwik.dev/router";
import { getPosyanduDetail } from "~/services/api";
import type { PosyanduDetail } from "~/types";
import { extractErrorMessage } from "~/utils/error";

export default component$(() => {
  const loc = useLocation();
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<PosyanduDetail | null>(null);

  const { isLoggedIn } = useAuth(); // Get isLoggedIn

  useTask$(async ({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes
    const idParam = track(() => loc.params.id); // Track id parameter directly

    if (isLoggedIn.value && idParam) {
      loading.value = true;
      error.value = null;
      try {
        const res = await getPosyanduDetail(idParam);
        data.value = res;
      } catch (err: any) {
        error.value = extractErrorMessage(err);
      } finally {
        loading.value = false;
      }
    } else if (!isLoggedIn.value) {
      data.value = null;
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
      loading.value = false;
    }
  });

  return (
    <div class="max-w-xl mx-auto mt-8 card bg-base-100 shadow-xl p-6">
      <h1 class="text-2xl font-bold mb-4">Detail Posyandu</h1>
      {loading.value && <div>Loading...</div>}
      {error.value && (
        <div class="alert alert-error mb-4" role="alert">
          {error.value}
        </div>
      )}
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
      {!data.value && !loading.value && !error.value && (
        <div class="alert alert-warning" role="alert">
          Data tidak ditemukan atau tidak tersedia.
        </div>
      )}
    </div>
  );
});
