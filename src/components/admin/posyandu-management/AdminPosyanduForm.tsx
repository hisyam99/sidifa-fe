import { component$, $, type QRL } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { object, string, nonEmpty, pipe } from "valibot";
import FormFieldModular from "~/components/ui/FormFieldModular";
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

const posyanduSchema = object({
  nama_posyandu: pipe(string(), nonEmpty("Nama posyandu wajib diisi")),
  alamat: pipe(string(), nonEmpty("Alamat wajib diisi")),
  no_telp: pipe(string(), nonEmpty("No. telepon wajib diisi")),
  status: string(),
});

type PosyanduFormValues = {
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  status: string;
};

export const AdminPosyanduForm = component$((props: AdminPosyanduFormProps) => {
  const {
    initialData,
    onSubmit$,
    loading,
    submitButtonText = "Simpan",
  } = props;

  const [form, { Form, Field }] = useForm<PosyanduFormValues>({
    loader: {
      value: {
        nama_posyandu: initialData?.nama_posyandu ?? "",
        alamat: initialData?.alamat ?? "",
        no_telp: initialData?.no_telp ?? "",
        status: initialData?.status ?? "Aktif",
      },
    },
    validate: valiForm$(posyanduSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  return (
    <Form
      class="space-y-4"
      preventdefault:submit
      onSubmit$={$(async (values) => {
        const payload: AdminPosyanduFormData = {
          nama_posyandu: values.nama_posyandu,
          alamat: values.alamat,
          no_telp: values.no_telp,
          status: (values.status as "Aktif" | "Tidak Aktif") ?? "Aktif",
        };
        await onSubmit$(payload);
      })}
    >
      {form.invalid && (
        <div class="alert alert-error">
          Ada data yang belum valid. Silakan periksa field bertanda merah.
        </div>
      )}

      <Field name="nama_posyandu" type="string">
        {(field, fieldProps) => (
          <FormFieldModular
            field={field}
            props={fieldProps}
            type="text"
            label="Nama Posyandu"
            placeholder="Masukkan nama posyandu"
            required
          />
        )}
      </Field>

      <Field name="alamat" type="string">
        {(field, fieldProps) => (
          <FormFieldModular
            field={field}
            props={fieldProps}
            type="textarea"
            label="Alamat"
            placeholder="Masukkan alamat lengkap"
            required
          />
        )}
      </Field>

      <Field name="no_telp" type="string">
        {(field, fieldProps) => (
          <FormFieldModular
            field={field}
            props={fieldProps}
            type="text"
            label="No. Telepon"
            placeholder="Contoh: 0812xxxxxxx"
            required
          />
        )}
      </Field>

      <Field name="status" type="string">
        {(field) => (
          <div>
            <label class="label">
              <span class="label-text">Status</span>
            </label>
            <select
              class="select select-bordered w-full"
              value={field.value || "Aktif"}
              onInput$={(e) =>
                (field.value = (e.target as HTMLSelectElement).value)
              }
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        )}
      </Field>

      <div class="flex justify-end pt-2">
        <button
          type="submit"
          class="btn btn-primary"
          disabled={form.submitting || loading}
        >
          {form.submitting || loading ? (
            <GenericLoadingSpinner size="w-5 h-5" color="text-white" />
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </Form>
  );
});
