import {
  component$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { ibkService, getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import { object, string, nonEmpty, pipe, custom, InferOutput } from "valibot";
import { IBKSectionPersonalData } from "~/components/ibk/IBKPersonalStep";
import { IBKSectionDetail } from "~/components/ibk/IBKKunjunganStep";
import { IBKSectionAssessment } from "~/components/ibk/IBKPsikologiStep";
import { IBKSectionHealth } from "~/components/ibk/IBKDisabilitasStep";
import { IBKSectionDisability } from "~/components/ibk/IBKSectionDisability";

const ibkSchema = object({
  // Step 1: Data Diri
  nama: pipe(string(), nonEmpty("Nama wajib diisi")),
  nik: pipe(
    string(),
    custom((val) => /^\d{16}$/.test(val as string), "NIK harus 16 digit angka"),
  ),
  tempat_lahir: string(),
  tanggal_lahir: pipe(string(), nonEmpty("Tanggal lahir wajib diisi")),
  file: string(),
  jenis_kelamin: pipe(string(), nonEmpty("Jenis kelamin wajib diisi")),
  agama: pipe(string(), nonEmpty("Agama wajib diisi")),
  umur: pipe(string(), nonEmpty("Umur wajib diisi")),
  alamat: pipe(string(), nonEmpty("Alamat wajib diisi")),
  no_telp: pipe(string(), nonEmpty("No. Telp wajib diisi")),
  nama_wali: pipe(string(), nonEmpty("Nama wali wajib diisi")),
  no_telp_wali: pipe(string(), nonEmpty("No. Telp wali wajib diisi")),
  // Step 2: Asesmen Psikologi (semua opsional)
  total_iq: string(),
  kategori_iq: string(),
  tipe_kepribadian: string(),
  deskripsi_kepribadian: string(),
  catatan_psikolog: string(),
  rekomendasi_intervensi: string(),
  // Step 3: Kesehatan (hanya odgj wajib)
  odgj: pipe(string(), nonEmpty("ODGJ wajib diisi")),
  hasil_diagnosa: string(),
  jenis_bantuan: string(),
  riwayat_terapi: string(),
  potensi: string(),
  minat: string(),
  bakat: string(),
  keterampilan: string(),
  // Step 4: Detail IBK (semua opsional)
  pekerjaan: string(),
  pendidikan: string(),
  status_perkawinan: string(),
  titik_koordinat: string(),
  keterangan_tambahan: string(),
});

type IBKForm = Omit<InferOutput<typeof ibkSchema>, "file"> & {
  file: string;
};

import type { PosyanduDetail } from "~/types";
import { GenericLoadingSpinner } from "~/components/common/GenericLoadingSpinner";

// Default value IBKForm
const defaultIBKForm = {
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
};

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const posyanduId = loc.params.id;
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const currentStep = useSignal(0);
  const createdIbkId = useSignal<string | null>(null);
  const selectedDisabilities = useSignal<
    Array<{
      jenis_difabilitas_id: string;
      tingkat_keparahan: string;
      sejak_kapan?: string;
      keterangan?: string;
    }>
  >([]);
  // State global untuk data IBKForm
  const formDataStore = useStore<IBKForm>({ ...defaultIBKForm });

  // Posyandu detail state
  const loading = useSignal(true);
  const posyandu = useSignal<PosyanduDetail | null>(null);
  const posyanduError = useSignal<string | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
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

  // Satu useForm global untuk seluruh step
  const [form, { Form }] = useForm<IBKForm>({
    loader: { value: formDataStore },
    validate: valiForm$(ibkSchema),
    validateOn: "blur",
    revalidateOn: "blur",
  });

  // Refactor: steps array only static data
  const steps = [
    { id: "ibk", title: "Data Diri IBK" },
    { id: "detail", title: "Detail IBK" },
    { id: "assessment", title: "Assessment" },
    { id: "disabilitas", title: "Jenis Disabilitas" },
    { id: "kesehatan", title: "Data Kesehatan" },
  ];

  // Render semua step, field yang tidak aktif di-hide
  function renderAllSteps() {
    return (
      <>
        <div style={{ display: currentStep.value === 0 ? undefined : "none" }}>
          <IBKSectionPersonalData form={form} />
        </div>
        <div style={{ display: currentStep.value === 1 ? undefined : "none" }}>
          <IBKSectionDetail form={form} />
        </div>
        <div style={{ display: currentStep.value === 2 ? undefined : "none" }}>
          <IBKSectionAssessment form={form} />
        </div>
        <div style={{ display: currentStep.value === 3 ? undefined : "none" }}>
          <IBKSectionDisability
            onChangeSelections$={$(
              (
                items: Array<{
                  jenis_difabilitas_id: string;
                  tingkat_keparahan: string;
                  sejak_kapan?: string;
                  keterangan?: string;
                }>,
              ) => {
                selectedDisabilities.value = items;
              },
            )}
          />
        </div>
        <div style={{ display: currentStep.value === 4 ? undefined : "none" }}>
          <IBKSectionHealth form={form} />
        </div>
      </>
    );
  }

  const handlePrevious = $(() => {
    if (currentStep.value > 0) currentStep.value--;
  });

  // Helper validasi hanya field step saat ini
  const isCurrentStepValid = $(() => {
    // Step Detail IBK tidak wajib, selalu true
    if (currentStep.value === 1) return true;

    // Step Assessment tidak wajib, selalu true
    if (currentStep.value === 2) return true;

    // Step Kesehatan: hanya odgj yang wajib (sekarang step terakhir index 4)
    if (currentStep.value === 4) {
      const fld =
        form.internal.fields["odgj" as keyof typeof form.internal.fields];
      return !fld?.error && fld?.value !== "";
    }

    // Default: Step 1 (Data Diri) wajib kecuali foto
    const requiredStep1 = [
      "nama",
      "nik",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "agama",
      "umur",
      "alamat",
      "no_telp",
      "nama_wali",
      "no_telp_wali",
    ];
    return requiredStep1.every(
      (field) =>
        !form.internal.fields[field as keyof typeof form.internal.fields]
          ?.error &&
        form.internal.fields[field as keyof typeof form.internal.fields]
          ?.value !== "",
    );
  });

  // Final submit: create IBK dulu, lalu disabilitas
  const handleSubmitAll = $(async (values: IBKForm) => {
    error.value = null;
    success.value = null;
    Object.assign(formDataStore, values);
    try {
      const formData = new FormData();
      let tanggalLahirValue = formDataStore.tanggal_lahir;
      if (/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahirValue)) {
        tanggalLahirValue = new Date(tanggalLahirValue).toISOString();
      }
      formData.append("tanggal_lahir", tanggalLahirValue);
      const totalIqValue =
        formDataStore.total_iq !== undefined &&
        formDataStore.total_iq !== null &&
        formDataStore.total_iq !== ""
          ? String(formDataStore.total_iq)
          : "0";
      formData.append("total_iq", totalIqValue);
      formData.append("nama", formDataStore.nama);
      formData.append("nik", formDataStore.nik);
      formData.append("tempat_lahir", formDataStore.tempat_lahir);
      formData.append("file_foto", formDataStore.file ?? "");
      formData.append("jenis_kelamin", formDataStore.jenis_kelamin);
      formData.append("agama", formDataStore.agama);
      formData.append("umur", formDataStore.umur);
      formData.append("alamat", formDataStore.alamat);
      formData.append("no_telp", formDataStore.no_telp);
      formData.append("nama_wali", formDataStore.nama_wali);
      formData.append("no_telp_wali", formDataStore.no_telp_wali);
      formData.append("posyanduId", posyanduId);
      formData.append("pekerjaan", formDataStore.pekerjaan);
      formData.append("pendidikan", formDataStore.pendidikan);
      formData.append("status_perkawinan", formDataStore.status_perkawinan);
      formData.append("titik_koordinat", formDataStore.titik_koordinat);
      formData.append("keterangan_tambahan", formDataStore.keterangan_tambahan);
      formData.append("kategori_iq", formDataStore.kategori_iq);
      formData.append("tipe_kepribadian", formDataStore.tipe_kepribadian);
      formData.append(
        "deskripsi_kepribadian",
        formDataStore.deskripsi_kepribadian,
      );
      formData.append("potensi", formDataStore.potensi);
      formData.append("minat", formDataStore.minat);
      formData.append("bakat", formDataStore.bakat);
      formData.append("keterampilan", formDataStore.keterampilan);
      formData.append("catatan_psikolog", formDataStore.catatan_psikolog);
      formData.append(
        "rekomendasi_intervensi",
        formDataStore.rekomendasi_intervensi,
      );
      formData.append("odgj", formDataStore.odgj);
      formData.append("hasil_diagnosa", formDataStore.hasil_diagnosa);
      formData.append("jenis_bantuan", formDataStore.jenis_bantuan);
      formData.append("riwayat_terapi", formDataStore.riwayat_terapi);

      const res = await ibkService.createIbk(formData);
      const returnedId = (res?.data?.id ||
        res?.id ||
        res?.data?.ibk_id ||
        res?.ibk_id) as string | undefined;
      const ibkId = returnedId;
      if (!ibkId) {
        throw new Error("ID IBK tidak tersedia dari respons.");
      }
      createdIbkId.value = ibkId;

      const toIsoOrUndefined = (input?: string) => {
        if (!input) return undefined;
        const v = String(input).trim();
        try {
          // If value like YYYY-MM-DDTHH:mm, let Date parse and convert to ISO
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) {
            return new Date(v).toISOString();
          }
          // If value like YYYY-MM-DD, set start of day
          if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
            return new Date(`${v}T00:00:00`).toISOString();
          }
          // If already has seconds/offset, attempt direct parse
          return new Date(v).toISOString();
        } catch {
          return undefined;
        }
      };

      const payloads = selectedDisabilities.value.map((d) => ({
        ibk_id: ibkId,
        jenis_difabilitas_id: d.jenis_difabilitas_id,
        tingkat_keparahan: d.tingkat_keparahan,
        sejak_kapan: toIsoOrUndefined(d.sejak_kapan),
        keterangan: d.keterangan,
      }));
      if (payloads.length > 0) {
        await ibkService.createIbkDisabilities(payloads);
      }
      success.value = "Data IBK dan disabilitas berhasil disimpan.";
      nav(`/kader/posyandu/${posyanduId}/ibk`);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    }
  });

  return (
    <div class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Formulir Pendataan IBK</h1>
      {loading.value && <GenericLoadingSpinner />}
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
        <>
          {/* Progress & Stepper tetap */}
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-base-content">
                Langkah {currentStep.value + 1} dari {steps.length}
              </h2>
              <div class="text-sm text-base-content/70">
                {Math.round(((currentStep.value + 1) / steps.length) * 100)}%
                selesai
              </div>
            </div>
            <div class="w-full bg-base-200 rounded-full h-2 mb-6">
              <div
                class="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out"
                style={`width: ${((currentStep.value + 1) / steps.length) * 100}%`}
              ></div>
            </div>
          </div>
          <div class="mb-8">
            <div class="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  class={`flex flex-col items-center flex-1 relative`}
                >
                  <div
                    class={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      idx === currentStep.value
                        ? "border-primary bg-primary text-white scale-110 shadow-lg"
                        : idx < currentStep.value
                          ? "border-primary bg-primary text-white"
                          : "border-base-300 bg-base-100 text-base-content/50"
                    }`}
                  >
                    <span class="text-sm font-semibold">{idx + 1}</span>
                  </div>
                  <div class="mt-3 text-center max-w-20">
                    <p
                      class={`text-xs font-medium ${
                        idx === currentStep.value
                          ? "text-primary"
                          : "text-base-content/70"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="mb-8">
            <Form
              onSubmit$={(values) => {
                Object.assign(formDataStore, values);
                if (currentStep.value < steps.length - 1) {
                  currentStep.value++;
                } else {
                  handleSubmitAll(values);
                }
              }}
              class="space-y-6 w-full"
              encType="multipart/form-data"
            >
              {renderAllSteps()}
              <div class="flex items-center justify-between mt-8">
                <button
                  type="button"
                  class="btn btn-ghost gap-2"
                  onClick$={$(() => {
                    handlePrevious();
                  })}
                  disabled={currentStep.value === 0}
                >
                  Sebelumnya
                </button>
                {currentStep.value < steps.length - 1 ? (
                  <button
                    type="button"
                    class="btn btn-primary gap-2"
                    disabled={!(isCurrentStepValid as any)()}
                    onClick$={$(async () => {
                      if (await (isCurrentStepValid as any)())
                        currentStep.value++;
                    })}
                  >
                    Lanjutkan
                  </button>
                ) : (
                  <button
                    type="submit"
                    class="btn btn-primary gap-2"
                    disabled={form.submitting}
                  >
                    Simpan
                  </button>
                )}
              </div>
              {currentStep.value !== 4 && form.invalid && (
                <div class="alert alert-error mt-2">
                  Ada data yang belum valid/terisi. Silakan cek kembali!
                </div>
              )}
            </Form>
          </div>
        </>
      )}
      {!loading.value && !posyandu.value && !posyanduError.value && (
        <div class="alert alert-warning" role="alert">
          Data posyandu tidak ditemukan.
        </div>
      )}
    </div>
  );
});
