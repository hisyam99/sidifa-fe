import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";

export function IBKPersonalStep({ form }: Readonly<{ form: any }>) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field of={form} name="nama">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Nama*"
            placeholder="Nama lengkap"
            required
          />
        )}
      </Field>
      <Field of={form} name="nik">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="NIK*"
            placeholder="16 digit NIK"
            required
          />
        )}
      </Field>
      <Field of={form} name="tempat_lahir">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Tempat Lahir"
            placeholder="Tempat lahir"
          />
        )}
      </Field>
      <Field of={form} name="tanggal_lahir">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="date"
            label="Tanggal Lahir*"
            required
          />
        )}
      </Field>
      <Field of={form} name="file">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="file"
            label="Foto*"
            required
            helper="File harus dipilih ulang jika Anda kembali ke langkah ini."
          />
        )}
      </Field>
      <Field of={form} name="jenis_kelamin">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="select"
            label="Jenis Kelamin*"
            required
            options={[
              { value: "", label: "Pilih" },
              { value: "Laki-laki", label: "Laki-laki" },
              { value: "Perempuan", label: "Perempuan" },
            ]}
          />
        )}
      </Field>
      <Field of={form} name="agama">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Agama*"
            required
          />
        )}
      </Field>
      <Field of={form} name="umur">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="number"
            label="Umur*"
            required
            min={0}
            max={120}
          />
        )}
      </Field>
      <Field of={form} name="alamat">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Alamat*"
            required
          />
        )}
      </Field>
      <Field of={form} name="no_telp">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="tel"
            label="No. Telp*"
            required
          />
        )}
      </Field>
      <Field of={form} name="nama_wali">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="text"
            label="Nama Wali*"
            required
          />
        )}
      </Field>
      <Field of={form} name="no_telp_wali">
        {(field: any, props: any) => (
          <FormFieldModular
            field={field}
            props={props}
            type="tel"
            label="No. Telp Wali*"
            required
          />
        )}
      </Field>
    </div>
  );
}

export default IBKPersonalStep;
