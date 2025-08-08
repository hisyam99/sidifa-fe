import { component$, Slot } from "@builder.io/qwik";
import type { LowonganItem } from "~/types/lowongan";

interface LowonganTableProps {
  items: LowonganItem[];
  page: number;
  limit: number;
  loading?: boolean;
}

export const LowonganTable = component$<LowonganTableProps>(
  ({ items, page, limit, loading }) => {
    return (
      <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Lowongan</th>
              <th>Perusahaan</th>
              <th>Jenis</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Periode</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} class="text-center py-8">
                  <span class="loading loading-spinner loading-lg text-primary" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} class="text-center py-6 text-base-content/70">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={row.id}>
                  <td>{(page - 1) * limit + idx + 1}</td>
                  <td class="font-semibold">{row.nama_lowongan}</td>
                  <td>{row.nama_perusahaan}</td>
                  <td>{row.jenis_pekerjaan}</td>
                  <td>{row.lokasi}</td>
                  <td>
                    <span
                      class={`badge ${row.status === "aktif" ? "badge-success" : "badge-ghost"}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {(row.tanggal_mulai || "-").substring(0, 10)} -{" "}
                    {(row.tanggal_selesai || "-").substring(0, 10)}
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <div q:slot={`edit-${row.id}`}>
                        <Slot name={`edit-${row.id}`} />
                      </div>
                      <div q:slot={`delete-${row.id}`}>
                        <Slot name={`delete-${row.id}`} />
                      </div>
                    </div>
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
