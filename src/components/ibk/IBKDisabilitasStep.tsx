import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { LuInfo } from "~/components/icons/lucide-optimized";

export function IBKSectionHealth({ form }: Readonly<{ form: any }>) {
  return (
    <>
      <div class="alert alert-info mb-4">
        <LuInfo class="w-5 h-5" />
        <span>
          Isi data kesehatan IBK secara lengkap untuk memudahkan pemantauan dan
          intervensi yang diperlukan.
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field of={form} name="odgj" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="select"
              label="ODGJ"
              required
              options={[
                { value: "", label: "Pilih" },
                { value: "true", label: "Iya" },
                { value: "false", label: "Tidak" },
              ]}
            />
          )}
        </Field>
        <Field of={form} name="hasil_diagnosa" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Hasil Diagnosa"
            />
          )}
        </Field>
        <Field of={form} name="jenis_bantuan" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Jenis Bantuan"
            />
          )}
        </Field>
        <Field of={form} name="riwayat_terapi" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Riwayat Terapi"
            />
          )}
        </Field>
      </div>
    </>
  );
}

export default IBKSectionHealth;
