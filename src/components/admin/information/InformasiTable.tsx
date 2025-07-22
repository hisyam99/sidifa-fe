import { component$, Slot } from "@qwik.dev/core";
import type { InformasiItem } from "~/types/informasi";

interface InformasiTableProps {
  items: InformasiItem[];
  page: number;
  limit: number;
}

export const InformasiTable = component$((props: InformasiTableProps) => {
  const { items, page, limit } = props;

  return (
    <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl font-bold">Daftar Informasi & Edukasi</h2>
        <div class="text-sm text-base-content/70">
          Total: {items.length} data
        </div>
      </div>
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th class="w-16">No</th>
            <th class="w-1/4">Judul</th>
            <th class="w-20">Tipe</th>
            <th class="w-1/3">Deskripsi</th>
            <th class="w-20">File</th>
            <th class="w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} class="text-center text-base-content/60 py-8">
                <div class="flex flex-col items-center gap-2">
                  <svg
                    class="w-12 h-12 text-base-content/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Tidak ada data informasi dan edukasi</span>
                  <span class="text-xs">
                    Tambahkan data pertama dengan menekan tombol "Tambah
                    Informasi Baru"
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item: InformasiItem, idx: number) => (
              <tr key={item.id} class="hover">
                <td class="font-mono">{(page - 1) * limit + idx + 1}</td>
                <td class="font-medium">
                  <div class="max-w-xs">
                    <div class="font-semibold">{item.judul}</div>
                  </div>
                </td>
                <td>
                  <div class="badge badge-outline badge-sm">{item.tipe}</div>
                </td>
                <td>
                  <div class="max-w-xs">
                    <div class="truncate" title={item.deskripsi}>
                      {item.deskripsi}
                    </div>
                  </div>
                </td>
                <td>
                  {item.file_url ? (
                    <a
                      href={item.file_url}
                      target="_blank"
                      class="btn btn-ghost btn-xs link link-primary"
                      title="Lihat File"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span class="text-base-content/40">-</span>
                  )}
                </td>
                <td>
                  <div class="flex gap-1">
                    <Slot name={`edit-${item.id}`} />
                    <Slot name={`delete-${item.id}`} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
