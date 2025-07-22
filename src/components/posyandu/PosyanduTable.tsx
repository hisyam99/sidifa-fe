import { component$, Signal, QRL } from "@qwik.dev/core";
import { LuLoader2 } from "~/components/icons/lucide-optimized"; // Updated import path
import type { PosyanduItem } from "~/types/posyandu";

interface PosyanduTableProps {
  posyanduList: Signal<PosyanduItem[]>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  onRegister$?: QRL<(posyanduId: string) => Promise<void>>;
}

export const PosyanduTable = component$((props: PosyanduTableProps) => {
  const { posyanduList, loading, error } = props;

  return (
    <div class="card bg-base-100 shadow-xl relative">
      <div class="card-body">
        <h2 class="card-title text-xl font-bold mb-4">Daftar Posyandu</h2>

        {error.value && (
          <div class="alert alert-error mb-4">
            <span>{error.value}</span>
          </div>
        )}

        {loading.value && (
          <div class="absolute inset-0 bg-base-100/70 rounded-3xl flex justify-center items-center z-10">
            <LuLoader2
              class="animate-spin text-primary"
              style={{ width: "32px", height: "32px" }}
            />
          </div>
        )}

        <div
          class={`overflow-x-auto ${loading.value ? "pointer-events-none opacity-60" : ""}`}
        >
          <table class="table w-full">
            <thead>
              <tr>
                <th>Nama Posyandu</th>
                <th>Alamat</th>
                <th>No. Telp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posyanduList.value.length === 0 &&
              !loading.value &&
              !error.value ? (
                <tr>
                  <td colSpan={4} class="text-center text-base-content/60 py-8">
                    Tidak ada data posyandu.
                  </td>
                </tr>
              ) : (
                posyanduList.value.map((posyandu) => (
                  <tr key={posyandu.id}>
                    <td class="font-medium">{posyandu.nama_posyandu}</td>
                    <td>{posyandu.alamat}</td>
                    <td>{posyandu.no_telp}</td>
                    <td>
                      <div class="flex gap-2">
                        {posyandu.isRegistered ? (
                          <button class="btn btn-secondary btn-sm" disabled>
                            Terdaftar
                          </button>
                        ) : (
                          <button
                            class="btn btn-secondary btn-sm"
                            onClick$={async () => {
                              if (props.onRegister$) {
                                await props.onRegister$(posyandu.id);
                              }
                            }}
                          >
                            Daftar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
