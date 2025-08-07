import { component$, QRL, $ } from "@builder.io/qwik";
import type { PresensiIBKItem, PresensiStatus } from "~/types";
import {
  LuCheck,
  LuInfo,
  LuX,
  LuXCircle,
} from "~/components/icons/lucide-optimized";
import { Spinner } from "~/components/ui/Spinner";

interface PresensiIBKTableProps {
  items: PresensiIBKItem[];
  loading?: boolean;
  onUpdateStatus$?: QRL<(id: string, status: PresensiStatus) => void>;
  onDetail$?: QRL<(id: string) => void>;
}

const statusBadgeClass: Record<PresensiStatus, string> = {
  BELUM_HADIR: "badge badge-outline",
  HADIR: "badge badge-success",
  SAKIT: "badge badge-warning",
  IZIN: "badge badge-info",
};

export const PresensiIBKTable = component$<PresensiIBKTableProps>(
  ({ items, loading, onUpdateStatus$, onDetail$ }) => {
    return (
      <div class="overflow-x-auto bg-base-100 p-2">
        <h2 class="text-lg font-bold mb-2 md:card-title md:text-xl md:mb-4">
          Daftar Presensi IBK
        </h2>
        <div class="relative overflow-x-auto">
          {loading && <Spinner overlay />}
          <div class="max-h-[60vh] overflow-y-auto">
            <table class="table table-xs xl:table-md w-full">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NIK</th>
                  <th>Alamat</th>
                  <th>Status</th>
                  <th class="table-pin-col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      class="text-center text-base-content/60 py-8"
                    >
                      Belum ada data presensi.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id}>
                      <td class="max-w-[200px] whitespace-normal break-words">
                        {row.ibk?.nama || "-"}
                      </td>
                      <td>{row.ibk?.nik || "-"}</td>
                      <td
                        class="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={row.ibk?.alamat}
                      >
                        {row.ibk?.alamat || "-"}
                      </td>
                      <td>
                        <span
                          class={
                            statusBadgeClass[
                              (row.status_presensi as PresensiStatus) ||
                                "BELUM_HADIR"
                            ]
                          }
                        >
                          {row.status_presensi || "BELUM_HADIR"}
                        </span>
                      </td>
                      <td class="table-pin-col">
                        <div class="flex gap-2">
                          {onDetail$ && (
                            <button
                              class="btn btn-ghost btn-xs md:btn-sm"
                              onClick$={$(() => onDetail$(row.id))}
                            >
                              <LuInfo class="w-4 h-4" />
                              <span class="hidden xl:inline ml-1">Detail</span>
                            </button>
                          )}
                          {onUpdateStatus$ && (
                            <div class="join">
                              <button
                                class="btn btn-success btn-xs md:btn-sm join-item"
                                onClick$={$(() =>
                                  onUpdateStatus$(row.id, "HADIR"),
                                )}
                                title="Hadir"
                              >
                                <LuCheck class="w-4 h-4" />
                              </button>
                              <button
                                class="btn btn-warning btn-xs md:btn-sm join-item"
                                onClick$={$(() =>
                                  onUpdateStatus$(row.id, "SAKIT"),
                                )}
                                title="Sakit"
                              >
                                <LuXCircle class="w-4 h-4" />
                              </button>
                              <button
                                class="btn btn-info btn-xs md:btn-sm join-item"
                                onClick$={$(() =>
                                  onUpdateStatus$(row.id, "IZIN"),
                                )}
                                title="Izin"
                              >
                                <LuCheck class="w-4 h-4" />
                              </button>
                              <button
                                class="btn btn-outline btn-xs md:btn-sm join-item"
                                onClick$={$(() =>
                                  onUpdateStatus$(row.id, "BELUM_HADIR"),
                                )}
                                title="Belum Hadir"
                              >
                                <LuX class="w-4 h-4" />
                              </button>
                            </div>
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
  },
);
