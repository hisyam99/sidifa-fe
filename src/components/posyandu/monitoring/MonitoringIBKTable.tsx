import { component$, QRL, $ } from "@builder.io/qwik";
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
          <div class="max-h-[60vh] overflow-y-auto">
            <table class="table table-xs xl:table-md w-full">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>IBK</th>
                  <th>Keluhan</th>
                  <th>Perilaku Baru</th>
                  <th>Kecamatan</th>
                  <th class="table-pin-col">Aksi</th>
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
                              <span class="hidden xl:inline ml-1">Detail</span>
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
      </div>
    );
  },
);
