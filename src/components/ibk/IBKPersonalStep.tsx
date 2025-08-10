import { Field } from "@modular-forms/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { LuInfo } from "~/components/icons/lucide-optimized";

export function IBKSectionPersonalData({ form }: Readonly<{ form: any }>) {
  return (
    <>
      <div class="alert alert-info mb-4">
        <LuInfo class="w-5 h-5" />
        <span>
          Isi data diri IBK sesuai dokumen resmi. Pastikan data yang diinput
          sudah benar dan lengkap.
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field of={form} name="nama" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Nama"
              placeholder="Nama lengkap"
              required
            />
          )}
        </Field>
        <Field of={form} name="nik" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="number"
              label="NIK"
              placeholder="16 digit NIK"
              required
            />
          )}
        </Field>
        <Field of={form} name="tempat_lahir" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Tempat Lahir"
              placeholder="Tempat lahir"
              required
            />
          )}
        </Field>
        <Field of={form} name="tanggal_lahir" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="date"
              label="Tanggal Lahir"
              required
            />
          )}
        </Field>
        <Field of={form} name="file" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Foto (URL atau nama file)"
              helper="Masukkan URL foto atau nama file sesuai kebutuhan backend."
            />
          )}
        </Field>
        <Field of={form} name="jenis_kelamin" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="select"
              label="Jenis Kelamin"
              required
              options={[
                { value: "", label: "Pilih" },
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ]}
            />
          )}
        </Field>
        <Field of={form} name="agama" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Agama"
              required
            />
          )}
        </Field>
        <Field of={form} name="umur" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="number"
              label="Umur"
              required
              min={0}
              max={120}
            />
          )}
        </Field>
        <Field of={form} name="alamat" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Alamat"
              required
            />
          )}
        </Field>
        <Field of={form} name="no_telp" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="tel"
              label="No. Telp"
              required
            />
          )}
        </Field>
        <Field of={form} name="nama_wali" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Nama Wali"
              required
            />
          )}
        </Field>
        <Field of={form} name="no_telp_wali" type="string">
          {(field: any, props: any) => (
            <FormFieldModular
              field={field}
              props={props}
              type="tel"
              label="No. Telp Wali"
              required
            />
          )}
        </Field>
      </div>
    </>
  );
}

export default IBKSectionPersonalData;
