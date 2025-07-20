// File: /sidifa-fev2/src/routes/posyandu/pendataan-ibk/index.tsx

import {
  component$,
  useSignal,
  useStore,
  $,
  useTask$,
  Component,
  SVGProps,
} from "@builder.io/qwik";
import { useAuth } from "~/hooks"; // Add this import
import type { DocumentHead } from "@builder.io/qwik-city";
import { FormWizard, type WizardStep, IBKCard } from "~/components/ui";
import type { IBKRecord, IBKRegistrationForm, DisabilityType } from "~/types";
import {
  LuSearch,
  LuPlus,
  LuUsers,
  LuBrain,
  LuHeart,
  LuEye,
  LuFilter,
  LuInfo,
  LuCheck,
  LuX,
  LuActivity,
  // Ensure all necessary icons are imported
} from "~/components/icons/lucide-optimized"; // Changed import source

// FIX: Create an ICON_MAP to dynamically select components by string name
const PENDATAAN_IBK_ICON_MAP: {
  [key: string]: Component<SVGProps<SVGSVGElement>>;
} = {
  LuActivity: LuActivity,
  LuBrain: LuBrain,
  LuHeart: LuHeart,
  LuEye: LuEye,
  LuUsers: LuUsers,
  LuFilter: LuFilter,
  LuInfo: LuInfo,
  LuCheck: LuCheck,
  LuX: LuX,
  LuSearch: LuSearch,
  LuPlus: LuPlus,
  // Add other icons used in this file's `disabilityTypes` if any are missing
};

export default component$(() => {
  const searchQuery = useSignal("");
  const showAddForm = useSignal(false);
  const currentStep = useSignal(0);
  const selectedIBK = useSignal<IBKRecord | null>(null);
  const showIBKDetail = useSignal(false);

  const { isLoggedIn } = useAuth(); // Get isLoggedIn

  // Mock data for existing IBK (no changes needed here)
  const existingIBK = useStore<IBKRecord[]>([
    {
      personal_data: {
        id: "ibk-1",
        nama_lengkap: "Ahmad Rizki Pratama",
        nik: "3374012345678901",
        tempat_lahir: "Semarang",
        tanggal_lahir: "2018-05-15",
        gender: "laki-laki",
        agama: "Islam",
        alamat_lengkap: "Jl. Bedali Raya No. 123",
        rt_rw: "003/002",
        kecamatan: "Bedali",
        kabupaten: "Semarang",
        provinsi: "Jawa Tengah",
        kode_pos: "50188",
        no_telp: "082334567890",
        nama_ayah: "Bambang Sutrisno",
        nama_ibu: "Sari Wulandari",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-10T15:30:00Z",
      },
      disability_info: {
        ibk_id: "ibk-1",
        jenis_disabilitas: ["intelektual"],
        deskripsi_kondisi: "Keterlambatan perkembangan kognitif ringan",
        tingkat_keparahan: "ringan",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-05T10:00:00Z",
      },
      visit_history: [
        {
          ibk_id: "ibk-1",
          kader_id: "kader-1",
          tanggal_kunjungan: "2024-01-08",
          keluhan_utama: "Perkembangan bicara masih terlambat",
          perkembangan_bahasa: "terlambat",
          intervensi_diberikan: ["stimulasi_bicara", "terapi_wicara"],
          catatan_kader: "Anak menunjukkan kemajuan dalam interaksi sosial",
          created_at: "2024-01-08T14:00:00Z",
          updated_at: "2024-01-08T14:00:00Z",
        },
      ],
      posyandu_id: "posyandu-bedali",
      status: "active",
      total_kunjungan: 3,
      last_visit: "2024-01-08",
      next_scheduled_visit: "2024-01-15",
    },
  ]);

  // Form data store (no changes needed here)
  const formData = useStore<IBKRegistrationForm>({
    step1: {
      nama_lengkap: "",
      nik: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      gender: "laki-laki",
      agama: "",
      alamat_lengkap: "",
      rt_rw: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      kode_pos: "",
      no_telp: "",
      nama_ayah: "",
      nama_ibu: "",
      pekerjaan_ayah: "",
      pekerjaan_ibu: "",
      pendidikan_terakhir: "",
    },
    step2: {
      psikolog_id: "",
      tanggal_asesmen: "",
      iq_score: 0,
      iq_kategori: "rata_rata",
      kepribadian_tipe: "",
      kepribadian_deskripsi: "",
      minat_utama: [],
      potensi_akademik: [],
      potensi_non_akademik: [],
      rekomendasi_intervensi: "",
      rekomendasi_terapi: "",
      rekomendasi_pendidikan: "",
      catatan_psikolog: "",
      status: "draft",
    },
    step3: {
      jenis_disabilitas: [],
      deskripsi_kondisi: "",
      tingkat_keparahan: "ringan",
      sejak_kapan: "",
      penyebab: "",
      kemampuan_mobilitas: "mandiri",
      kemampuan_komunikasi: "normal",
      kemampuan_kognitif: "normal",
      kemampuan_sosial: "baik",
      kebutuhan_alat_bantu: [],
      kebutuhan_terapi: [],
    },
    step4: {
      kader_id: "",
      tanggal_kunjungan: new Date().toISOString().split("T")[0],
      keluhan_utama: "",
      keluhan_tambahan: [],
      perkembangan_motorik_kasar: "sesuai",
      perkembangan_motorik_halus: "sesuai",
      perkembangan_bahasa: "sesuai",
      perkembangan_sosial: "sesuai",
      perkembangan_kognitif: "sesuai",
      intervensi_diberikan: [],
      aktivitas_stimulasi: [],
      respon_anak: "",
      rujukan_ke: "",
      alasan_rujukan: "",
      status_rujukan: "pending",
      catatan_kader: "",
      rencana_follow_up: "",
      tanggal_kunjungan_berikutnya: "",
    },
    uploaded_documents: [],
  });

  // Wizard steps definition (no changes needed here, as it's already a useStore)
  const wizardSteps = useStore<WizardStep[]>([
    {
      id: "personal-data",
      title: "Data Diri IBK",
      description: "Informasi dasar anak berkebutuhan khusus",
      isRequired: true,
      isValid: false,
    },
    {
      id: "psychological-assessment",
      title: "Hasil Asesmen Psikologi",
      description: "Berdasarkan laporan dari psikolog",
      isRequired: false,
      isValid: true,
    },
    {
      id: "disability-selection",
      title: "Jenis Disabilitas",
      description: "Pilih jenis dan tingkat disabilitas",
      isRequired: true,
      isValid: false,
    },
    {
      id: "visit-history",
      title: "Riwayat Kunjungan",
      description: "Dokumentasi kunjungan pertama",
      isRequired: true,
      isValid: false,
    },
  ]);

  // FIX: Modify disabilityTypes to store icon string names instead of component functions
  const disabilityTypes = [
    {
      type: "fisik" as DisabilityType,
      title: "Disabilitas Fisik",
      description: "Gangguan fungsi gerak dan mobilitas tubuh",
      iconName: "LuActivity", // Changed to iconName (string)
      color: "border-primary bg-primary/5",
      examples: ["Lumpuh kaki", "Cacat tangan", "Kelainan tulang belakang"],
    },
    {
      type: "intelektual" as DisabilityType,
      title: "Disabilitas Intelektual",
      description: "Keterbatasan fungsi kognitif dan adaptif",
      iconName: "LuBrain", // Changed to iconName (string)
      color: "border-secondary bg-secondary/5",
      examples: ["Down Syndrome", "Autisme", "Keterlambatan perkembangan"],
    },
    {
      type: "mental" as DisabilityType,
      title: "Disabilitas Mental",
      description: "Gangguan fungsi psikis dan emosional",
      iconName: "LuHeart", // Changed to iconName (string)
      color: "border-accent bg-accent/5",
      examples: ["Bipolar", "Depresi", "Gangguan kecemasan"],
    },
    {
      type: "sensorik" as DisabilityType,
      title: "Disabilitas Sensorik",
      description: "Gangguan pendengaran, penglihatan, atau komunikasi",
      iconName: "LuEye", // Changed to iconName (string)
      color: "border-warning bg-warning/5",
      examples: ["Tuna netra", "Tuna rungu", "Gangguan bicara"],
    },
  ];

  // Initial data loading or side effects for pendataan-ibk
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    if (isLoggedIn.value) {
      // This is where you would call your data fetching function, e.g., fetchDataForIBK();
      console.log("Fetching IBK data now that user is logged in.");
      // For now, it's a console log as there's no explicit fetch call in the mock data section.
      // If you have a function like `fetchIBKData()` uncomment and call it here.
      // fetchDataForIBK();
    } else {
      console.log("Not logged in, not fetching IBK data.");
      // Clear any data if not logged in, or show appropriate message
      existingIBK.splice(0, existingIBK.length);
    }
  });

  // Form validation (no changes needed here)
  const validateCurrentStep = $(() => {
    const currentStepData = wizardSteps[currentStep.value];

    switch (currentStepData.id) {
      case "personal-data":
        return !!(
          formData.step1.nama_lengkap &&
          formData.step1.nik &&
          formData.step1.tanggal_lahir
        );
      case "psychological-assessment":
        return true; // Optional step
      case "disability-selection":
        return formData.step3.jenis_disabilitas.length > 0;
      case "visit-history":
        return !!(
          formData.step4.tanggal_kunjungan && formData.step4.keluhan_utama
        );
      default:
        return false;
    }
  });

  // Update step validation (no changes needed here)
  useTask$(async ({ track }) => {
    track(() => currentStep.value);
    track(() => formData.step1.nama_lengkap);
    track(() => formData.step1.nik);
    track(() => formData.step3.jenis_disabilitas);
    track(() => formData.step4.keluhan_utama);

    const isValid = await validateCurrentStep();
    wizardSteps[currentStep.value].isValid = isValid;
  });

  // Wizard navigation (no changes needed here)
  const handleNext = $(() => {
    if (currentStep.value < wizardSteps.length - 1) {
      currentStep.value++;
    }
  });

  const handlePrevious = $(() => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  });

  const handleStepChange = $((stepIndex: number) => {
    currentStep.value = stepIndex;
  });

  const handleSubmit = $(async () => {
    console.log("Submitting IBK data:", formData);
    // API call would go here
    alert("Data IBK berhasil disimpan!");
    showAddForm.value = false;
    currentStep.value = 0;
    // Reset form
  });

  // IBK actions (no changes needed here)
  const handleViewIBK = $((id: string) => {
    const ibk = existingIBK.find((i) => i.personal_data.id === id);
    if (ibk) {
      selectedIBK.value = ibk;
      showIBKDetail.value = true;
    }
  });

  const handleEditIBK = $((id: string) => {
    console.log("Edit IBK:", id);
    // Load IBK data into form and show edit mode
  });

  const handleAddNew = $(() => {
    showAddForm.value = true;
    currentStep.value = 0;
  });

  const toggleDisabilityType = $((type: DisabilityType) => {
    const index = formData.step3.jenis_disabilitas.indexOf(type);
    if (index > -1) {
      formData.step3.jenis_disabilitas.splice(index, 1);
    } else {
      formData.step3.jenis_disabilitas.push(type);
    }
  });

  return (
    <main class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto px-4 py-8">
        {/* Page Header (no changes needed here) */}
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-2">
              Pusat Pendataan dan Monitoring IBK
            </h1>
            <p class="text-base-content/70 text-lg">
              Kelola data individu berkebutuhan khusus dengan sistem
              terintegrasi
            </p>
          </div>

          <button
            class="btn btn-primary gap-2 shadow-lg"
            onClick$={handleAddNew}
          >
            <LuPlus class="w-5 h-5" />
            Tambah Data IBK
          </button>
        </div>

        {!showAddForm.value ? (
          <>
            {/* Search and Filter Section (no changes needed here) */}
            <div class="card bg-base-100 shadow-lg border border-base-200/50 mb-8">
              <div class="card-body">
                <h2 class="card-title text-xl mb-4">Cari Data IBK</h2>

                <div class="flex flex-col md:flex-row gap-4 mb-6">
                  <div class="flex-1 relative">
                    <LuSearch class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    <input
                      type="text"
                      class="input input-bordered w-full pl-12"
                      placeholder="Cari berdasarkan nama atau NIK..."
                      value={searchQuery.value}
                      onInput$={(e) => {
                        searchQuery.value = (
                          e.target as HTMLInputElement
                        ).value;
                      }}
                    />
                  </div>

                  <button class="btn btn-ghost gap-2">
                    <LuFilter class="w-5 h-5" />
                    Filter
                  </button>
                </div>

                {/* Quick Stats (no changes needed here) */}
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="stat bg-primary/10 rounded-lg">
                    <div class="stat-value text-primary text-2xl">
                      {existingIBK.length}
                    </div>
                    <div class="stat-title">Total IBK</div>
                  </div>
                  <div class="stat bg-success/10 rounded-lg">
                    <div class="stat-value text-success text-2xl">
                      {
                        existingIBK.filter((ibk) => ibk.status === "active")
                          .length
                      }
                    </div>
                    <div class="stat-title">Aktif</div>
                  </div>
                  <div class="stat bg-warning/10 rounded-lg">
                    <div class="stat-value text-warning text-2xl">
                      {
                        existingIBK.filter(
                          (ibk) => ibk.visit_history.length === 0,
                        ).length
                      }
                    </div>
                    <div class="stat-title">Butuh Kunjungan</div>
                  </div>
                  <div class="stat bg-info/10 rounded-lg">
                    <div class="stat-value text-info text-2xl">
                      {
                        existingIBK.filter((ibk) => ibk.next_scheduled_visit)
                          .length
                      }
                    </div>
                    <div class="stat-title">Jadwal Berikutnya</div>
                  </div>
                </div>
              </div>
            </div>

            {/* IBK List (no changes needed here) */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingIBK.map((ibk) => (
                <IBKCard
                  key={ibk.personal_data.id}
                  ibk={ibk}
                  onView$={handleViewIBK}
                  onEdit$={handleEditIBK}
                />
              ))}
            </div>

            {existingIBK.length === 0 && (
              <div class="text-center py-16">
                <LuUsers class="w-24 h-24 text-base-content/30 mx-auto mb-6" />
                <h3 class="text-2xl font-bold text-base-content/70 mb-4">
                  Belum ada data IBK
                </h3>
                <p class="text-base-content/60 mb-8 max-w-md mx-auto">
                  Mulai dengan menambahkan data IBK pertama di wilayah Anda
                </p>
                <button
                  class="btn btn-primary btn-lg gap-3"
                  onClick$={handleAddNew}
                >
                  <LuPlus class="w-6 h-6" />
                  Tambah Data IBK Pertama
                </button>
              </div>
            )}
          </>
        ) : (
          /* Multi-Step Form (no changes needed here, only the wizardSteps definition changed) */
          <div class="max-w-4xl mx-auto">
            <FormWizard
              steps={wizardSteps}
              currentStep={currentStep.value}
              onStepChange$={handleStepChange}
              onNext$={handleNext}
              onPrevious$={handlePrevious}
              onSubmit$={handleSubmit}
              nextLabel="Lanjutkan"
              previousLabel="Sebelumnya"
              submitLabel="Simpan Data IBK"
            >
              {/* Step 1: Personal Data */}
              {currentStep.value === 0 && (
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Nama Lengkap *
                        </span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Masukkan nama lengkap"
                        value={formData.step1.nama_lengkap}
                        onInput$={(e) => {
                          formData.step1.nama_lengkap = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">NIK *</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nomor Induk Kependudukan"
                        value={formData.step1.nik}
                        onInput$={(e) => {
                          formData.step1.nik = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tempat Lahir
                        </span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Kota tempat lahir"
                        value={formData.step1.tempat_lahir}
                        onInput$={(e) => {
                          formData.step1.tempat_lahir = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tanggal Lahir *
                        </span>
                      </label>
                      <input
                        type="date"
                        class="input input-bordered"
                        value={formData.step1.tanggal_lahir}
                        onInput$={(e) => {
                          formData.step1.tanggal_lahir = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Jenis Kelamin
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step1.gender}
                        onChange$={(e) => {
                          formData.step1.gender = (
                            e.target as HTMLSelectElement
                          ).value as any;
                        }}
                      >
                        <option value="laki-laki">Laki-laki</option>
                        <option value="perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Agama</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Agama yang dianut"
                        value={formData.step1.agama}
                        onInput$={(e) => {
                          formData.step1.agama = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>
                  </div>

                  <div class="divider">Alamat Lengkap</div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control md:col-span-2">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Alamat Lengkap
                        </span>
                      </label>
                      <textarea
                        class="textarea textarea-bordered"
                        placeholder="Alamat lengkap sesuai KTP"
                        value={formData.step1.alamat_lengkap}
                        onInput$={(e) => {
                          formData.step1.alamat_lengkap = (
                            e.target as HTMLTextAreaElement
                          ).value;
                        }}
                      ></textarea>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">RT/RW</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="000/000"
                        value={formData.step1.rt_rw}
                        onInput$={(e) => {
                          formData.step1.rt_rw = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Kecamatan</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nama kecamatan"
                        value={formData.step1.kecamatan}
                        onInput$={(e) => {
                          formData.step1.kecamatan = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Kabupaten</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nama kabupaten"
                        value={formData.step1.kabupaten}
                        onInput$={(e) => {
                          formData.step1.kabupaten = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Provinsi</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nama provinsi"
                        value={formData.step1.provinsi}
                        onInput$={(e) => {
                          formData.step1.provinsi = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>
                  </div>

                  <div class="divider">Informasi Keluarga</div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Nama Ayah</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nama lengkap ayah"
                        value={formData.step1.nama_ayah}
                        onInput$={(e) => {
                          formData.step1.nama_ayah = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Nama Ibu</span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Nama lengkap ibu"
                        value={formData.step1.nama_ibu}
                        onInput$={(e) => {
                          formData.step1.nama_ibu = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Nomor Telepon
                        </span>
                      </label>
                      <input
                        type="tel"
                        class="input input-bordered"
                        placeholder="08xxxxxxxxxx"
                        value={formData.step1.no_telp}
                        onInput$={(e) => {
                          formData.step1.no_telp = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Psychological Assessment */}
              {currentStep.value === 1 && (
                <div class="space-y-6">
                  <div class="alert alert-info">
                    <LuInfo class="w-5 h-5" />
                    <span>
                      Bagian ini diisi berdasarkan laporan asesmen dari
                      psikolog. Jika belum ada asesmen, Anda dapat melewati
                      langkah ini.
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tanggal Asesmen
                        </span>
                      </label>
                      <input
                        type="date"
                        class="input input-bordered"
                        value={formData.step2?.tanggal_asesmen}
                        onInput$={(e) => {
                          if (formData.step2) {
                            formData.step2.tanggal_asesmen = (
                              e.target as HTMLInputElement
                            ).value;
                          }
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">Skor IQ</span>
                      </label>
                      <input
                        type="number"
                        class="input input-bordered"
                        placeholder="Skor IQ hasil tes"
                        value={formData.step2?.iq_score}
                        onInput$={(e) => {
                          if (formData.step2) {
                            formData.step2.iq_score =
                              parseInt((e.target as HTMLInputElement).value) ||
                              0;
                          }
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Kategori IQ
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step2?.iq_kategori}
                        onChange$={(e) => {
                          if (formData.step2) {
                            formData.step2.iq_kategori = (
                              e.target as HTMLSelectElement
                            ).value as any;
                          }
                        }}
                      >
                        <option value="sangat_rendah">
                          Sangat Rendah (&lt;70)
                        </option>
                        <option value="rendah">Rendah (70-79)</option>
                        <option value="rata_rata_bawah">
                          Rata-rata Bawah (80-89)
                        </option>
                        <option value="rata_rata">Rata-rata (90-109)</option>
                        <option value="rata_rata_atas">
                          Rata-rata Atas (110-119)
                        </option>
                        <option value="tinggi">Tinggi (120-129)</option>
                        <option value="sangat_tinggi">
                          Sangat Tinggi (&gt;130)
                        </option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tipe Kepribadian
                        </span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered"
                        placeholder="Hasil tes kepribadian"
                        value={formData.step2?.kepribadian_tipe}
                        onInput$={(e) => {
                          if (formData.step2) {
                            formData.step2.kepribadian_tipe = (
                              e.target as HTMLInputElement
                            ).value;
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Deskripsi Kepribadian
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Deskripsi hasil asesmen kepribadian"
                      value={formData.step2?.kepribadian_deskripsi}
                      onInput$={(e) => {
                        if (formData.step2) {
                          formData.step2.kepribadian_deskripsi = (
                            e.target as HTMLTextAreaElement
                          ).value;
                        }
                      }}
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Rekomendasi Intervensi
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Rekomendasi intervensi dari psikolog"
                      value={formData.step2?.rekomendasi_intervensi}
                      onInput$={(e) => {
                        if (formData.step2) {
                          formData.step2.rekomendasi_intervensi = (
                            e.target as HTMLTextAreaElement
                          ).value;
                        }
                      }}
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Catatan Psikolog
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Catatan tambahan dari psikolog"
                      value={formData.step2?.catatan_psikolog}
                      onInput$={(e) => {
                        if (formData.step2) {
                          formData.step2.catatan_psikolog = (
                            e.target as HTMLTextAreaElement
                          ).value;
                        }
                      }}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 3: Disability Selection */}
              {currentStep.value === 2 && (
                <div class="space-y-6">
                  <div class="text-center mb-8">
                    <h3 class="text-xl font-bold mb-2">
                      Pilih Jenis Disabilitas
                    </h3>
                    <p class="text-base-content/70">
                      Pilih satu atau lebih jenis disabilitas yang sesuai
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {disabilityTypes.map((disability) => {
                      // FIX: Get the component from the map using the iconName
                      const Icon =
                        PENDATAAN_IBK_ICON_MAP[
                          disability.iconName as keyof typeof PENDATAAN_IBK_ICON_MAP
                        ];
                      return (
                        <div
                          key={disability.type}
                          class={`card cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            formData.step3.jenis_disabilitas.includes(
                              disability.type,
                            )
                              ? disability.color +
                                " ring-2 ring-offset-2 ring-current"
                              : "border-base-300 bg-base-100"
                          }`}
                          onClick$={() => toggleDisabilityType(disability.type)}
                        >
                          <div class="card-body p-6">
                            <div class="flex items-center gap-4 mb-4">
                              <div
                                class={`w-12 h-12 rounded-lg ${disability.color} flex items-center justify-center`}
                              >
                                <Icon class="w-6 h-6 text-current" />
                              </div>
                              <div class="flex-1">
                                <h4 class="font-bold text-lg">
                                  {disability.title}
                                </h4>
                                <p class="text-sm text-base-content/70">
                                  {disability.description}
                                </p>
                              </div>
                              {formData.step3.jenis_disabilitas.includes(
                                disability.type,
                              ) && <LuCheck class="w-6 h-6 text-success" />}
                            </div>

                            <div class="space-y-2">
                              <p class="text-sm font-medium text-base-content/80">
                                Contoh kondisi:
                              </p>
                              <div class="flex flex-wrap gap-1">
                                {disability.examples.map((example, index) => (
                                  <div
                                    key={index}
                                    class="badge badge-outline badge-sm"
                                  >
                                    {example}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {formData.step3.jenis_disabilitas.length > 0 && (
                    <div class="space-y-4">
                      <div class="divider">Detail Kondisi</div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text font-semibold">
                              Tingkat Keparahan
                            </span>
                          </label>
                          <select
                            class="select select-bordered"
                            value={formData.step3.tingkat_keparahan}
                            onChange$={(e) => {
                              formData.step3.tingkat_keparahan = (
                                e.target as HTMLSelectElement
                              ).value as any;
                            }}
                          >
                            <option value="ringan">Ringan</option>
                            <option value="sedang">Sedang</option>
                            <option value="berat">Berat</option>
                          </select>
                        </div>

                        <div class="form-control">
                          <label class="label">
                            <span class="label-text font-semibold">
                              Sejak Kapan
                            </span>
                          </label>
                          <input
                            type="text"
                            class="input input-bordered"
                            placeholder="Sejak usia berapa atau kapan"
                            value={formData.step3.sejak_kapan}
                            onInput$={(e) => {
                              formData.step3.sejak_kapan = (
                                e.target as HTMLInputElement
                              ).value;
                            }}
                          />
                        </div>
                      </div>

                      <div class="form-control">
                        <label class="label">
                          <span class="label-text font-semibold">
                            Deskripsi Kondisi
                          </span>
                        </label>
                        <textarea
                          class="textarea textarea-bordered"
                          placeholder="Jelaskan kondisi disabilitas secara detail"
                          value={formData.step3.deskripsi_kondisi}
                          onInput$={(e) => {
                            formData.step3.deskripsi_kondisi = (
                              e.target as HTMLTextAreaElement
                            ).value;
                          }}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Visit History */}
              {currentStep.value === 3 && (
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tanggal Kunjungan *
                        </span>
                      </label>
                      <input
                        type="date"
                        class="input input-bordered"
                        value={formData.step4.tanggal_kunjungan}
                        onInput$={(e) => {
                          formData.step4.tanggal_kunjungan = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Tanggal Kunjungan Berikutnya
                        </span>
                      </label>
                      <input
                        type="date"
                        class="input input-bordered"
                        value={formData.step4.tanggal_kunjungan_berikutnya}
                        onInput$={(e) => {
                          formData.step4.tanggal_kunjungan_berikutnya = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Keluhan Utama *
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Keluhan atau masalah utama yang dihadapi"
                      value={formData.step4.keluhan_utama}
                      onInput$={(e) => {
                        formData.step4.keluhan_utama = (
                          e.target as HTMLTextAreaElement
                        ).value;
                      }}
                    ></textarea>
                  </div>

                  <div class="divider">Checklist Perkembangan</div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Perkembangan Motorik Kasar
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step4.perkembangan_motorik_kasar}
                        onChange$={(e) => {
                          formData.step4.perkembangan_motorik_kasar = (
                            e.target as HTMLSelectElement
                          ).value as any;
                        }}
                      >
                        <option value="sesuai">Sesuai Usia</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="tidak_sesuai">Tidak Sesuai</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Perkembangan Motorik Halus
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step4.perkembangan_motorik_halus}
                        onChange$={(e) => {
                          formData.step4.perkembangan_motorik_halus = (
                            e.target as HTMLSelectElement
                          ).value as any;
                        }}
                      >
                        <option value="sesuai">Sesuai Usia</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="tidak_sesuai">Tidak Sesuai</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Perkembangan Bahasa
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step4.perkembangan_bahasa}
                        onChange$={(e) => {
                          formData.step4.perkembangan_bahasa = (
                            e.target as HTMLSelectElement
                          ).value as any;
                        }}
                      >
                        <option value="sesuai">Sesuai Usia</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="tidak_sesuai">Tidak Sesuai</option>
                      </select>
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">
                          Perkembangan Sosial
                        </span>
                      </label>
                      <select
                        class="select select-bordered"
                        value={formData.step4.perkembangan_sosial}
                        onChange$={(e) => {
                          formData.step4.perkembangan_sosial = (
                            e.target as HTMLSelectElement
                          ).value as any;
                        }}
                      >
                        <option value="sesuai">Sesuai Usia</option>
                        <option value="terlambat">Terlambat</option>
                        <option value="tidak_sesuai">Tidak Sesuai</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">Respon Anak</span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Bagaimana respon anak selama pemeriksaan"
                      value={formData.step4.respon_anak}
                      onInput$={(e) => {
                        formData.step4.respon_anak = (
                          e.target as HTMLTextAreaElement
                        ).value;
                      }}
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Catatan Kader
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Catatan tambahan dari kader"
                      value={formData.step4.catatan_kader}
                      onInput$={(e) => {
                        formData.step4.catatan_kader = (
                          e.target as HTMLTextAreaElement
                        ).value;
                      }}
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-semibold">
                        Rencana Follow-up
                      </span>
                    </label>
                    <textarea
                      class="textarea textarea-bordered"
                      placeholder="Rencana tindak lanjut untuk kunjungan berikutnya"
                      value={formData.step4.rencana_follow_up}
                      onInput$={(e) => {
                        formData.step4.rencana_follow_up = (
                          e.target as HTMLTextAreaElement
                        ).value;
                      }}
                    ></textarea>
                  </div>
                </div>
              )}
            </FormWizard>

            {/* Back to List Button */}
            <div class="text-center mt-8">
              <button
                class="btn btn-ghost gap-2"
                onClick$={() => (showAddForm.value = false)}
              >
                <LuX class="w-5 h-5" />
                Batal dan Kembali ke Daftar
              </button>
            </div>
          </div>
        )}

        {/* IBK Detail Modal */}
        {showIBKDetail.value && selectedIBK.value && (
          <div class="modal modal-open">
            <div class="modal-box max-w-4xl">
              <h3 class="font-bold text-lg mb-4">Detail Data IBK</h3>

              <div class="space-y-6">
                <div class="card bg-base-200/50">
                  <div class="card-body">
                    <h4 class="card-title">Data Diri</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Nama:</strong>{" "}
                        {selectedIBK.value.personal_data.nama_lengkap}
                      </div>
                      <div>
                        <strong>NIK:</strong>{" "}
                        {selectedIBK.value.personal_data.nik}
                      </div>
                      <div>
                        <strong>Tempat Lahir:</strong>{" "}
                        {selectedIBK.value.personal_data.tempat_lahir}
                      </div>
                      <div>
                        <strong>Tanggal Lahir:</strong>{" "}
                        {selectedIBK.value.personal_data.tanggal_lahir}
                      </div>
                      <div>
                        <strong>Alamat:</strong>{" "}
                        {selectedIBK.value.personal_data.alamat_lengkap}
                      </div>
                      <div>
                        <strong>Kecamatan:</strong>{" "}
                        {selectedIBK.value.personal_data.kecamatan}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedIBK.value.disability_info && (
                  <div class="card bg-base-200/50">
                    <div class="card-body">
                      <h4 class="card-title">Informasi Disabilitas</h4>
                      <div class="space-y-2">
                        <div>
                          <strong>Jenis:</strong>{" "}
                          {selectedIBK.value.disability_info.jenis_disabilitas.join(
                            ", ",
                          )}
                        </div>
                        <div>
                          <strong>Deskripsi:</strong>{" "}
                          {selectedIBK.value.disability_info.deskripsi_kondisi}
                        </div>
                        <div>
                          <strong>Tingkat:</strong>{" "}
                          {selectedIBK.value.disability_info.tingkat_keparahan}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div class="card bg-base-200/50">
                  <div class="card-body">
                    <h4 class="card-title">
                      Riwayat Kunjungan (
                      {selectedIBK.value.visit_history.length})
                    </h4>
                    {selectedIBK.value.visit_history.length > 0 ? (
                      <div class="space-y-2">
                        {selectedIBK.value.visit_history.map((visit, index) => (
                          <div
                            key={index}
                            class="border border-base-300 rounded p-3"
                          >
                            <div class="text-sm">
                              <strong>Tanggal:</strong>{" "}
                              {visit.tanggal_kunjungan}
                              <br />
                              <strong>Keluhan:</strong> {visit.keluhan_utama}
                              <br />
                              <strong>Catatan:</strong> {visit.catatan_kader}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p class="text-base-content/60">
                        Belum ada riwayat kunjungan
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div class="modal-action">
                <button
                  class="btn btn-ghost"
                  onClick$={() => (showIBKDetail.value = false)}
                >
                  Tutup
                </button>
                <button
                  class="btn btn-primary"
                  onClick$={$(() => {
                    showIBKDetail.value = false;
                    handleEditIBK(selectedIBK.value!.personal_data.id!);
                  })}
                >
                  Edit Data
                </button>
              </div>
            </div>
            <div
              class="modal-backdrop"
              onClick$={() => (showIBKDetail.value = false)}
            ></div>
          </div>
        )}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Pendataan IBK | SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Pusat pendataan dan monitoring individu berkebutuhan khusus dengan sistem multi-step form yang terintegrasi.",
    },
    {
      property: "og:title",
      content: "Pendataan IBK | SIDIFA",
    },
    {
      property: "og:description",
      content:
        "Kelola data IBK dengan mudah menggunakan sistem pendataan yang komprehensif.",
    },
  ],
};
