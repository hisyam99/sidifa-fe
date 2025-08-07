import { component$, QRL, $ } from "@builder.io/qwik";
import type { JadwalPosyanduItem } from "~/types";
import { LuEye, LuPencil, LuTrash } from "~/components/icons/lucide-optimized";

interface JadwalPosyanduTableProps {
  items: JadwalPosyanduItem[];
  loading?: boolean;
  onEdit$?: QRL<(id: string) => void>;
  onDetail$?: QRL<(id: string) => void>;
  onDelete$?: QRL<(id: string) => void>;
}

export const JadwalPosyanduTable = component$<JadwalPosyanduTableProps>(
  ({ items, loading, onEdit$, onDetail$, onDelete$ }) => {
    return (
      <div class="overflow-x-auto bg-base-100 p-2">
        <h2
          id="jadwal-table-title"
          tabIndex={-1}
          class="text-lg font-bold mb-2 md:card-title md:text-xl md:mb-4"
        >
          Daftar Jadwal Posyandu
        </h2>
        <div class="overflow-x-auto">
          <div class="max-h-[60vh] overflow-y-auto">
            <table class="table table-xs xl:table-md table-pin-cols w-full">
              <thead>
                <tr>
                  <th class="sticky top-0 z-20 bg-base-100">Nama Kegiatan</th>
                  <th class="sticky top-0 z-20 bg-base-100">Jenis</th>
                  <th class="sticky top-0 z-20 bg-base-100">Lokasi</th>
                  <th class="sticky top-0 z-20 bg-base-100">Tanggal</th>
                  <th class="sticky top-0 z-20 bg-base-100">Waktu</th>
                  <th class="sticky top-0 z-20 bg-base-100 table-pin-col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} class="text-center py-8 text-base-content/50">
                      Memuat data...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} class="text-center text-base-content/60 py-8">
                      Tidak ada jadwal posyandu.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td class="max-w-[160px] line-clamp-2 break-words whitespace-normal" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title={item.nama_kegiatan}>
                        {item.nama_kegiatan}
                      </td>
                      <td class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" title={item.jenis_kegiatan}>
                        {item.jenis_kegiatan}
                      </td>
                      <td class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" title={item.lokasi}>
                        {item.lokasi}
                      </td>
                      <td>{item.tanggal?.substring(0, 10)}</td>
                      <td>{item.waktu_mulai} - {item.waktu_selesai}</td>
                      <th class="table-pin-col">
                        <div class="flex gap-2">
                          {onDetail$ && (
                            <button
                              class="btn btn-ghost btn-xs md:btn-sm"
                              onClick$={$(() => onDetail$(item.id))}
                            >
                              <span class="inline xl:hidden">
                                <LuEye class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">Detail</span>
                            </button>
                          )}
                          {onEdit$ && (
                            <button
                              class="btn btn-primary btn-xs md:btn-sm"
                              onClick$={$(() => onEdit$(item.id))}
                            >
                              <span class="inline xl:hidden">
                                <LuPencil class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">Edit</span>
                            </button>
                          )}
                          {onDelete$ && (
                            <button
                              class="btn btn-error btn-xs md:btn-sm"
                              onClick$={$(() => {
                                if (confirm('Yakin ingin menghapus jadwal ini?')) onDelete$(item.id);
                              })}
                            >
                              <span class="inline xl:hidden">
                                <LuTrash class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">Hapus</span>
                            </button>
                          )}
                        </div>
                      </th>
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
