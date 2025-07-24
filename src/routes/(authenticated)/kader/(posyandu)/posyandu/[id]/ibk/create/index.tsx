import { component$, useSignal, $, useVisibleTask$ } from "@qwik.dev/core";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { useNavigate, useLocation } from "@qwik.dev/router";
import { ibkService, getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  object,
  string,
  minLength,
  maxLength,
  nonEmpty,
  custom,
  pipe,
  InferOutput,
} from "valibot";
import { IBKPersonalStep } from "~/components/ibk/IBKPersonalStep";
import { IBKPsikologiStep } from "~/components/ibk/IBKPsikologiStep";
import { IBKDisabilitasStep } from "~/components/ibk/IBKDisabilitasStep";
import { IBKKunjunganStep } from "~/components/ibk/IBKKunjunganStep";

const ibkSchema = object({
  // Step 1: Data Diri
  nama: pipe(string(), nonEmpty("Nama wajib diisi")),
  nik: pipe(
    string(),
    minLength(16, "NIK harus 16 digit"),
    maxLength(16, "NIK harus 16 digit"),
    custom((val: any) => /^\d{16}$/.test(val), "NIK harus 16 digit angka"),
  ),
  tempat_lahir: string(),
  tanggal_lahir: pipe(string(), nonEmpty("Tanggal lahir wajib diisi")),
  file: custom((val) => val instanceof File, "Foto wajib diupload"),
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
  // Step 3: Disabilitas
  odgj: pipe(string(), nonEmpty("ODGJ wajib diisi")),
  hasil_diagnosa: pipe(string(), nonEmpty("Hasil diagnosa wajib diisi")),
  jenis_bantuan: pipe(string(), nonEmpty("Jenis bantuan wajib diisi")),
  riwayat_terapi: pipe(string(), nonEmpty("Riwayat terapi wajib diisi")),
  potensi: string(),
  minat: string(),
  bakat: string(),
  keterampilan: string(),
  // Step 4: Kunjungan
  pekerjaan: pipe(string(), nonEmpty("Pekerjaan wajib diisi")),
  pendidikan: pipe(string(), nonEmpty("Pendidikan wajib diisi")),
  status_perkawinan: pipe(string(), nonEmpty("Status perkawinan wajib diisi")),
  titik_koordinat: pipe(string(), nonEmpty("Titik koordinat wajib diisi")),
  keterangan_tambahan: string(),
});

type IBKForm = InferOutput<typeof ibkSchema>;

import type { PosyanduDetail } from "~/types";

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const posyanduId = loc.params.id;
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const currentStep = useSignal(0);

  // Posyandu detail state
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
        file: undefined,
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

  // Refactor: steps array only static data
  const steps = [
    { id: "personal", title: "Data Diri IBK" },
    { id: "psikologi", title: "Asesmen Psikologi" },
    { id: "disabilitas", title: "Data Disabilitas" },
    { id: "kunjungan", title: "Kunjungan & Lainnya" },
  ];

  function renderStep(stepIdx: number) {
    const stepId = steps[stepIdx].id;
    switch (stepId) {
      case "personal":
        return <IBKPersonalStep form={form} />;
      case "psikologi":
        return <IBKPsikologiStep form={form} />;
      case "disabilitas":
        return <IBKDisabilitasStep form={form} />;
      case "kunjungan":
        return <IBKKunjunganStep form={form} />;
      default:
        return null;
    }
  }

  // Step fields for validation
  const stepFields = [
    [
      "nama",
      "nik",
      "tanggal_lahir",
      "file",
      "jenis_kelamin",
      "agama",
      "umur",
      "alamat",
      "no_telp",
      "nama_wali",
      "no_telp_wali",
    ],
    [],
    ["odgj", "hasil_diagnosa", "jenis_bantuan", "riwayat_terapi"],
    ["pekerjaan", "pendidikan", "status_perkawinan", "titik_koordinat"],
  ];

  // Helper to check if current step is valid
  // Helper to check if current step is valid (outside $)
  function isCurrentStepValid() {
    const fields = stepFields[currentStep.value];
    return fields.every(
      (field) =>
        !form.internal.fields[field as keyof typeof form.internal.fields]
          ?.error,
    );
  }

  const handleNext = $(() => {
    currentStep.value++;
  });

  const handlePrevious = $(() => {
    if (currentStep.value > 0) currentStep.value--;
  });

  const handleSubmit = $(async (values: IBKForm) => {
    error.value = null;
    success.value = null;

    try {
      const formData = new FormData();

      // Map form fields to API field names
      formData.append("nama", values.nama);
      formData.append("nik", values.nik);
      formData.append("tempat_lahir", values.tempat_lahir);
      formData.append("tanggal_lahir", values.tanggal_lahir);
      if (values.file instanceof File) {
        formData.append("file_foto", values.file);
      }
      formData.append("jenis_kelamin", values.jenis_kelamin);
      formData.append("agama", values.agama);
      formData.append("umur", values.umur);
      formData.append("alamat", values.alamat);
      formData.append("no_telp", values.no_telp);
      formData.append("nama_wali", values.nama_wali);
      formData.append("no_telp_wali", values.no_telp_wali);
      formData.append("posyanduId", posyanduId);

      // Step 2: Asesmen Psikologi
      formData.append("total_iq", values.total_iq);
      formData.append("kategori_iq", values.kategori_iq);
      formData.append("tipe_kepribadian", values.tipe_kepribadian);
      formData.append("deskripsi_kepribadian", values.deskripsi_kepribadian);
      formData.append("catatan_psikolog", values.catatan_psikolog);
      formData.append("rekomendasi_intervensi", values.rekomendasi_intervensi);

      // Step 3: Disabilitas
      formData.append("odgj", values.odgj);
      formData.append("hasil_diagnosa", values.hasil_diagnosa);
      formData.append("jenis_bantuan", values.jenis_bantuan);
      formData.append("riwayat_terapi", values.riwayat_terapi);
      formData.append("potensi", values.potensi);
      formData.append("minat", values.minat);
      formData.append("bakat", values.bakat);
      formData.append("keterampilan", values.keterampilan);

      // Step 4: Kunjungan
      formData.append("pekerjaan", values.pekerjaan);
      formData.append("pendidikan", values.pendidikan);
      formData.append("status_perkawinan", values.status_perkawinan);
      formData.append("titik_koordinat", values.titik_koordinat);
      formData.append("keterangan_tambahan", values.keterangan_tambahan);

      await ibkService.createIbk(formData);
      success.value = "Data IBK berhasil disimpan.";
      setTimeout(() => nav(`/kader/posyandu`), 1500);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    }
  });

  return (
    <div class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Formulir Pendataan IBK</h1>
      {/* Posyandu detail loading/error/info */}
      {loading.value && (
        <div class="alert alert-info mb-2">Memuat data posyandu...</div>
      )}
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
      {/* Only show form if posyandu loaded */}
      {posyandu.value && (
        <Form
          onSubmit$={handleSubmit}
          class="space-y-6 w-full"
          encType="multipart/form-data"
        >
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
          <div class="mb-8">{renderStep(currentStep.value)}</div>
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="btn btn-ghost gap-2"
              onClick$={handlePrevious}
              disabled={currentStep.value === 0}
            >
              Sebelumnya
            </button>
            {currentStep.value < steps.length - 1 ? (
              <button
                type="button"
                class="btn btn-primary gap-2"
                onClick$={handleNext}
                disabled={form.submitting || !isCurrentStepValid()}
              >
                Lanjutkan
              </button>
            ) : (
              <button
                type="submit"
                class="btn btn-primary gap-2"
                disabled={form.submitting || form.invalid}
              >
                {form.submitting ? (
                  <>
                    <div class="skeleton w-4 h-4"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan Data IBK</>
                )}
              </button>
            )}
          </div>
        </Form>
      )}
      {/* If not loading and not found */}
      {!loading.value && !posyandu.value && !posyanduError.value && (
        <div class="alert alert-warning" role="alert">
          Data posyandu tidak ditemukan.
        </div>
      )}
    </div>
  );
});
