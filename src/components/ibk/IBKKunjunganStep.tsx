import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";

export function IBKKunjunganStep({ form }: Readonly<{ form: any }>) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field of={form} name="pekerjaan">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Pekerjaan*"
            required
          />
        )}
      </Field>
      <Field of={form} name="pendidikan">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Pendidikan*"
            required
          />
        )}
      </Field>
      <Field of={form} name="status_perkawinan">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="select"
            label="Status Perkawinan*"
            required
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
      <Field of={form} name="titik_koordinat">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Titik Koordinat*"
            required
            placeholder="Contoh: -7.123456, 112.123456"
          />
        )}
      </Field>
      <Field of={form} name="keterangan_tambahan">
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
  );
}

export default IBKKunjunganStep;
