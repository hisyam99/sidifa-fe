import { component$, QRL, $ } from "@builder.io/qwik";
import type { JadwalPosyanduItem } from "~/types";

interface JadwalPosyanduTableProps {
  items: JadwalPosyanduItem[];
  loading?: boolean;
  onEdit$?: QRL<(id: string) => void>;
  onDetail$?: QRL<(id: string) => void>;
}

export const JadwalPosyanduTable = component$<JadwalPosyanduTableProps>(
  ({ items, loading, onEdit$, onDetail$ }) => {
    return (
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nama Kegiatan</th>
              <th>Jenis</th>
              <th>Lokasi</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Aksi</th>
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
                <td colSpan={6} class="text-center py-8 text-base-content/50">
                  Tidak ada jadwal posyandu.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama_kegiatan}</td>
                  <td>{item.jenis_kegiatan}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.tanggal?.substring(0, 10)}</td>
                  <td>
                    {item.waktu_mulai} - {item.waktu_selesai}
                  </td>
                  <td>
                    <button
                      class="btn btn-xs btn-info mr-2"
                      onClick$={
                        onDetail$ ? $(() => onDetail$(item.id)) : undefined
                      }
                    >
                      Detail
                    </button>
                    <button
                      class="btn btn-xs btn-warning"
                      onClick$={onEdit$ ? $(() => onEdit$(item.id)) : undefined}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
