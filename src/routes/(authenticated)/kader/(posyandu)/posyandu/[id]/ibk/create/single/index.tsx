import { component$, useSignal, $ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { ibkService, getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import { object, string, nonEmpty, pipe, InferOutput } from "valibot";
import type { PosyanduDetail } from "~/types";
import { useVisibleTask$ } from "@builder.io/qwik";

const ibkSchema = object({
  nama: pipe(string(), nonEmpty("Nama wajib diisi")),
  nik: string(),
  tempat_lahir: string(),
  tanggal_lahir: pipe(string(), nonEmpty("Tanggal lahir wajib diisi")),
  file: pipe(string(), nonEmpty("Foto wajib diisi")),
  jenis_kelamin: pipe(string(), nonEmpty("Jenis kelamin wajib diisi")),
  agama: pipe(string(), nonEmpty("Agama wajib diisi")),
  umur: pipe(string(), nonEmpty("Umur wajib diisi")),
  alamat: pipe(string(), nonEmpty("Alamat wajib diisi")),
  no_telp: pipe(string(), nonEmpty("No. Telp wajib diisi")),
  nama_wali: pipe(string(), nonEmpty("Nama wali wajib diisi")),
  no_telp_wali: pipe(string(), nonEmpty("No. Telp wali wajib diisi")),
  total_iq: string(),
  kategori_iq: string(),
  tipe_kepribadian: string(),
  deskripsi_kepribadian: string(),
  catatan_psikolog: string(),
  rekomendasi_intervensi: string(),
  odgj: pipe(string(), nonEmpty("ODGJ wajib diisi")),
  hasil_diagnosa: pipe(string(), nonEmpty("Hasil diagnosa wajib diisi")),
  jenis_bantuan: pipe(string(), nonEmpty("Jenis bantuan wajib diisi")),
  riwayat_terapi: pipe(string(), nonEmpty("Riwayat terapi wajib diisi")),
  potensi: string(),
  minat: string(),
  bakat: string(),
  keterampilan: string(),
  pekerjaan: pipe(string(), nonEmpty("Pekerjaan wajib diisi")),
  pendidikan: pipe(string(), nonEmpty("Pendidikan wajib diisi")),
  status_perkawinan: pipe(string(), nonEmpty("Status perkawinan wajib diisi")),
  titik_koordinat: pipe(string(), nonEmpty("Titik koordinat wajib diisi")),
  keterangan_tambahan: string(),
});

type IBKForm = Omit<InferOutput<typeof ibkSchema>, "file"> & {
  file: string;
};

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const posyanduId = loc.params.id;
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const loading = useSignal(true);
  const posyandu = useSignal<PosyanduDetail | null>(null);
  const posyanduError = useSignal<string | null>(null);

  useVisibleTask$(async ({ track }) => {
    track(() => posyanduId);
    loading.value = true;
    posyanduError.value = null;
    try {
      const res = await getPosyanduDetail(posyanduId);
      posyandu.value = res;
    } catch (err: any) {
      posyanduError.value = extractErrorMessage(err);
      posyandu.value = null;
    } finally {
      loading.value = false;
    }
  });

  const [form, { Form }] = useForm<IBKForm>({
    loader: {
      value: {
        nama: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        file: "",
        jenis_kelamin: "",
        agama: "",
        umur: "",
        alamat: "",
        no_telp: "",
        nama_wali: "",
        no_telp_wali: "",
        total_iq: "",
        kategori_iq: "",
        tipe_kepribadian: "",
        deskripsi_kepribadian: "",
        catatan_psikolog: "",
        rekomendasi_intervensi: "",
        odgj: "",
        hasil_diagnosa: "",
        jenis_bantuan: "",
        riwayat_terapi: "",
        potensi: "",
        minat: "",
        bakat: "",
        keterampilan: "",
        pekerjaan: "",
        pendidikan: "",
        status_perkawinan: "",
        titik_koordinat: "",
        keterangan_tambahan: "",
      },
    },
    validate: valiForm$(ibkSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const handleSubmit = $(async (values: IBKForm) => {
    error.value = null;
    success.value = null;
    try {
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("nik", values.nik);
      formData.append("tempat_lahir", values.tempat_lahir);
      // Format tanggal_lahir ke ISO-8601 jika hanya YYYY-MM-DD
      let tanggalLahirValue = values.tanggal_lahir;
      if (/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahirValue)) {
        tanggalLahirValue = new Date(tanggalLahirValue).toISOString();
      }
      formData.append("tanggal_lahir", tanggalLahirValue);
      formData.append("file_foto", values.file ?? "");
      formData.append("jenis_kelamin", values.jenis_kelamin);
      formData.append("agama", values.agama);
      formData.append("umur", values.umur);
      formData.append("alamat", values.alamat);
      formData.append("no_telp", values.no_telp);
      formData.append("nama_wali", values.nama_wali);
      formData.append("no_telp_wali", values.no_telp_wali);
      formData.append("posyanduId", posyanduId);
      formData.append("pekerjaan", values.pekerjaan);
      formData.append("pendidikan", values.pendidikan);
      formData.append("status_perkawinan", values.status_perkawinan);
      formData.append("titik_koordinat", values.titik_koordinat);
      formData.append("keterangan_tambahan", values.keterangan_tambahan);
      // Pastikan total_iq tidak kosong
      const totalIqValue =
        values.total_iq && values.total_iq !== "" ? values.total_iq : "0";
      formData.append("total_iq", totalIqValue);
      formData.append("kategori_iq", values.kategori_iq);
      formData.append("tipe_kepribadian", values.tipe_kepribadian);
      formData.append("deskripsi_kepribadian", values.deskripsi_kepribadian);
      formData.append("potensi", values.potensi);
      formData.append("minat", values.minat);
      formData.append("bakat", values.bakat);
      formData.append("keterampilan", values.keterampilan);
      formData.append("catatan_psikolog", values.catatan_psikolog);
      formData.append("rekomendasi_intervensi", values.rekomendasi_intervensi);
      formData.append("odgj", values.odgj);
      formData.append("hasil_diagnosa", values.hasil_diagnosa);
      formData.append("jenis_bantuan", values.jenis_bantuan);
      formData.append("riwayat_terapi", values.riwayat_terapi);
      await ibkService.createIbk(formData);
      success.value = "Data IBK berhasil disimpan.";
      setTimeout(() => nav(`/kader/posyandu`), 1500);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    }
  });

  return (
    <div class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">
        Formulir Pendataan IBK (Single Page)
      </h1>
      {loading.value && <div>Loading...</div>}
      {posyanduError.value && (
        <div class="alert alert-error mb-2" role="alert">
          {posyanduError.value}
        </div>
      )}
      {posyandu.value && (
        <div class="mb-4 p-4 rounded bg-base-200">
          <div>
            <b>Posyandu:</b> {posyandu.value.nama_posyandu}
          </div>
          <div>
            <b>Alamat:</b> {posyandu.value.alamat}
          </div>
          <div>
            <b>No. Telp:</b> {posyandu.value.no_telp}
          </div>
        </div>
      )}
      {error.value && (
        <div class="alert alert-error mb-2" role="alert">
          {error.value}
        </div>
      )}
      {success.value && (
        <output class="alert alert-success mb-2">{success.value}</output>
      )}
      {posyandu.value && (
        <Form
          onSubmit$={handleSubmit}
          class="space-y-6 w-full"
          encType="multipart/form-data"
        >
          {/* Data Diri */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField form={form} name="nama" label="Nama*" required />
            <InputField form={form} name="nik" label="NIK" />
            <InputField
              form={form}
              name="tempat_lahir"
              label="Tempat Lahir*"
              required
            />
            <InputField
              form={form}
              name="tanggal_lahir"
              label="Tanggal Lahir*"
              type="date"
              required
            />
            <InputField
              form={form}
              name="file"
              label="Foto* (URL atau nama file)"
              required
            />
            <InputField
              form={form}
              name="jenis_kelamin"
              label="Jenis Kelamin*"
              required
            />
            <InputField form={form} name="agama" label="Agama*" required />
            <InputField form={form} name="umur" label="Umur*" required />
            <InputField form={form} name="alamat" label="Alamat*" required />
            <InputField form={form} name="no_telp" label="No. Telp*" required />
            <InputField
              form={form}
              name="nama_wali"
              label="Nama Wali*"
              required
            />
            <InputField
              form={form}
              name="no_telp_wali"
              label="No. Telp Wali*"
              required
            />
          </div>
          {/* Assessment */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              form={form}
              name="total_iq"
              label="Total IQ*"
              type="number"
              required
              toStringOnInput
            />
            <InputField
              form={form}
              name="kategori_iq"
              label="Kategori IQ*"
              required
            />
            <InputField
              form={form}
              name="tipe_kepribadian"
              label="Tipe Kepribadian*"
              required
            />
            <InputField
              form={form}
              name="deskripsi_kepribadian"
              label="Deskripsi Kepribadian*"
              required
            />
            <InputField
              form={form}
              name="catatan_psikolog"
              label="Catatan Psikolog*"
              required
            />
            <InputField
              form={form}
              name="rekomendasi_intervensi"
              label="Rekomendasi Intervensi*"
              required
            />
          </div>
          {/* Disabilitas & Kesehatan */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField form={form} name="odgj" label="ODGJ*" required />
            <InputField
              form={form}
              name="hasil_diagnosa"
              label="Hasil Diagnosa*"
              required
            />
            <InputField
              form={form}
              name="jenis_bantuan"
              label="Jenis Bantuan*"
              required
            />
            <InputField
              form={form}
              name="riwayat_terapi"
              label="Riwayat Terapi*"
              required
            />
            <InputField form={form} name="potensi" label="Potensi" />
            <InputField form={form} name="minat" label="Minat" />
            <InputField form={form} name="bakat" label="Bakat" />
            <InputField form={form} name="keterampilan" label="Keterampilan" />
            <InputField
              form={form}
              name="pekerjaan"
              label="Pekerjaan*"
              required
            />
            <InputField
              form={form}
              name="pendidikan"
              label="Pendidikan*"
              required
            />
            <InputField
              form={form}
              name="status_perkawinan"
              label="Status Perkawinan*"
              required
            />
            <InputField
              form={form}
              name="titik_koordinat"
              label="Titik Koordinat*"
              required
            />
            <InputField
              form={form}
              name="keterangan_tambahan"
              label="Keterangan Tambahan"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary gap-2"
            disabled={form.submitting || form.invalid}
          >
            {form.submitting ? "Menyimpan..." : "Simpan Data IBK"}
          </button>
          {form.invalid && (
            <div class="alert alert-error mt-2">
              Ada data yang belum valid/terisi. Silakan cek kembali!
            </div>
          )}
        </Form>
      )}
      {!loading.value && !posyandu.value && !posyanduError.value && (
        <div class="alert alert-warning" role="alert">
          Data posyandu tidak ditemukan.
        </div>
      )}
    </div>
  );
});

// Komponen input field modular
import { Field } from "@modular-forms/qwik";

interface InputFieldProps {
  form: any;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  toStringOnInput?: boolean;
}

export const InputField = component$<InputFieldProps>(
  ({ form, name, label, type = "text", required, toStringOnInput }) => {
    return (
      <Field
        of={form}
        name={name}
        type={type === "number" ? "number" : "string"}
      >
        {(field: any, props: any) => (
          <div class="mb-2">
            <label class="block font-medium mb-1">{label}</label>
            <input
              {...props}
              type={type}
              class="input input-bordered w-full"
              required={required}
              onInput$={
                toStringOnInput
                  ? $((e: any) => {
                      field.setValue(e.target.value.toString());
                      if (props.onInput$) props.onInput$(e);
                    })
                  : props.onInput$
              }
            />
            {field.error && (
              <div class="text-error text-xs mt-1">{field.error}</div>
            )}
          </div>
        )}
      </Field>
    );
  },
);
