import { component$, QRL } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { InformasiItem } from "~/types/informasi";
import { buildInformasiEdukasiUrl } from "~/utils/url";

interface InformasiDetailCardProps {
  item: InformasiItem;
  onEdit$: QRL<(id: string) => void>;
  onDelete$: QRL<(id: string) => void>;
}

export const InformasiDetailCard = component$(
  (props: InformasiDetailCardProps) => {
    const { item, onEdit$, onDelete$ } = props;

    return (
      <div class="card bg-base-100 shadow-md p-6">
        <h2 class="card-title text-xl font-bold mb-4">Detail Informasi</h2>
        <div class="space-y-2 mb-4">
          <div>
            <b>Judul:</b> {item.judul}
          </div>
          <div>
            <b>Tipe:</b> {item.tipe}
          </div>
          <div>
            <b>Deskripsi:</b> {item.deskripsi}
          </div>
          <div>
            <b>File:</b>{" "}
            {item.file_name ? (
              <Link
                href={buildInformasiEdukasiUrl(item.file_name)}
                target="_blank"
                class="link link-primary"
              >
                Lihat File
              </Link>
            ) : (
              "-"
            )}
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary" onClick$={() => onEdit$(item.id)}>
            Edit
          </button>
          <button class="btn btn-error" onClick$={() => onDelete$(item.id)}>
            Hapus
          </button>
        </div>
      </div>
    );
  },
);
