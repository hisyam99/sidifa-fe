import { component$, $, QRL, useSignal } from "@builder.io/qwik";
import { GenericLoadingSpinner } from "~/components/common";

export interface InformasiFormData {
  judul: string;
  tipe: string;
  deskripsi: string;
  file?: File;
  file_url?: string; // For displaying existing file URL
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
      file_url: "",
    },
  );

  const selectedFile = useSignal<File | null>(null);

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();
    const submitData = {
      ...formState.value,
      file: selectedFile.value || undefined,
    };
    await onSubmit$(submitData);
  });

  const handleFileChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    selectedFile.value = file || null;
  });

  return (
    <form class="space-y-4" onSubmit$={handleSubmit}>
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
          <option value="artikel">Artikel</option>
          <option value="panduan">Panduan</option>
          <option value="video">Video</option>
          <option value="infografis">Infografis</option>
        </select>
      </div>
      <div>
        <label class="label">
          <span class="label-text">Deskripsi</span>
        </label>
        <textarea
          class="textarea textarea-bordered w-full"
          value={formState.value.deskripsi}
          onInput$={(e) =>
            (formState.value.deskripsi = (
              e.target as HTMLTextAreaElement
            ).value)
          }
          required
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Upload File (Opsional)</span>
        </label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          accept="image/*,.pdf,.doc,.docx"
          onChange$={handleFileChange}
        />
        {selectedFile.value && (
          <div class="mt-2 text-sm text-base-content/70">
            File terpilih: {selectedFile.value.name}
          </div>
        )}
        {formState.value.file_url && !selectedFile.value && (
          <div class="mt-2">
            <a
              href={formState.value.file_url}
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
