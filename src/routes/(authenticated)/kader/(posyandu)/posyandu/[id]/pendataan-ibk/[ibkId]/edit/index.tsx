import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ibkService } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import { useEditIBK } from "~/hooks/useEditIBK";
import { useForm, valiForm$, setValues } from "@modular-forms/qwik";
import { object, string, nonEmpty, pipe, custom, InferOutput } from "valibot";
import { IBKSectionPersonalData } from "~/components/ibk/IBKPersonalStep";
import { IBKSectionDetail } from "~/components/ibk/IBKKunjunganStep";
import { IBKSectionAssessment } from "~/components/ibk/IBKPsikologiStep";
import { IBKSectionHealth } from "~/components/ibk/IBKDisabilitasStep";
import { IBKSectionDisability } from "~/components/ibk/IBKSectionDisability";

// Schema sama dengan create agar field konsisten
const ibkSchema = object({
  // Step 1: Data Diri
  nama: pipe(string(), nonEmpty("Nama wajib diisi")),
  nik: pipe(
    string(),
    custom((val) => /^\d{16}$/.test(val as string), "NIK harus 16 digit angka"),
  ),
  tempat_lahir: string(),
  tanggal_lahir: pipe(string(), nonEmpty("Tanggal lahir wajib diisi")),
  file: string(), // string sementara (URL/nama file)
  jenis_kelamin: pipe(string(), nonEmpty("Jenis kelamin wajib diisi")),
  agama: pipe(string(), nonEmpty("Agama wajib diisi")),
  umur: pipe(string(), nonEmpty("Umur wajib diisi")),
  alamat: pipe(string(), nonEmpty("Alamat wajib diisi")),
  no_telp: pipe(string(), nonEmpty("No. Telp wajib diisi")),
  nama_wali: pipe(string(), nonEmpty("Nama wali wajib diisi")),
  no_telp_wali: pipe(string(), nonEmpty("No. Telp wali wajib diisi")),
  // Step 2: Asesmen Psikologi
  total_iq: string(),
  kategori_iq: string(),
  tipe_kepribadian: string(),
  deskripsi_kepribadian: string(),
  catatan_psikolog: string(),
  rekomendasi_intervensi: string(),
  potensi: string(),
  minat: string(),
  bakat: string(),
  keterampilan: string(),
  // Step 3: Kesehatan
  odgj: string(),
  hasil_diagnosa: string(),
  jenis_bantuan: string(),
  riwayat_terapi: string(),
  // Step 4: Detail Sosial/Pendidikan
  pekerjaan: string(),
  pendidikan: string(),
  status_perkawinan: string(),
  titik_koordinat: string(),
  keterangan_tambahan: string(),
});

type IBKForm = Omit<InferOutput<typeof ibkSchema>, "file"> & { file: string };

const defaultIBKForm: IBKForm = {
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
  potensi: "",
  minat: "",
  bakat: "",
  keterampilan: "",
  odgj: "",
  hasil_diagnosa: "",
  jenis_bantuan: "",
  riwayat_terapi: "",
  pekerjaan: "",
  pendidikan: "",
  status_perkawinan: "",
  titik_koordinat: "",
  keterangan_tambahan: "",
};

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const posyanduId = loc.params.id as string;
  const ibkId = loc.params.ibkId as string;

  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const currentStep = useSignal(0);

  const [form, { Form }] = useForm<IBKForm>({
    loader: { value: { ...defaultIBKForm } },
    validate: valiForm$(ibkSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  const { updateIbk, loading: saving, error: saveErr, success } = useEditIBK();

  const steps = [
    { id: "ibk", title: "Data Diri IBK" },
    { id: "assessment", title: "Assessment" },
    { id: "kesehatan", title: "Data Kesehatan" },
    { id: "detail", title: "Detail IBK" },
    { id: "disabilitas", title: "Jenis Disabilitas" }, // placeholder jika dibutuhkan
  ];

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await ibkService.getIbkDetail(ibkId);
      const d = res?.data || res;
      const asses = d?.assesmen_ibk || {};
      const sehat = d?.kesehatan_ibk || {};
      const det = d?.detail_ibk || {};

      const mapVal: IBKForm = {
        nama: d?.nama ?? d?.personal_data?.nama_lengkap ?? "",
        nik: String(d?.nik ?? d?.personal_data?.nik ?? ""),
        tempat_lahir: d?.tempat_lahir ?? "",
        tanggal_lahir: (d?.tanggal_lahir ?? "").substring(0, 10),
        file: d?.file_foto ?? d?.file ?? "",
        jenis_kelamin: d?.jenis_kelamin ?? "",
        agama: d?.agama ?? "",
        umur: String(d?.umur ?? ""),
        alamat: d?.alamat ?? d?.personal_data?.alamat_lengkap ?? "",
        no_telp: d?.no_telp ?? "",
        nama_wali: d?.nama_wali ?? "",
        no_telp_wali: d?.no_telp_wali ?? "",
        total_iq: String(asses?.total_iq ?? ""),
        kategori_iq: asses?.kategori_iq ?? "",
        tipe_kepribadian: asses?.tipe_kepribadian ?? "",
        deskripsi_kepribadian: asses?.deskripsi_kepribadian ?? "",
        catatan_psikolog: asses?.catatan_psikolog ?? "",
        rekomendasi_intervensi: asses?.rekomendasi_intervensi ?? "",
        potensi: asses?.potensi ?? "",
        minat: asses?.minat ?? "",
        bakat: asses?.bakat ?? "",
        keterampilan: asses?.keterampilan ?? "",
        odgj: String(sehat?.odgj ?? ""),
        hasil_diagnosa: sehat?.hasil_diagnosa ?? "",
        jenis_bantuan: sehat?.jenis_bantuan ?? "",
        riwayat_terapi: sehat?.riwayat_terapi ?? "",
        pekerjaan: det?.pekerjaan ?? "",
        pendidikan: det?.pendidikan ?? "",
        status_perkawinan: det?.status_perkawinan ?? "",
        titik_koordinat: det?.titik_koordinat ?? "",
        keterangan_tambahan: det?.keterangan_tambahan ?? "",
      };

      setValues(form, mapVal);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  const renderSteps = () => (
    <>
      <div style={{ display: currentStep.value === 0 ? undefined : "none" }}>
        <IBKSectionPersonalData form={form} />
      </div>
      <div style={{ display: currentStep.value === 1 ? undefined : "none" }}>
        <IBKSectionAssessment form={form} />
      </div>
      <div style={{ display: currentStep.value === 2 ? undefined : "none" }}>
        <IBKSectionHealth form={form} />
      </div>
      <div style={{ display: currentStep.value === 3 ? undefined : "none" }}>
        <IBKSectionDetail form={form} />
      </div>
      <div style={{ display: currentStep.value === 4 ? undefined : "none" }}>
        <IBKSectionDisability />
      </div>
    </>
  );

  const handlePrev = $(() => {
    if (currentStep.value > 0) currentStep.value--;
  });
  const handleNext = $(() => {
    if (currentStep.value < steps.length - 1) currentStep.value++;
  });

  return (
    <div class="mx-auto w-full">
      <h1 class="text-2xl font-bold mb-4">Edit Data IBK</h1>
      {loading.value && <div class="loading loading-spinner loading-lg" />}
      {error.value && <div class="alert alert-error mb-3">{error.value}</div>}
      {success.value && (
        <div class="alert alert-success mb-3">{success.value}</div>
      )}

      {/* Stepper simple */}
      <div class="tabs tabs-lifted mb-4">
        {steps.map((s, idx) => (
          <a
            role="tab"
            key={s.id}
            class={`tab ${currentStep.value === idx ? "tab-active" : ""}`}
            onClick$={() => (currentStep.value = idx)}
          >
            {s.title}
          </a>
        ))}
      </div>

      <Form
        class="space-y-6"
        onSubmit$={async (values) => {
          // Kirim semua field; backend menerima file_foto sebagai string sementara
          await updateIbk({ id: ibkId, ...values, posyanduId });
          if (!saveErr.value) {
            nav(`/kader/posyandu/${posyanduId}/pendataan-ibk`);
          }
        }}
      >
        {renderSteps()}

        <div class="flex justify-between items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost"
            disabled={currentStep.value === 0}
            onClick$={handlePrev}
          >
            Sebelumnya
          </button>
          <div class="flex gap-2">
            {currentStep.value < steps.length - 1 ? (
              <button
                type="button"
                class="btn btn-primary"
                onClick$={handleNext}
              >
                Berikutnya
              </button>
            ) : (
              <button
                type="submit"
                class="btn btn-primary"
                disabled={saving.value}
              >
                {saving.value ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
});
