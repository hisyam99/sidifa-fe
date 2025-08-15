import {
  component$,
  QRL,
  useSignal,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { object, string, nonEmpty, minLength, pipe, optional } from "valibot";
import type {
  MonitoringIBKCreateRequest,
  MonitoringIBKUpdateRequest,
  MonitoringIBKItem,
} from "~/types";
import FormFieldModular from "~/components/ui/FormFieldModular";
import { monitoringIBKService } from "~/services/monitoring-ibk.service";

interface MonitoringIBKFormProps {
  initialData?: Partial<MonitoringIBKItem> & { posyandu_id?: string };
  onSubmit$: QRL<
    (
      data: MonitoringIBKCreateRequest | MonitoringIBKUpdateRequest,
    ) => Promise<void>
  >;
  loading?: boolean;
  submitButtonText?: string;
  isEditing?: boolean;
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

type HadirItem = {
  id: string; // presensi IBK id
  nama: string;
  nik?: string | number;
  jenis_kelamin?: string;
};

export const MonitoringIBKForm = component$<MonitoringIBKFormProps>(
  ({ initialData, onSubmit$, loading, submitButtonText, isEditing }) => {
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

    // Dropdown state (match IBKSearchSelect behavior/style)
    const query = useSignal("");
    const open = useSignal(false);
    const loadingItems = useSignal(false);
    const items = useSignal<HadirItem[]>([]);
    const selectedLabel = useSignal<string>("");
    const errorItems = useSignal<string | null>(null);

    // Pagination
    const page = useSignal(1);
    const totalPage = useSignal(1);
    const LIMIT = 16;

    const jadwalId = initialData?.jadwal_posyandu_id || "";

    const fetchItems = $(async (reset = false) => {
      if (!jadwalId) return;
      if (loadingItems.value) return;
      loadingItems.value = true;
      errorItems.value = null;
      try {
        const res = await monitoringIBKService.listHadirByJadwal(jadwalId, {
          limit: LIMIT,
          page: page.value,
        });
        const data = (res?.data || []) as any[];
        const mapped = data.map((d: any) => ({
          id: d.id,
          nama: d.nama || d.ibk?.nama || "(Tanpa Nama)",
          nik: d.nik ?? d.ibk?.nik,
          jenis_kelamin: d.jenis_kelamin ?? d.ibk?.jenis_kelamin,
        })) as HadirItem[];
        if (reset) {
          items.value = mapped;
        } else {
          items.value = [...items.value, ...mapped];
        }
        const meta: any = res?.meta || {};
        totalPage.value = (meta.totalPage as number) || totalPage.value || 1;
      } catch (e: any) {
        errorItems.value = e?.message || "Gagal memuat daftar IBK hadir";
      } finally {
        loadingItems.value = false;
      }
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      page.value = 1;
      items.value = [];
    });

    const openDropdown = $(() => {
      if (!open.value) {
        open.value = true;
        if (items.value.length === 0) {
          page.value = 1;
          fetchItems(true);
        }
      }
    });

    const closeDropdown = $(() => {
      // small delay so click can register
      setTimeout(() => (open.value = false), 120);
    });

    const handleScroll = $((e: Event) => {
      const el = e.target as HTMLElement;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      if (nearBottom && !loadingItems.value && page.value < totalPage.value) {
        page.value = page.value + 1;
        fetchItems();
      }
    });

    const applySelection = $((payload: { id: string; label: string }) => {
      selectedLabel.value = payload.label;
      const el = document.getElementById(
        "monitoring-ibk-id",
      ) as HTMLInputElement | null;
      if (el) {
        el.value = payload.id;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      open.value = false;
    });

    // Filter rendered items locally to mimic search feel (no server param required)
    const visibleItems = () => {
      const q = (query.value || "").toLowerCase();
      if (!q) return items.value;
      return items.value.filter((r) =>
        (r.nama || "").toLowerCase().includes(q),
      );
    };

    return (
      <Form
        class="space-y-4"
        onSubmit$={async (values) => {
          await onSubmit$(values);
        }}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">
              <span class="label-text font-medium">Pilih IBK</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                class="input input-bordered w-full"
                value={form.internal.fields?.ibk_id?.value as string}
                readOnly
                disabled
              />
            ) : (
              <div class="relative w-full" onClick$={openDropdown}>
                <input
                  type="text"
                  class="input input-bordered w-full"
                  placeholder={"Cari nama IBK..."}
                  value={selectedLabel.value || query.value}
                  onInput$={(e) => {
                    selectedLabel.value = "";
                    query.value = (e.target as HTMLInputElement).value;
                  }}
                  onFocus$={openDropdown}
                  onBlur$={closeDropdown}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellcheck={false}
                />
                {open.value && (
                  <ul
                    class="absolute left-0 right-0 mt-2 z-[9999] menu menu-sm p-2 shadow bg-base-100 rounded-box max-h-60 overflow-auto"
                    onScroll$={handleScroll}
                  >
                    {loadingItems.value && (
                      <li class="px-2 py-1 text-sm">Memuat...</li>
                    )}
                    {!loadingItems.value && errorItems.value && (
                      <li class="px-2 py-1 text-sm text-error">
                        {errorItems.value}
                      </li>
                    )}
                    {!loadingItems.value && visibleItems().length === 0 && (
                      <li class="px-2 py-1 text-sm text-base-content/60">
                        Tidak ada hasil
                      </li>
                    )}
                    {!loadingItems.value &&
                      visibleItems().map((row) => {
                        const label = row.nama || "(Tanpa Nama)";
                        return (
                          <li key={row.id}>
                            <button
                              type="button"
                              class="justify-start"
                              onClick$={$(() =>
                                applySelection({ id: row.id, label }),
                              )}
                            >
                              {label}
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            )}
            {/* Hidden field to satisfy form state */}
            <Field name="ibk_id" type="string">
              {(field, props) => (
                <input
                  id="monitoring-ibk-id"
                  type="hidden"
                  {...props}
                  value={field.value || ""}
                />
              )}
            </Field>
          </div>
          <Field name="jadwal_posyandu_id" type="string">
            {(field, props) => (
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">Jadwal Posyandu ID</span>
                </label>
                <input
                  {...props}
                  type="text"
                  value={field.value || ""}
                  class="input input-bordered w-full focus-ring"
                  readOnly
                  disabled
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/60">
                    Otomatis dari jadwal terpilih
                  </span>
                </label>
              </div>
            )}
          </Field>
        </div>
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
