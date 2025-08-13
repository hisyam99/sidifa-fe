import { component$, PropFunction, useSignal } from "@builder.io/qwik";
import type { LowonganCreateRequest, LowonganItem } from "~/types/lowongan";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { object, string, nonEmpty, pipe, optional } from "valibot";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { buildLowonganUploadUrl } from "~/utils/url";

export type LowonganFormData = Omit<LowonganCreateRequest, "file"> & {
  file?: File;
};

const lowonganSchema = object({
  nama_lowongan: pipe(string(), nonEmpty("Nama lowongan wajib diisi")),
  nama_perusahaan: pipe(string(), nonEmpty("Nama perusahaan wajib diisi")),
  jenis_pekerjaan: pipe(string(), nonEmpty("Jenis pekerjaan wajib diisi")),
  lokasi: pipe(string(), nonEmpty("Lokasi wajib diisi")),
  jenis_difasilitas: pipe(string(), nonEmpty("Jenis difasilitas wajib diisi")),
  deskripsi: pipe(string(), nonEmpty("Deskripsi wajib diisi")),
  status: pipe(string(), nonEmpty("Status wajib dipilih")),
  tanggal_mulai: string(),
  tanggal_selesai: string(),
  file: optional(string()),
});

type LowonganFormValues = {
  nama_lowongan: string;
  nama_perusahaan: string;
  jenis_pekerjaan: string;
  lokasi: string;
  jenis_difasilitas: string;
  deskripsi: string;
  status: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  file?: string;
};

interface LowonganFormProps {
  initialData?: Partial<LowonganItem>;
  onSubmit$: PropFunction<(data: LowonganFormData) => void>;
  loading?: boolean;
  submitButtonText?: string;
}

export const LowonganForm = component$<LowonganFormProps>((props) => {
  const init = props.initialData || {};
  const isEdit = Boolean((init as any).id || init.file_name);
  const fileError = useSignal<string | null>(null);

  const [form, { Form, Field }] = useForm<LowonganFormValues>({
    loader: {
      value: {
        nama_lowongan: init.nama_lowongan || "",
        nama_perusahaan: init.nama_perusahaan || "",
        jenis_pekerjaan: init.jenis_pekerjaan || "",
        lokasi: init.lokasi || "",
        jenis_difasilitas: init.jenis_difasilitas || "",
        deskripsi: init.deskripsi || "",
        status: init.status || "aktif",
        tanggal_mulai: (init.tanggal_mulai || "").substring(0, 10),
        tanggal_selesai: (init.tanggal_selesai || "").substring(0, 10),
        file: "",
      },
    },
    validate: valiForm$(lowonganSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  return (
    <Form
      class="space-y-4"
      onSubmit$={async (values, ev) => {
        const formEl = ev.target as HTMLFormElement;
        const fileInput = formEl.querySelector(
          'input[name="file"]',
        ) as HTMLInputElement | null;
        const fileObj = fileInput?.files?.[0];

        // Require file on create
        if (!isEdit && !fileObj) {
          fileError.value = "File wajib diunggah saat membuat lowongan baru.";
          return;
        }
        fileError.value = null;

        const payload: LowonganFormData = {
          nama_lowongan: values.nama_lowongan,
          nama_perusahaan: values.nama_perusahaan,
          jenis_pekerjaan: values.jenis_pekerjaan,
          lokasi: values.lokasi,
          jenis_difasilitas: values.jenis_difasilitas,
          deskripsi: values.deskripsi,
          status: values.status || "aktif",
          tanggal_mulai: values.tanggal_mulai,
          tanggal_selesai: values.tanggal_selesai,
          file: fileObj || undefined,
        };
        await props.onSubmit$(payload);
      }}
      encType="multipart/form-data"
    >
      {form.invalid && (
        <div class="alert alert-error">
          Ada data yang belum valid/terisi. Silakan cek kembali field yang
          bertanda merah di bawah ini!
        </div>
      )}

      <Field name="nama_lowongan" type="string">
        {(field, fieldProps) => (
          <>
            <FormFieldModular
              field={field}
              props={fieldProps}
              type="text"
              label="Nama Lowongan"
              placeholder="Nama lowongan"
              required
            />
          </>
        )}
      </Field>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="nama_perusahaan" type="string">
          {(field, fieldProps) => (
            <>
              <FormFieldModular
                field={field}
                props={fieldProps}
                type="text"
                label="Nama Perusahaan"
                placeholder="Nama perusahaan"
                required
              />
            </>
          )}
        </Field>
        <Field name="jenis_pekerjaan" type="string">
          {(field, fieldProps) => (
            <>
              <FormFieldModular
                field={field}
                props={fieldProps}
                type="text"
                label="Jenis Pekerjaan"
                placeholder="Contoh: Full-time"
                required
              />
            </>
          )}
        </Field>
        <Field name="lokasi" type="string">
          {(field, fieldProps) => (
            <>
              <FormFieldModular
                field={field}
                props={fieldProps}
                type="text"
                label="Lokasi"
                placeholder="Contoh: Jakarta"
                required
              />
            </>
          )}
        </Field>
        <Field name="jenis_difasilitas" type="string">
          {(field, fieldProps) => (
            <>
              <FormFieldModular
                field={field}
                props={fieldProps}
                type="text"
                label="Jenis Disabilitas"
                placeholder="Contoh: Tuna Daksa"
                required
              />
            </>
          )}
        </Field>
      </div>

      <Field name="deskripsi" type="string">
        {(field, fieldProps) => (
          <>
            <FormFieldModular
              field={field}
              props={fieldProps}
              type="textarea"
              label="Deskripsi"
              placeholder="Deskripsi pekerjaan"
              required
            />
          </>
        )}
      </Field>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field name="status" type="string">
          {(field) => (
            <div>
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select
                class="select select-bordered w-full"
                value={field.value || "aktif"}
                onInput$={(e) =>
                  (field.value = (e.target as HTMLSelectElement).value)
                }
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          )}
        </Field>
        <Field name="tanggal_mulai" type="string">
          {(field, propsField) => (
            <>
              <FormFieldModular
                field={field}
                props={propsField}
                type="date"
                label="Tanggal Mulai"
              />
            </>
          )}
        </Field>
        <Field name="tanggal_selesai" type="string">
          {(field, propsField) => (
            <>
              <FormFieldModular
                field={field}
                props={propsField}
                type="date"
                label="Tanggal Selesai"
              />
            </>
          )}
        </Field>
      </div>

      {typeof init.file_name === "string" && init.file_name && (
        <div class="alert alert-info p-2 text-xs">
          File lama:{" "}
          <a
            href={buildLowonganUploadUrl(init.file_name)}
            target="_blank"
            rel="noopener noreferrer"
            class="link link-primary underline break-all"
          >
            {init.file_name}
          </a>
        </div>
      )}

      <div class="space-y-2">
        <label class="flex flex-col gap-1 text-sm font-medium">
          <span>Upload File {isEdit ? "(Opsional)" : "(Wajib)"}</span>
          <input
            name="file"
            type="file"
            class="input input-bordered w-full focus-ring"
            accept="*"
          />
        </label>
        {fileError.value && (
          <div class="text-error text-xs mt-1">{fileError.value}</div>
        )}
        <div class="text-xs text-gray-500">
          {isEdit
            ? "Bisa dikosongkan jika tidak ingin mengganti file."
            : "Wajib unggah file untuk lowongan baru."}
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={form.submitting || props.loading}
      >
        {form.submitting || props.loading
          ? "Menyimpan..."
          : props.submitButtonText || "Simpan Lowongan"}
      </button>
    </Form>
  );
});
