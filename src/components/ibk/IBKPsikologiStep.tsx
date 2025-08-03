import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";

export function IBKPsikologiStep({ form }: Readonly<{ form: any }>) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field of={form} name="total_iq" type="number">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="number"
            label="Total IQ"
            min={0}
            max={200}
          />
        )}
      </Field>
      <Field of={form} name="kategori_iq" type="string">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Kategori IQ"
          />
        )}
      </Field>
      <Field of={form} name="tipe_kepribadian" type="string">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Tipe Kepribadian"
          />
        )}
      </Field>
      <Field of={form} name="deskripsi_kepribadian" type="string">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="textarea"
            label="Deskripsi Kepribadian"
            rows={3}
          />
        )}
      </Field>
      <Field of={form} name="catatan_psikolog" type="string">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="textarea"
            label="Catatan Psikolog"
            rows={3}
          />
        )}
      </Field>
      <Field of={form} name="rekomendasi_intervensi" type="string">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="textarea"
            label="Rekomendasi Intervensi"
            rows={3}
          />
        )}
      </Field>
    </div>
  );
}

export default IBKPsikologiStep;
