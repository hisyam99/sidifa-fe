import { component$, Signal, QRL } from "@builder.io/qwik";
import { Spinner } from "../ui/Spinner";
import type { PosyanduItem } from "~/types/posyandu";
import { useNavigate } from "@builder.io/qwik-city";

interface PosyanduTableProps {
  posyanduList: Signal<PosyanduItem[]>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  onRegister$?: QRL<(posyanduId: string) => Promise<void>>;
}

export const PosyanduTable = component$((props: PosyanduTableProps) => {
  const { posyanduList, loading, error } = props;
  const nav = useNavigate();

  return (
    <div class="card bg-base-100 shadow-xl relative">
      <div class="card-body">
        <h2 class="card-title text-xl font-bold mb-4">Daftar Posyandu</h2>

        {error.value && (
          <div class="alert alert-error mb-4">
            <span>{error.value}</span>
          </div>
        )}

        {loading.value && <Spinner overlay />}

        <div
          class={`overflow-x-auto ${loading.value ? "pointer-events-none opacity-60" : ""}`}
        >
          {/* Desktop table */}
          <div class="hidden md:block overflow-x-auto">
            <div class="max-h-[60vh] overflow-y-auto rounded-lg">
              <table class="table w-full table-pin-rows">
                <thead>
                  <tr class="bg-base-200">
                    <th class="bg-base-200">Nama Posyandu</th>
                    <th class="bg-base-200">Alamat</th>
                    <th class="bg-base-200">No. Telp</th>
                    <th class="bg-base-200">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {posyanduList.value.length === 0 &&
                  !loading.value &&
                  !error.value ? (
                    <tr>
                      <td
                        colSpan={4}
                        class="text-center text-base-content/60 py-8"
                      >
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
                              <button
                                class="btn btn-info btn-sm w-24"
                                onClick$={() => {
                                  loading.value = true;
                                  nav(`/kader/posyandu/${posyandu.id}`);
                                }}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                class="btn btn-secondary btn-sm w-24"
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

          {/* Mobile card list */}
          <div class="md:hidden space-y-3">
            {posyanduList.value.length === 0 &&
            !loading.value &&
            !error.value ? (
              <div class="text-center text-base-content/60 py-8">
                Tidak ada data posyandu.
              </div>
            ) : (
              posyanduList.value.map((posyandu) => (
                <div
                  key={posyandu.id}
                  class="card bg-base-100 border border-base-200 shadow-sm"
                >
                  <div class="card-body p-4">
                    <div class="font-semibold">{posyandu.nama_posyandu}</div>
                    <div class="text-sm opacity-80">{posyandu.alamat}</div>
                    <div class="text-sm mt-1">No. Telp: {posyandu.no_telp}</div>
                    <div class="mt-3">
                      {posyandu.isRegistered ? (
                        <button
                          class="btn btn-info btn-xs"
                          onClick$={() => {
                            loading.value = true;
                            nav(`/kader/posyandu/${posyandu.id}`);
                          }}
                        >
                          View
                        </button>
                      ) : (
                        <button
                          class="btn btn-secondary btn-xs"
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
