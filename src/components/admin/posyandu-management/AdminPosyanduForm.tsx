import { component$, $, QRL, useSignal, useTask$ } from "@qwik.dev/core";
import { GenericLoadingSpinner } from "~/components/common";

export interface AdminPosyanduFormData {
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  status?: "Aktif" | "Tidak Aktif";
}

interface AdminPosyanduFormProps {
  initialData?: AdminPosyanduFormData;
  onSubmit$: QRL<(data: AdminPosyanduFormData) => void>;
  loading: boolean;
  submitButtonText?: string;
}

export const AdminPosyanduForm = component$((props: AdminPosyanduFormProps) => {
  const {
    initialData,
    onSubmit$,
    loading,
    submitButtonText = "Simpan",
  } = props;

  const formState = useSignal<AdminPosyanduFormData>({
    nama_posyandu: "",
    alamat: "",
    no_telp: "",
    status: "Aktif",
  });

  // Update formState when initialData changes
  useTask$(({ track }) => {
    track(() => initialData);
    if (initialData) {
      formState.value = {
        nama_posyandu: initialData.nama_posyandu || "",
        alamat: initialData.alamat || "",
        no_telp: initialData.no_telp || "",
        status: initialData.status || "Aktif",
      };
    } else {
      // Reset form for create mode
      formState.value = {
        nama_posyandu: "",
        alamat: "",
        no_telp: "",
        status: "Aktif",
      };
    }
  });

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();
    await onSubmit$(formState.value);
  });

  const updateField = $((field: keyof AdminPosyanduFormData, value: string) => {
    formState.value = {
      ...formState.value,
      [field]: value,
    };
  });

  return (
    <form
      class="space-y-4 p-6 bg-base-100 rounded-lg shadow-md"
      onSubmit$={handleSubmit}
    >
      <div class="form-control">
        <label class="label">
          <span class="label-text">Nama Posyandu</span>
        </label>
        <input
          type="text"
          class="input input-bordered w-full"
          value={formState.value.nama_posyandu}
          onInput$={(e) =>
            updateField("nama_posyandu", (e.target as HTMLInputElement).value)
          }
          required
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Alamat</span>
        </label>
        <textarea
          class="textarea textarea-bordered w-full"
          value={formState.value.alamat}
          onInput$={(e) =>
            updateField("alamat", (e.target as HTMLTextAreaElement).value)
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
            updateField("no_telp", (e.target as HTMLInputElement).value)
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
            updateField("status", (e.target as HTMLSelectElement).value)
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
