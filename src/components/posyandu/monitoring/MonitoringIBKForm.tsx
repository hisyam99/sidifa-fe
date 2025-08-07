import { component$, QRL } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { object, string, nonEmpty, minLength, pipe, optional } from "valibot";
import type {
  MonitoringIBKCreateRequest,
  MonitoringIBKUpdateRequest,
  MonitoringIBKItem,
} from "~/types";
import FormFieldModular from "~/components/ui/FormFieldModular";

interface MonitoringIBKFormProps {
  initialData?: Partial<MonitoringIBKItem>;
  onSubmit$: QRL<
    (
      data: MonitoringIBKCreateRequest | MonitoringIBKUpdateRequest,
    ) => Promise<void>
  >;
  loading?: boolean;
  submitButtonText?: string;
}

const monitoringSchema = object({
  ibk_id: pipe(string(), nonEmpty("IBK wajib dipilih")),
  jadwal_posyandu_id: pipe(string(), nonEmpty("Jadwal wajib diisi")),
  keluhan: pipe(string(), nonEmpty("Keluhan wajib diisi"), minLength(3)),
  perilaku_baru: pipe(string(), nonEmpty("Perilaku baru wajib diisi")),
  tindak_lanjut: pipe(string(), nonEmpty("Tindak lanjut wajib diisi")),
  fungsional_checklist: pipe(string(), nonEmpty("Checklist wajib diisi")),
  tanggal_kunjungan: pipe(string(), nonEmpty("Tanggal kunjungan wajib diisi")),
  kecamatan: pipe(string(), nonEmpty("Kecamatan wajib diisi")),
  keterangan: optional(string()),
});

export type MonitoringFormType = MonitoringIBKCreateRequest & {
  [key: string]: any;
};

export const MonitoringIBKForm = component$<MonitoringIBKFormProps>(
  ({ initialData, onSubmit$, loading, submitButtonText }) => {
    const [form, { Form, Field }] = useForm<MonitoringFormType>({
      loader: {
        value: {
          ibk_id: initialData?.ibk_id || "",
          jadwal_posyandu_id: initialData?.jadwal_posyandu_id || "",
          keluhan: initialData?.keluhan || "",
          perilaku_baru: initialData?.perilaku_baru || "",
          tindak_lanjut: initialData?.tindak_lanjut || "",
          fungsional_checklist: initialData?.fungsional_checklist || "",
          tanggal_kunjungan: initialData?.tanggal_kunjungan
            ? initialData.tanggal_kunjungan.substring(0, 10)
            : "",
          kecamatan: initialData?.kecamatan || "",
          keterangan: initialData?.keterangan || "",
        },
      },
      validate: valiForm$(monitoringSchema),
      validateOn: "blur",
      revalidateOn: "blur",
    });

    return (
      <Form
        class="space-y-4"
        onSubmit$={async (values) => {
          await onSubmit$(values);
        }}
      >
        <Field name="ibk_id" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="IBK ID"
              placeholder="Pilih/isi IBK ID"
              required
            />
          )}
        </Field>
        <Field name="jadwal_posyandu_id" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Jadwal Posyandu ID"
              placeholder="ID Jadwal"
              required
            />
          )}
        </Field>
        <Field name="tanggal_kunjungan" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="date"
              label="Tanggal Kunjungan"
              required
            />
          )}
        </Field>
        <Field name="kecamatan" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Kecamatan"
              placeholder="Kecamatan kunjungan"
              required
            />
          )}
        </Field>
        <Field name="keluhan" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="textarea"
              label="Keluhan"
              placeholder="Keluhan IBK"
              required
            />
          )}
        </Field>
        <Field name="perilaku_baru" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Perilaku Baru"
              placeholder="Perilaku baru yang diamati"
              required
            />
          )}
        </Field>
        <Field name="tindak_lanjut" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="textarea"
              label="Tindak Lanjut"
              placeholder="Rencana tindak lanjut"
              required
            />
          )}
        </Field>
        <Field name="fungsional_checklist" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Checklist Fungsional"
              placeholder="ID/Ref checklist"
              required
            />
          )}
        </Field>
        <Field name="keterangan" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="textarea"
              label="Keterangan"
              placeholder="Keterangan tambahan (opsional)"
            />
          )}
        </Field>

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={form.submitting || loading}
        >
          {form.submitting || loading
            ? "Menyimpan..."
            : submitButtonText || "Simpan Monitoring"}
        </button>
      </Form>
    );
  },
);
