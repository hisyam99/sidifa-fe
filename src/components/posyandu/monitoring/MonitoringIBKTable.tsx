import { component$, QRL, $ } from "@qwik.dev/core";
import type { MonitoringIBKItem } from "~/types";
import { Spinner } from "~/components/ui/Spinner";
import { LuEye, LuPencil, LuTrash } from "~/components/icons/lucide-optimized";

interface MonitoringIBKTableProps {
  items: MonitoringIBKItem[];
  loading?: boolean;
  onEdit$?: QRL<(id: string) => void>;
  onDetail$?: QRL<(id: string) => void>;
  onDelete$?: QRL<(id: string) => void>;
}

export const MonitoringIBKTable = component$<MonitoringIBKTableProps>(
  ({ items, loading, onEdit$, onDetail$, onDelete$ }) => {
    return (
      <div class="overflow-x-auto bg-base-100 p-2">
        <h2 class="text-lg font-bold mb-2 md:card-title md:text-xl md:mb-4">
          Daftar Monitoring IBK
        </h2>
        <div class="relative overflow-x-auto">
          {loading && <Spinner overlay />}
          {/* Desktop table */}
          <div class="hidden md:block overflow-x-auto">
            <div class="max-h-[60vh] overflow-y-auto rounded-lg">
              <table class="table table-xs xl:table-md w-full table-pin-rows">
                <thead>
                  <tr class="bg-base-200">
                    <th class="bg-base-200">Tanggal</th>
                    <th class="bg-base-200">IBK</th>
                    <th class="bg-base-200">Keluhan</th>
                    <th class="bg-base-200">Perilaku Baru</th>
                    <th class="bg-base-200">Kecamatan</th>
                    <th class="bg-base-200 table-pin-col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        class="text-center text-base-content/60 py-8"
                      >
                        Belum ada data monitoring.
                      </td>
                    </tr>
                  ) : (
                    items.map((row) => (
                      <tr key={row.id}>
                        <td>{row.tanggal_kunjungan?.substring(0, 10)}</td>
                        <td class="max-w-[200px] whitespace-normal break-words">
                          {row.ibk?.nama || row.ibk_id}
                        </td>
                        <td class="max-w-[220px] truncate" title={row.keluhan}>
                          {row.keluhan}
                        </td>
                        <td
                          class="max-w-[180px] truncate"
                          title={row.perilaku_baru}
                        >
                          {row.perilaku_baru}
                        </td>
                        <td>{row.kecamatan}</td>
                        <td class="table-pin-col">
                          <div class="flex gap-2">
                            {onDetail$ && (
                              <button
                                class="btn btn-ghost btn-xs md:btn-sm"
                                onClick$={$(() => onDetail$(row.id))}
                                title="Detail"
                              >
                                <LuEye class="w-4 h-4" />
                                <span class="hidden xl:inline ml-1">
                                  Detail
                                </span>
                              </button>
                            )}
                            {onEdit$ && (
                              <button
                                class="btn btn-primary btn-xs md:btn-sm"
                                onClick$={$(() => onEdit$(row.id))}
                                title="Edit"
                              >
                                <LuPencil class="w-4 h-4" />
                                <span class="hidden xl:inline ml-1">Edit</span>
                              </button>
                            )}
                            {onDelete$ && (
                              <button
                                class="btn btn-error btn-xs md:btn-sm"
                                onClick$={$(() => onDelete$(row.id))}
                                title="Hapus"
                              >
                                <LuTrash class="w-4 h-4" />
                                <span class="hidden xl:inline ml-1">Hapus</span>
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
            {items.length === 0 ? (
              <div class="text-center text-base-content/60 py-8">
                Belum ada data monitoring.
              </div>
            ) : (
              items.map((row) => (
                <div
                  key={row.id}
                  class="card bg-base-100 border border-base-200 shadow-sm"
                >
                  <div class="card-body p-4">
                    <div class="font-semibold">
                      {row.ibk?.nama || row.ibk_id}
                    </div>
                    <div class="text-sm opacity-80">
                      {row.tanggal_kunjungan?.substring(0, 10)}
                    </div>
                    <div class="text-sm mt-1 truncate" title={row.keluhan}>
                      Keluhan: {row.keluhan}
                    </div>
                    <div
                      class="text-sm mt-1 truncate"
                      title={row.perilaku_baru}
                    >
                      Perilaku Baru: {row.perilaku_baru}
                    </div>
                    <div class="text-sm mt-1">Kecamatan: {row.kecamatan}</div>
                    <div class="mt-3">
                      <div class="join">
                        {onDetail$ && (
                          <button
                            class="btn btn-ghost btn-xs join-item"
                            onClick$={$(() => onDetail$(row.id))}
                          >
                            Detail
                          </button>
                        )}
                        {onEdit$ && (
                          <button
                            class="btn btn-primary btn-xs join-item"
                            onClick$={$(() => onEdit$(row.id))}
                          >
                            Edit
                          </button>
                        )}
                        {onDelete$ && (
                          <button
                            class="btn btn-error btn-xs join-item"
                            onClick$={$(() => onDelete$(row.id))}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
);
