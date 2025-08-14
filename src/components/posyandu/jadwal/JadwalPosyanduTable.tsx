import { component$, QRL, $ } from "@builder.io/qwik";
import type { JadwalPosyanduItem } from "~/types";
import { LuEye, LuPencil, LuTrash } from "~/components/icons/lucide-optimized";
import { Spinner } from "~/components/ui/Spinner";

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
        <div class="relative overflow-x-auto">
          {loading && <Spinner overlay />}
          {/* Desktop table */}
          <div class="hidden md:block overflow-x-auto">
            <div class="max-h-[60vh] overflow-y-auto rounded-lg">
              <table class="table table-xs xl:table-md table-pin-cols table-pin-rows w-full">
                <thead>
                  <tr class="bg-base-200">
                    <th class="bg-base-200">Nama Kegiatan</th>
                    <th class="bg-base-200">Jenis</th>
                    <th class="bg-base-200">Lokasi</th>
                    <th class="bg-base-200">Tanggal</th>
                    <th class="bg-base-200">Waktu</th>
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
                        Tidak ada jadwal posyandu.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td
                          class="max-w-[160px] line-clamp-2 break-words whitespace-normal"
                          style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                          title={item.nama_kegiatan}
                        >
                          {item.nama_kegiatan}
                        </td>
                        <td
                          class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={item.jenis_kegiatan}
                        >
                          {item.jenis_kegiatan}
                        </td>
                        <td
                          class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={item.lokasi}
                        >
                          {item.lokasi}
                        </td>
                        <td>{item.tanggal?.substring(0, 10)}</td>
                        <td>
                          {item.waktu_mulai} - {item.waktu_selesai}
                        </td>
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
                                  if (
                                    confirm("Yakin ingin menghapus jadwal ini?")
                                  )
                                    onDelete$(item.id);
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

          {/* Mobile card list */}
          <div class="md:hidden space-y-3">
            {items.length === 0 ? (
              <div class="text-center text-base-content/60 py-8">
                Tidak ada jadwal posyandu.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  class="card bg-base-100 border border-base-200 shadow-sm"
                >
                  <div class="card-body p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="font-semibold break-words">
                          {item.nama_kegiatan}
                        </div>
                        <div class="text-sm opacity-80 break-words">
                          {item.jenis_kegiatan}
                        </div>
                        <div class="text-sm mt-1">Lokasi: {item.lokasi}</div>
                        <div class="text-sm mt-1">
                          {item.tanggal?.substring(0, 10)} · {item.waktu_mulai}{" "}
                          - {item.waktu_selesai}
                        </div>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="join">
                        {onDetail$ && (
                          <button
                            class="btn btn-ghost btn-xs join-item"
                            onClick$={$(() => onDetail$(item.id))}
                          >
                            Detail
                          </button>
                        )}
                        {onEdit$ && (
                          <button
                            class="btn btn-primary btn-xs join-item"
                            onClick$={$(() => onEdit$(item.id))}
                          >
                            Edit
                          </button>
                        )}
                        {onDelete$ && (
                          <button
                            class="btn btn-error btn-xs join-item"
                            onClick$={$(() => {
                              if (confirm("Yakin ingin menghapus jadwal ini?"))
                                onDelete$(item.id);
                            })}
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
