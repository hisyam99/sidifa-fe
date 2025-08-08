import { component$, QRL, noSerialize, useTask$ } from "@builder.io/qwik";
import { useForm, valiForm$, setValues } from "@modular-forms/qwik";
import { object, string, nonEmpty, minLength, pipe, optional } from "valibot";
import type {
  JadwalPosyanduCreateRequest,
  JadwalPosyanduUpdateRequest,
  JadwalPosyanduItem,
} from "~/types";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { buildUploadUrl } from "~/utils/url";

interface JadwalPosyanduFormProps {
  initialData?: Partial<JadwalPosyanduItem>;
  /**
   * Must be passed as a Qwik $() signal from the parent, e.g. onSubmit$={$((data) => ...)}
   */
  onSubmit$: QRL<
    (
      data: JadwalPosyanduCreateRequest | JadwalPosyanduUpdateRequest,
    ) => Promise<void>
  >;
  loading?: boolean;
  submitButtonText?: string;
}

// Schema valibot, file_name benar-benar opsional (tidak ada nonEmpty)
const jadwalSchema = object({
  nama_kegiatan: pipe(
    string(),
    nonEmpty("Nama kegiatan wajib diisi"),
    minLength(3, "Minimal 3 karakter"),
  ),
  jenis_kegiatan: pipe(string(), nonEmpty("Jenis kegiatan wajib diisi")),
  deskripsi: pipe(
    string(),
    nonEmpty("Deskripsi wajib diisi"),
    minLength(5, "Minimal 5 karakter"),
  ),
  lokasi: pipe(string(), nonEmpty("Lokasi wajib diisi")),
  tanggal: pipe(string(), nonEmpty("Tanggal wajib diisi")),
  waktu_mulai: pipe(string(), nonEmpty("Waktu mulai wajib diisi")),
  waktu_selesai: pipe(string(), nonEmpty("Waktu selesai wajib diisi")),
  posyandu_id: string(),
  file_name: optional(string()), // opsional, bisa string kosong, validasi file di handler
});

export type JadwalFormType = Omit<JadwalPosyanduCreateRequest, "file_name"> & {
  file_name?: (File & { __no_serialize__: true }) | string;
};

export const JadwalPosyanduForm = component$<JadwalPosyanduFormProps>(
  ({ initialData, onSubmit$, loading, submitButtonText }) => {
    const [form, { Form, Field }] = useForm<JadwalFormType>({
      loader: {
        value: {
          nama_kegiatan: initialData?.nama_kegiatan || "",
          jenis_kegiatan: initialData?.jenis_kegiatan || "",
          deskripsi: initialData?.deskripsi || "",
          lokasi: initialData?.lokasi || "",
          tanggal: initialData?.tanggal
            ? initialData.tanggal.substring(0, 10)
            : "",
          waktu_mulai: initialData?.waktu_mulai || "",
          waktu_selesai: initialData?.waktu_selesai || "",
          posyandu_id: initialData?.posyandu_id || "",
          file_name: initialData?.file_name || "",
        },
      },
      validate: valiForm$(jadwalSchema),
      validateOn: "blur",
      revalidateOn: "blur",
    });

    // Reset form values when initialData changes (for edit mode)
    useTask$(({ track }) => {
      track(() => initialData);
      if (initialData) {
        setValues(form, {
          nama_kegiatan: initialData.nama_kegiatan || "",
          jenis_kegiatan: initialData.jenis_kegiatan || "",
          deskripsi: initialData.deskripsi || "",
          lokasi: initialData.lokasi || "",
          tanggal: initialData.tanggal
            ? initialData.tanggal.substring(0, 10)
            : "",
          waktu_mulai: initialData.waktu_mulai || "",
          waktu_selesai: initialData.waktu_selesai || "",
          posyandu_id: initialData.posyandu_id || "",
          file_name: initialData.file_name || "",
        });
      }
    });

    return (
      <Form
        class="space-y-4"
        onSubmit$={async (values, event) => {
          // Ambil file dari input file manual
          const fileInput = (
            event?.target as HTMLFormElement
          )?.elements.namedItem("file_name") as HTMLInputElement;
          let file: File | string | undefined = undefined;
          if (fileInput?.files?.length && fileInput.files?.[0]) {
            file = noSerialize(fileInput.files[0]);
          } else if (values.file_name && typeof values.file_name === "string") {
            file = values.file_name;
          }
          // Kirim ke parent handler
          await onSubmit$({ ...values, file_name: file });
        }}
      >
        {/* Error global jika form tidak valid */}
        {form.invalid && (
          <div class="alert alert-error">
            Ada data yang belum valid/terisi. Silakan cek kembali field yang
            bertanda merah di bawah ini!
          </div>
        )}
        <Field name="nama_kegiatan" type="string">
          {(field, props) => (
            <>
              <FormFieldModular
                field={field}
                props={props}
                type="text"
                label="Nama Kegiatan"
                placeholder="Nama kegiatan"
                required
              />
              {field.error && (
                <div class="text-error text-xs mt-1">{field.error}</div>
              )}
            </>
          )}
        </Field>
        <Field name="jenis_kegiatan" type="string">
          {(field, props) => (
            <>
              <FormFieldModular
                field={field}
                props={props}
                type="text"
                label="Jenis Kegiatan"
                placeholder="Jenis kegiatan"
                required
              />
              {field.error && (
                <div class="text-error text-xs mt-1">{field.error}</div>
              )}
            </>
          )}
        </Field>
        <Field name="deskripsi" type="string">
          {(field, props) => (
            <>
              <FormFieldModular
                field={field}
                props={props}
                type="textarea"
                label="Deskripsi"
                placeholder="Deskripsi kegiatan"
                required
              />
              {field.error && (
                <div class="text-error text-xs mt-1">{field.error}</div>
              )}
            </>
          )}
        </Field>
        <Field name="lokasi" type="string">
          {(field, props) => (
            <>
              <FormFieldModular
                field={field}
                props={props}
                type="text"
                label="Lokasi"
                placeholder="Lokasi kegiatan"
                required
              />
              {field.error && (
                <div class="text-error text-xs mt-1">{field.error}</div>
              )}
            </>
          )}
        </Field>
        <Field name="posyandu_id" type="string">
          {(field, props) => (
            <input type="hidden" {...props} value={field.value || ""} />
          )}
        </Field>
        <div class="flex gap-4">
          <Field name="tanggal" type="string">
            {(field, props) => (
              <>
                <FormFieldModular
                  field={field}
                  props={props}
                  type="date"
                  label="Tanggal"
                  required
                />
                {field.error && (
                  <div class="text-error text-xs mt-1">{field.error}</div>
                )}
              </>
            )}
          </Field>
          <Field name="waktu_mulai" type="string">
            {(field, props) => (
              <>
                <FormFieldModular
                  field={field}
                  props={props}
                  type="time"
                  label="Waktu Mulai"
                  required
                />
                {field.error && (
                  <div class="text-error text-xs mt-1">{field.error}</div>
                )}
              </>
            )}
          </Field>
          <Field name="waktu_selesai" type="string">
            {(field, props) => (
              <>
                <FormFieldModular
                  field={field}
                  props={props}
                  type="time"
                  label="Waktu Selesai"
                  required
                />
                {field.error && (
                  <div class="text-error text-xs mt-1">{field.error}</div>
                )}
              </>
            )}
          </Field>
        </div>
        {/* File lama (jika ada) */}
        {typeof initialData?.file_name === "string" &&
          initialData?.file_name && (
            <div class="alert alert-info p-2 text-xs">
              File lama:{" "}
              <a
                href={buildUploadUrl(initialData?.file_name)}
                target="_blank"
                rel="noopener noreferrer"
                class="link link-primary underline break-all"
              >
                {initialData?.file_name}
              </a>
            </div>
          )}
        <div class="space-y-2">
          <label class="flex flex-col gap-1 text-sm font-medium">
            <span>Upload File (Opsional)</span>
            <input
              name="file_name"
              type="file"
              class="input input-bordered w-full focus-ring"
              accept="*"
            />
          </label>
          <div class="text-xs text-gray-500">
            Bisa dikosongkan jika tidak ingin mengisi file.
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={form.submitting || loading}
        >
          {form.submitting || loading
            ? "Menyimpan..."
            : submitButtonText || "Simpan Jadwal"}
        </button>
      </Form>
    );
  },
);
