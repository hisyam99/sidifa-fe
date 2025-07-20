import { component$, Slot } from "@builder.io/qwik";
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
      <h2 class="card-title text-xl font-bold mb-4">
        Daftar Informasi & Edukasi
      </h2>
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Tipe</th>
            <th>Deskripsi</th>
            <th>File</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} class="text-center text-base-content/60 py-8">
                Tidak ada data informasi dan edukasi.
              </td>
            </tr>
          ) : (
            items.map((item: InformasiItem, idx: number) => (
              <tr key={item.id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td class="font-medium">{item.judul}</td>
                <td>{item.tipe}</td>
                <td class="max-w-xs truncate">{item.deskripsi}</td>
                <td>
                  {item.file_url ? (
                    <a
                      href={item.file_url}
                      target="_blank"
                      class="link link-primary"
                    >
                      Lihat File
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <div class="flex gap-2">
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
