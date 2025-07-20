import { component$, $, QRL, useSignal } from "@builder.io/qwik";
import { GenericLoadingSpinner } from "~/components/common";

export interface InformasiFormData {
  judul: string;
  tipe: string;
  deskripsi: string;
  file_url?: string; // Changed file_name to file_url
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
      file_url: "", // Changed file_name to file_url
    },
  );

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();
    await onSubmit$(formState.value);
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
        <input
          class="input input-bordered w-full"
          value={formState.value.tipe}
          onInput$={(e) =>
            (formState.value.tipe = (e.target as HTMLInputElement).value)
          }
          required
        />
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
          <span class="label-text">URL File (Opsional)</span>
        </label>
        <input
          class="input input-bordered w-full"
          value={formState.value.file_url}
          onInput$={(e) =>
            (formState.value.file_url = (e.target as HTMLInputElement).value)
          }
        />
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
