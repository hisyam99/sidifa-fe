import { component$, $, QRL, useSignal, useTask$ } from "@builder.io/qwik";
import { GenericLoadingSpinner } from "~/components/common";

export interface AdminPsikologFormData {
  nama: string;
  email: string;
  no_telp: string;
  spesialisasi: string;
  status?: "Aktif" | "Tidak Aktif";
}

interface AdminPsikologFormProps {
  initialData?: AdminPsikologFormData;
  onSubmit$: QRL<(data: AdminPsikologFormData) => void>;
  loading: boolean;
  submitButtonText?: string;
}

export const AdminPsikologForm = component$((props: AdminPsikologFormProps) => {
  const {
    initialData,
    onSubmit$,
    loading,
    submitButtonText = "Simpan",
  } = props;

  const formState = useSignal<AdminPsikologFormData>(
    initialData || {
      nama: "",
      email: "",
      no_telp: "",
      spesialisasi: "",
      status: "Aktif",
    },
  );

  // Update formState if initialData changes (e.g., when editing different items)
  useTask$(({ track }) => {
    track(() => initialData);
    if (initialData) {
      formState.value = { ...initialData };
    }
  });

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();
    await onSubmit$(formState.value);
  });

  return (
    <form
      class="space-y-4 p-6 bg-base-100 rounded-lg shadow-md"
      onSubmit$={handleSubmit}
    >
      <div class="form-control">
        <label class="label">
          <span class="label-text">Nama Psikolog</span>
        </label>
        <input
          type="text"
          class="input input-bordered w-full"
          value={formState.value.nama}
          onInput$={(e) =>
            (formState.value.nama = (e.target as HTMLInputElement).value)
          }
          required
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          type="email"
          class="input input-bordered w-full"
          value={formState.value.email}
          onInput$={(e) =>
            (formState.value.email = (e.target as HTMLInputElement).value)
          }
          required
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">No. Telepon</span>
        </label>
        <input
          type="tel"
          class="input input-bordered w-full"
          value={formState.value.no_telp}
          onInput$={(e) =>
            (formState.value.no_telp = (e.target as HTMLInputElement).value)
          }
          required
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Spesialisasi</span>
        </label>
        <input
          type="text"
          class="input input-bordered w-full"
          value={formState.value.spesialisasi}
          onInput$={(e) =>
            (formState.value.spesialisasi = (
              e.target as HTMLInputElement
            ).value)
          }
          required
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Status</span>
        </label>
        <select
          class="select select-bordered w-full"
          value={formState.value.status}
          onChange$={(e) =>
            (formState.value.status = (e.target as HTMLSelectElement).value as
              | "Aktif"
              | "Tidak Aktif")
          }
          required
        >
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
        </select>
      </div>
      <div class="flex justify-end pt-4">
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {loading ? (
            <GenericLoadingSpinner size="w-5 h-5" color="text-white" />
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
});
