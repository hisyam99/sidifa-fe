import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { LuInfo } from "~/components/icons/lucide-optimized";

export function IBKSectionDetail({ form }: Readonly<{ form: any }>) {
  return (
    <>
      <div class="alert alert-info mb-4">
        <LuInfo class="w-5 h-5" />
        <span>
          Lengkapi detail sosial, pendidikan, dan lokasi IBK. Data ini penting
          untuk pemetaan dan tindak lanjut.
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field of={form} name="pekerjaan" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Pekerjaan"
            />
          )}
        </Field>
        <Field of={form} name="pendidikan" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Pendidikan"
            />
          )}
        </Field>
        <Field of={form} name="status_perkawinan" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="select"
              label="Status Perkawinan"
              options={[
                { value: "", label: "Pilih" },
                { value: "Belum menikah", label: "Belum menikah" },
                { value: "Menikah", label: "Menikah" },
                { value: "Cerai hidup", label: "Cerai hidup" },
                { value: "Cerai mati", label: "Cerai mati" },
              ]}
            />
          )}
        </Field>
        <Field of={form} name="titik_koordinat" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Titik Koordinat"
              placeholder="Contoh: -7.123456, 112.123456"
            />
          )}
        </Field>
        <Field of={form} name="keterangan_tambahan" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="textarea"
              label="Keterangan Tambahan"
              rows={3}
            />
          )}
        </Field>
      </div>
    </>
  );
}

export default IBKSectionDetail;
