import { Field, type FormStore } from "@modular-forms/qwik";
import { $ } from "@builder.io/qwik";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { MapPicker } from "~/components/ui/MapPicker";
import { LuInfo } from "~/components/icons/lucide-optimized";
import type { IBKFormData } from "~/types/ibk";

export function IBKSectionDetail({
  form,
}: Readonly<{
  form: FormStore<IBKFormData, undefined>;
}>) {
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
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Pekerjaan"
            />
          )}
        </Field>
        <Field of={form} name="pendidikan" type="string">
          {(field, props) => (
            <FormFieldModular
              field={field}
              props={props}
              type="text"
              label="Pendidikan"
            />
          )}
        </Field>
        <Field of={form} name="status_perkawinan" type="string">
          {(field, props) => (
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
          {(field, props) => (
            <div>
              <FormFieldModular
                field={field}
                props={props}
                type="text"
                label="Titik Koordinat"
                placeholder="Contoh: -7.123456, 112.123456"
              />
              <div class="mt-2">
                <MapPicker
                  currentValue={field.value}
                  onLocationSelect$={$((lat: number, lng: number) => {
                    const coordString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    // Update form value
                    field.value = coordString;
                    // Trigger input event to update form state
                    const input = document.querySelector(
                      `input[name="titik_koordinat"]`,
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = coordString;
                      input.dispatchEvent(
                        new Event("input", { bubbles: true }),
                      );
                    }
                  })}
                />
              </div>
            </div>
          )}
        </Field>
        <Field of={form} name="keterangan_tambahan" type="string">
          {(field, props) => (
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
