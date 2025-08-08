import { component$, PropFunction } from "@builder.io/qwik";
import type { LowonganCreateRequest, LowonganItem } from "~/types/lowongan";

export type LowonganFormData = Omit<LowonganCreateRequest, "file"> & {
  file?: File | string;
};

interface LowonganFormProps {
  initialData?: Partial<LowonganItem>;
  onSubmit$: PropFunction<(data: LowonganFormData) => void>;
  loading?: boolean;
  submitButtonText?: string;
}

export const LowonganForm = component$<LowonganFormProps>((props) => {
  const init = props.initialData || {};

  return (
    <form
      class="space-y-4"
      onSubmit$={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const fd = new FormData(form);
        const payload: LowonganFormData = {
          nama_lowongan: String(fd.get("nama_lowongan") || ""),
          nama_perusahaan: String(fd.get("nama_perusahaan") || ""),
          jenis_pekerjaan: String(fd.get("jenis_pekerjaan") || ""),
          lokasi: String(fd.get("lokasi") || ""),
          jenis_difasilitas: String(fd.get("jenis_difasilitas") || ""),
          deskripsi: String(fd.get("deskripsi") || ""),
          status: String(fd.get("status") || "aktif"),
          tanggal_mulai: String(fd.get("tanggal_mulai") || ""),
          tanggal_selesai: String(fd.get("tanggal_selesai") || ""),
          file: (fd.get("file") as File) || undefined,
        };
        props.onSubmit$(payload);
      }}
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text">Nama Lowongan</span>
          </label>
          <input
            name="nama_lowongan"
            required
            class="input input-bordered w-full"
            defaultValue={init.nama_lowongan || ""}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Nama Perusahaan</span>
          </label>
          <input
            name="nama_perusahaan"
            required
            class="input input-bordered w-full"
            defaultValue={init.nama_perusahaan || ""}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Jenis Pekerjaan</span>
          </label>
          <input
            name="jenis_pekerjaan"
            required
            class="input input-bordered w-full"
            defaultValue={init.jenis_pekerjaan || ""}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Lokasi</span>
          </label>
          <input
            name="lokasi"
            required
            class="input input-bordered w-full"
            defaultValue={init.lokasi || ""}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Jenis Difasilitas</span>
          </label>
          <input
            name="jenis_difasilitas"
            required
            class="input input-bordered w-full"
            defaultValue={init.jenis_difasilitas || ""}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Status</span>
          </label>
          <select
            name="status"
            class="select select-bordered w-full"
            value={init.status || "aktif"}
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div>
          <label class="label">
            <span class="label-text">Tanggal Mulai</span>
          </label>
          <input
            type="date"
            name="tanggal_mulai"
            class="input input-bordered w-full"
            defaultValue={(init.tanggal_mulai || "").substring(0, 10)}
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Tanggal Selesai</span>
          </label>
          <input
            type="date"
            name="tanggal_selesai"
            class="input input-bordered w-full"
            defaultValue={(init.tanggal_selesai || "").substring(0, 10)}
          />
        </div>
      </div>
      <div>
        <label class="label">
          <span class="label-text">Deskripsi</span>
        </label>
        <textarea
          name="deskripsi"
          required
          class="textarea textarea-bordered w-full"
          rows={5}
          defaultValue={init.deskripsi || ""}
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Lampiran (opsional)</span>
        </label>
        <input
          type="file"
          name="file"
          class="file-input file-input-bordered w-full"
        />
        {init.file_name || init.file_url ? (
          <p class="text-sm mt-1">
            File saat ini: {init.file_name || init.file_url}
          </p>
        ) : null}
      </div>
      <div class="flex justify-end gap-2">
        <button
          type="submit"
          class={`btn btn-primary ${props.loading ? "btn-disabled" : ""}`}
        >
          {props.submitButtonText || "Simpan"}
        </button>
      </div>
    </form>
  );
});
