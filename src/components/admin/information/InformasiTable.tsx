import { component$, Slot } from "@builder.io/qwik";
import type { InformasiItem } from "~/types/informasi";
import { Spinner } from "~/components/ui/Spinner";
import { buildInformasiEdukasiUrl } from "~/utils/url";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface InformasiTableProps {
  items: InformasiItem[];
  page: number;
  limit: number;
  loading?: boolean;
}

export const InformasiTable = component$((props: InformasiTableProps) => {
  const { items, page, limit, loading } = props;

  const renderParagraphPreview = (md: string) => {
    const raw = (md || "").toString();
    const tokens = marked.lexer(raw);
    const paragraphTokens = tokens.filter((t) => t.type === "paragraph");
    const firstParagraph =
      paragraphTokens.length > 0 ? [paragraphTokens[0]] : [];
    const html = marked.parser(firstParagraph as any);
    return DOMPurify.sanitize(html);
  };

  return (
    <div class="overflow-x-auto card bg-base-100 shadow-xl p-6 relative">
      {loading && <Spinner overlay />}
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl font-bold">Daftar Informasi & Edukasi</h2>
        <div class="text-sm text-base-content/70">
          Total: {items.length} data
        </div>
      </div>
      {/* Desktop table */}
      <div class="hidden md:block overflow-x-auto">
        <div class="max-h-[60vh] overflow-y-auto rounded-lg">
          <table class="table w-full table-pin-rows">
            <thead>
              <tr class="bg-base-200">
                <th class="w-16 bg-base-200">No</th>
                <th class="w-1/4 bg-base-200">Judul</th>
                <th class="w-20 bg-base-200">Tipe</th>
                <th class="w-1/3 bg-base-200">Deskripsi</th>
                <th class="w-20 bg-base-200">File</th>
                <th class="w-32 bg-base-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading ? (
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
                      <div class="badge badge-outline badge-sm">
                        {item.tipe}
                      </div>
                    </td>
                    <td>
                      <div class="max-w-xs">
                        <div
                          class="prose prose-sm max-w-none text-base-content/80 leading-relaxed line-clamp-2"
                          dangerouslySetInnerHTML={renderParagraphPreview(
                            item.deskripsi,
                          )}
                        />
                      </div>
                    </td>
                    <td>
                      {item.file_name ? (
                        <a
                          href={buildInformasiEdukasiUrl(item.file_name)}
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
      </div>

      {/* Mobile card list */}
      <div class="md:hidden space-y-3">
        {items.length === 0 && !loading ? (
          <div class="text-center text-base-content/60 py-8">
            Tidak ada data informasi dan edukasi
          </div>
        ) : (
          items.map((item: InformasiItem, idx: number) => (
            <div
              key={item.id}
              class="card bg-base-100 border border-base-200 shadow-sm"
            >
              <div class="card-body p-4">
                <div class="font-semibold break-words">{item.judul}</div>
                <div class="text-sm opacity-80 mt-1">Tipe: {item.tipe}</div>
                <div
                  class="prose prose-sm max-w-none text-base-content/80 leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={renderParagraphPreview(
                    item.deskripsi,
                  )}
                />
                <div class="mt-2">
                  {item.file_name ? (
                    <a
                      href={buildInformasiEdukasiUrl(item.file_name)}
                      target="_blank"
                      class="btn btn-ghost btn-xs link link-primary"
                    >
                      Lihat File
                    </a>
                  ) : (
                    <span class="text-base-content/40 text-sm">
                      Tidak ada file
                    </span>
                  )}
                </div>
                <div class="mt-3 flex gap-1">
                  <Slot name={`edit-${item.id}`} />
                  <Slot name={`delete-${item.id}`} />
                </div>
                <div class="text-xs opacity-60 mt-2">
                  No: {(page - 1) * limit + idx + 1}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
