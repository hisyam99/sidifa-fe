import {
  component$,
  $,
  QRL,
  useSignal,
  noSerialize,
  type NoSerialize,
} from "@builder.io/qwik";
import { GenericLoadingSpinner } from "~/components/common";
import { buildInformasiEdukasiUrl } from "~/utils/url";
import { MdxEditor } from "~/components/common/MdxEditorWrapper";

export interface InformasiFormData {
  judul: string;
  tipe: string;
  deskripsi: string;
  file?: NoSerialize<File>;
  file_name?: string; // For displaying existing file URL
}

interface InformasiFormProps {
  initialData?: InformasiFormData;
  onSubmit$: QRL<(data: InformasiFormData) => void>;
  loading: boolean;
  submitButtonText?: string;
}

export const InformasiForm = component$((props: InformasiFormProps) => {
  const {
    initialData,
    onSubmit$,
    loading,
    submitButtonText = "Simpan",
  } = props;

  const formState = useSignal<InformasiFormData>(
    initialData || {
      judul: "",
      tipe: "",
      deskripsi: "",
      file_name: "",
    },
  );

  const selectedFile = useSignal<NoSerialize<File> | null>(null);

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();
    const submitData: InformasiFormData = {
      ...formState.value,
      file: selectedFile.value ?? undefined,
    };
    await onSubmit$(submitData);
  });

  const handleFileChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    selectedFile.value = file ? noSerialize(file) : null;
  });

  return (
    <form
      class="space-y-4"
      preventdefault:submit
      onSubmit$={handleSubmit}
      enctype="multipart/form-data"
    >
      <div>
        <label class="label">
          <span class="label-text">Judul</span>
        </label>
        <input
          class="input input-bordered w-full"
          value={formState.value.judul}
          onInput$={(e) =>
            (formState.value.judul = (e.target as HTMLInputElement).value)
          }
          required
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Tipe</span>
        </label>
        <select
          class="select select-bordered w-full"
          value={formState.value.tipe}
          onChange$={(e) =>
            (formState.value.tipe = (e.target as HTMLSelectElement).value)
          }
          required
        >
          <option value="">Pilih Tipe</option>
          <option value="ARTIKEL">Artikel</option>
          <option value="PANDUAN">Panduan</option>
          <option value="REGULASI">Regulasi</option>
        </select>
      </div>
      <div>
        <label class="label">
          <span class="label-text">Deskripsi</span>
        </label>
        <MdxEditor
          content={formState.value.deskripsi}
          onChange$={$((v: string) => (formState.value.deskripsi = v))}
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Upload File (Opsional)</span>
        </label>
        <input
          type="file"
          id="informasi-file-input"
          name="file"
          class="file-input file-input-bordered w-full"
          accept="image/*,.pdf,.doc,.docx"
          required
          onChange$={handleFileChange}
        />
        {selectedFile.value && (
          <div class="mt-2 text-sm text-base-content/70">
            File terpilih: {(selectedFile.value as unknown as File).name}
          </div>
        )}
        {formState.value.file_name && !selectedFile.value && (
          <div class="mt-2">
            <a
              href={buildInformasiEdukasiUrl(formState.value.file_name)}
              target="_blank"
              class="link link-primary text-sm"
            >
              File saat ini: Lihat File
            </a>
          </div>
        )}
      </div>
      <button class="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? (
          <GenericLoadingSpinner size="w-5 h-5" color="text-white" />
        ) : (
          submitButtonText
        )}
      </button>
    </form>
  );
});
