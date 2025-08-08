import { component$, QRL, $, useSignal, useTask$ } from "@builder.io/qwik";
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
  onBulkUpdate$?: QRL<
    (
      updates: Array<{ user_ibk_id: string; status_presensi: PresensiStatus }>,
    ) => void
  >;
}

const statusBadgeClass: Record<PresensiStatus, string> = {
  BELUM_HADIR: "badge badge-outline",
  HADIR: "badge badge-success",
  SAKIT: "badge badge-warning",
  IZIN: "badge badge-info",
};

const statusOptions: PresensiStatus[] = [
  "BELUM_HADIR",
  "HADIR",
  "SAKIT",
  "IZIN",
];

export const PresensiIBKTable = component$<PresensiIBKTableProps>(
  ({ items, loading, onUpdateStatus$, onDetail$, onBulkUpdate$ }) => {
    const selectedIds = useSignal<Set<string>>(new Set()); // user_ibk_id set
    const selectAll = useSignal(false);
    const bulkStatus = useSignal<PresensiStatus>("BELUM_HADIR");

    useTask$(({ track }) => {
      // Reset selection when items change
      track(() => items.map((i) => i.user_ibk_id).join("|"));
      selectedIds.value = new Set();
      selectAll.value = false;
    });

    const toggleAll = $(() => {
      selectAll.value = !selectAll.value;
      if (selectAll.value) {
        selectedIds.value = new Set(items.map((i) => i.user_ibk_id));
      } else {
        selectedIds.value = new Set();
      }
    });

    const toggleOne = $((user_ibk_id: string) => {
      const next = new Set(selectedIds.value);
      if (next.has(user_ibk_id)) next.delete(user_ibk_id);
      else next.add(user_ibk_id);
      selectedIds.value = next;
      selectAll.value = next.size === items.length && items.length > 0;
    });

    const clearSelection = $(() => {
      selectedIds.value = new Set();
      selectAll.value = false;
    });

    const applyBulk = $(() => {
      if (!onBulkUpdate$) return;
      if (selectedIds.value.size === 0) return;
      const updates = Array.from(selectedIds.value).map((id) => ({
        user_ibk_id: id,
        status_presensi: bulkStatus.value,
      }));
      onBulkUpdate$(updates);
    });

    return (
      <div class="card bg-base-100 shadow-xl p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="card-title text-xl font-bold">Presensi IBK</h2>
          <div class="flex items-center gap-2 flex-wrap">
            <select
              class="select select-bordered select-sm w-full sm:w-auto"
              value={bulkStatus.value}
              onChange$={$((e: Event) => {
                bulkStatus.value = (e.target as HTMLSelectElement)
                  .value as PresensiStatus;
              })}
              title="Pilih status untuk diterapkan"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button
              class="btn btn-primary btn-sm"
              onClick$={applyBulk}
              disabled={selectedIds.value.size === 0}
              title="Terapkan ke yang dipilih"
            >
              Terapkan
            </button>
            <button
              class="btn btn-ghost btn-sm"
              onClick$={clearSelection}
              disabled={selectedIds.value.size === 0}
            >
              Bersihkan
            </button>
            <div class="text-sm opacity-70">
              Dipilih: {selectedIds.value.size}
            </div>
          </div>
        </div>

        <div class="relative mt-3 overflow-x-auto">
          {loading && <Spinner overlay />}
          <div class="max-h-[60vh] overflow-y-auto">
            <table class="table table-xs xl:table-md w-full">
              <thead>
                <tr>
                  <th class="sticky top-0 z-20 bg-base-100 w-10">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-primary"
                      checked={selectAll.value}
                      onChange$={toggleAll}
                      title="Pilih semua"
                    />
                  </th>
                  <th class="sticky top-0 z-20 bg-base-100">Nama</th>
                  <th class="sticky top-0 z-20 bg-base-100">NIK</th>
                  <th class="sticky top-0 z-20 bg-base-100">Alamat</th>
                  <th class="sticky top-0 z-20 bg-base-100">Status</th>
                  <th class="sticky top-0 z-20 bg-base-100 table-pin-col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      class="text-center text-base-content/60 py-8"
                    >
                      Belum ada data presensi.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          class="checkbox checkbox-sm checkbox-primary"
                          checked={selectedIds.value.has(row.user_ibk_id)}
                          onChange$={$(() => toggleOne(row.user_ibk_id))}
                          title="Pilih baris"
                        />
                      </td>
                      <td class="max-w-[220px] whitespace-normal break-words">
                        {row.ibk?.nama || "-"}
                      </td>
                      <td class="max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {row.ibk?.nik || "-"}
                      </td>
                      <td
                        class="max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap"
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
                              title="Detail"
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
