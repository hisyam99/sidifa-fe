import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";

export function IBKDisabilitasStep({ form }: Readonly<{ form: any }>) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field of={form} name="odgj">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="ODGJ*"
            required
          />
        )}
      </Field>
      <Field of={form} name="hasil_diagnosa">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Hasil Diagnosa*"
            required
          />
        )}
      </Field>
      <Field of={form} name="jenis_bantuan">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Jenis Bantuan*"
            required
          />
        )}
      </Field>
      <Field of={form} name="riwayat_terapi">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Riwayat Terapi*"
            required
          />
        )}
      </Field>
      <Field of={form} name="potensi">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Potensi"
          />
        )}
      </Field>
      <Field of={form} name="minat">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Minat"
          />
        )}
      </Field>
      <Field of={form} name="bakat">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Bakat"
          />
        )}
      </Field>
      <Field of={form} name="keterampilan">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Keterampilan"
          />
        )}
      </Field>
    </div>
  );
}

export default IBKDisabilitasStep;
