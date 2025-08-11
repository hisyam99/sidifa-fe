import { component$, QRL } from "@builder.io/qwik";
import {
  LuArrowLeft,
  LuPencil,
  LuMapPin,
  LuPhone,
  LuUser,
  LuCalendar,
  LuInfo,
  LuBrain,
  LuStethoscope,
  LuUsers,
  LuActivity,
  LuEye,
  LuHeart,
  LuShield,
} from "~/components/icons/lucide-optimized";

interface IBKDetailViewProps {
  data: any; // API shape varies across pages; keep flexible
  onBack$?: QRL<() => void>;
  onEdit$?: QRL<() => void>;
}

// Helper function to get disability color theme
const getDisabilityTheme = (jenisNama: string) => {
  switch (jenisNama?.toLowerCase()) {
    case "fisik":
      return {
        bgColor: "bg-orange-100/50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        icon: LuActivity,
        badgeColor: "badge-warning",
      };
    case "intelektual":
      return {
        bgColor: "bg-purple-100/50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: LuBrain,
        badgeColor: "badge-secondary",
      };
    case "mental (termasuk odgj)":
    case "mental":
      return {
        bgColor: "bg-pink-100/50",
        borderColor: "border-pink-200",
        textColor: "text-pink-800",
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        icon: LuHeart,
        badgeColor: "badge-accent",
      };
    case "sensorik penglihatan":
      return {
        bgColor: "bg-blue-100/50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: LuEye,
        badgeColor: "badge-info",
      };
    case "sensorik rungu":
      return {
        bgColor: "bg-green-100/50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        icon: LuShield,
        badgeColor: "badge-success",
      };
    default:
      return {
        bgColor: "bg-gray-100/50",
        borderColor: "border-gray-200",
        textColor: "text-gray-800",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        icon: LuInfo,
        badgeColor: "badge-neutral",
      };
  }
};

// Helper function to get severity color
const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "ringan":
      return "badge-success";
    case "sedang":
      return "badge-warning";
    case "berat":
    case "parah":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export const IBKDetailView = component$<IBKDetailViewProps>(
  ({ data, onBack$, onEdit$ }) => {
    const foto = data?.file_foto || data?.file || "";
    const nama = data?.nama ?? data?.personal_data?.nama_lengkap ?? "-";
    const nik = String(data?.nik ?? data?.personal_data?.nik ?? "-");
    const alamat = data?.alamat ?? data?.personal_data?.alamat_lengkap ?? "-";
    const noTelp = data?.no_telp ?? data?.personal_data?.no_telp ?? "-";
    const jenisKelamin =
      data?.jenis_kelamin ?? data?.personal_data?.gender ?? "-";
    const umur = data?.umur ?? "-";
    const agama = data?.agama ?? "-";
    const tempatLahir = data?.tempat_lahir ?? "-";
    const tanggalLahir = (data?.tanggal_lahir ?? "-").substring(0, 10);

    const kesehatan = data?.kesehatan_ibk;
    const detail = data?.detail_ibk;
    const assesmen = data?.assesmen_ibk;
    const disabilitasIbk = data?.disabilitasIbk || [];

    return (
      <div class="min-h-screen">
        <div class="container mx-auto">
          {/* Header with Back Button */}
          <div class="mb-4 sm:mb-8">
            <button
              class="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all duration-200"
              onClick$={onBack$}
              aria-label="Kembali"
            >
              <LuArrowLeft class="w-4 h-4" />
              <span class="text-sm">Kembali</span>
            </button>
          </div>

          {/* Main Content */}
          <div class="space-y-4 sm:space-y-6">
            {/* Hero Section */}
            <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 overflow-hidden">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5"></div>
                <div class="relative p-4 sm:p-6 lg:p-8">
                  <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center">
                    {/* Avatar */}
                    <div class="mx-auto lg:mx-0">
                      <div class="avatar">
                        <div class="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full ring-2 sm:ring-4 ring-primary/20 ring-offset-2 sm:ring-offset-4 ring-offset-base-100 shadow-lg">
                          {foto ? (
                            <img
                              src={foto}
                              alt={nama}
                              width={128}
                              height={128}
                              class="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div class="w-full h-full grid place-items-center bg-gradient-to-br from-base-300 to-base-200">
                              <LuUser class="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-base-content/40" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div class="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 min-w-0">
                      <div>
                        <h1 class="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-base-content leading-tight break-words">
                          {nama}
                        </h1>
                        <p class="text-sm sm:text-lg text-base-content/70 mt-1 sm:mt-2 font-medium break-all">
                          NIK: {nik}
                        </p>
                      </div>

                      <div class="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                        <div class="badge badge-primary badge-sm sm:badge-lg gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-3 shadow-sm text-xs sm:text-sm">
                          <LuUsers class="w-3 h-3 sm:w-4 sm:h-4" />
                          <span class="truncate">{jenisKelamin}</span>
                        </div>
                        <div class="badge badge-secondary badge-sm sm:badge-lg gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-3 shadow-sm text-xs sm:text-sm">
                          <LuCalendar class="w-3 h-3 sm:w-4 sm:h-4" />
                          <span class="truncate">{umur} tahun</span>
                        </div>
                        <div class="badge badge-accent badge-sm sm:badge-lg gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-3 shadow-sm text-xs sm:text-sm">
                          <LuInfo class="w-3 h-3 sm:w-4 sm:h-4" />
                          <span class="truncate">{agama}</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    {onEdit$ && (
                      <div class="mx-auto lg:mx-0">
                        <button
                          class="btn btn-primary btn-sm sm:btn-lg gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick$={onEdit$}
                          aria-label="Edit IBK"
                        >
                          <LuPencil class="w-4 h-4 sm:w-5 sm:h-5" />
                          <span class="hidden sm:inline">Edit Data</span>
                          <span class="sm:hidden">Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Data Section */}
              <div class="xl:col-span-2 space-y-4 sm:space-y-6">
                {/* Personal Data */}
                <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                  <div class="card-body p-4 sm:p-6 lg:p-8">
                    <h2 class="card-title text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <LuUser class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      Data Diri
                    </h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div class="space-y-3 sm:space-y-4">
                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-base-200/50 border-0 sm:border border-base-300/30">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                            Tempat Lahir
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content truncate">
                            {tempatLahir}
                          </div>
                        </div>

                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-base-200/50 border-0 sm:border border-base-300/30">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1 flex items-center gap-1 sm:gap-2">
                            <LuCalendar class="w-3 h-3 sm:w-4 sm:h-4" />
                            Tanggal Lahir
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content">
                            {tanggalLahir}
                          </div>
                        </div>
                      </div>

                      <div class="space-y-3 sm:space-y-4">
                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-base-200/50 border-0 sm:border border-base-300/30">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-2 flex items-center gap-1 sm:gap-2">
                            <LuMapPin class="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            Alamat Lengkap
                          </div>
                          <div class="font-medium text-sm sm:text-base text-base-content break-words leading-relaxed">
                            {alamat}
                          </div>
                        </div>

                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-base-200/50 border-0 sm:border border-base-300/30">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1 flex items-center gap-1 sm:gap-2">
                            <LuPhone class="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            No. Telepon
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content break-all">
                            {noTelp || "Belum tersedia"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Section */}
                {kesehatan && (
                  <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-4 sm:p-6 lg:p-8">
                      <h2 class="card-title text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <LuStethoscope class="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        </div>
                        Informasi Kesehatan
                      </h2>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-success/5 border-0 sm:border border-success/20">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                            Hasil Diagnosa
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                            {kesehatan?.hasil_diagnosa || "Belum tersedia"}
                          </div>
                        </div>

                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-success/5 border-0 sm:border border-success/20">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                            Status ODGJ
                          </div>
                          <div class="flex items-center gap-2">
                            <div
                              class={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${kesehatan?.odgj ? "bg-warning" : "bg-success"}`}
                            ></div>
                            <span class="font-semibold text-sm sm:text-base">
                              {kesehatan?.odgj ? "Ya" : "Tidak"}
                            </span>
                          </div>
                        </div>

                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-success/5 border-0 sm:border border-success/20">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                            Jenis Bantuan
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                            {kesehatan?.jenis_bantuan || "Belum tersedia"}
                          </div>
                        </div>

                        <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-success/5 border-0 sm:border border-success/20">
                          <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                            Riwayat Terapi
                          </div>
                          <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                            {kesehatan?.riwayat_terapi || "Belum tersedia"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assessment Section */}
                {assesmen && (
                  <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-4 sm:p-6 lg:p-8">
                      <h2 class="card-title text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <LuBrain class="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                        </div>
                        Asesmen Psikologi
                      </h2>

                      <div class="space-y-3 sm:space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Total IQ
                            </div>
                            <div class="text-xl sm:text-2xl font-bold text-secondary">
                              {assesmen?.total_iq || "-"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Kategori IQ
                            </div>
                            <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                              {assesmen?.kategori_iq || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Tipe Kepribadian
                            </div>
                            <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                              {assesmen?.tipe_kepribadian || "Belum tersedia"}
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Potensi
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content break-words">
                              {assesmen?.potensi || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Minat
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content break-words">
                              {assesmen?.minat || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Bakat
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content break-words">
                              {assesmen?.bakat || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1">
                              Keterampilan
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content break-words">
                              {assesmen?.keterampilan || "Belum tersedia"}
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-1 gap-3 sm:gap-4">
                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1 sm:mb-2">
                              Deskripsi Kepribadian
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content leading-relaxed break-words">
                              {assesmen?.deskripsi_kepribadian ||
                                "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1 sm:mb-2">
                              Catatan Psikolog
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content leading-relaxed break-words">
                              {assesmen?.catatan_psikolog || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/5 border-0 sm:border border-secondary/20">
                            <div class="text-xs sm:text-sm text-base-content/60 mb-1 sm:mb-2">
                              Rekomendasi Intervensi
                            </div>
                            <div class="font-medium text-sm sm:text-base text-base-content leading-relaxed break-words">
                              {assesmen?.rekomendasi_intervensi ||
                                "Belum tersedia"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disability Section */}
                {disabilitasIbk.length > 0 && (
                  <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-4 sm:p-6 lg:p-8">
                      <h2 class="card-title text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-error/10 flex items-center justify-center">
                          <LuShield class="w-4 h-4 sm:w-5 sm:h-5 text-error" />
                        </div>
                        Informasi Disabilitas
                      </h2>

                      <div class="space-y-3 sm:space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                        {disabilitasIbk.map(
                          (disabilitas: any, index: number) => {
                            const theme = getDisabilityTheme(
                              disabilitas.jenis_difasilitas?.nama,
                            );
                            const severityColor = getSeverityColor(
                              disabilitas.tingkat_keparahan,
                            );
                            const Icon = theme.icon;
                            const formatDate = (dateStr: string) => {
                              return new Date(dateStr).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              );
                            };

                            return (
                              <div
                                key={disabilitas.id || index}
                                class={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${theme.bgColor} ${theme.borderColor} border-0 sm:border transition-all duration-200 hover:shadow-md`}
                              >
                                <div class="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                  <div
                                    class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${theme.iconBg} shadow-sm`}
                                  >
                                    <Icon
                                      class={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${theme.iconColor}`}
                                    />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                      <h3
                                        class={`font-bold text-sm sm:text-base lg:text-lg ${theme.textColor} truncate`}
                                      >
                                        {disabilitas.jenis_difasilitas?.nama ||
                                          "Tidak diketahui"}
                                      </h3>
                                      {/* <div class={`badge ${theme.badgeColor} badge-xs sm:badge-sm text-xs hidden sm:inline-flex`}>
                                      {disabilitas.jenis_difasilitas?.nama}
                                    </div> */}
                                    </div>
                                    <div
                                      class={`badge ${severityColor} gap-1 badge-xs sm:badge-sm text-xs sm:text-sm`}
                                    >
                                      <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current opacity-60"></span>
                                      {disabilitas.tingkat_keparahan}
                                    </div>
                                  </div>
                                </div>

                                <div class="space-y-1.5 sm:space-y-2">
                                  <div class="text-xs sm:text-sm">
                                    <span class="text-base-content/60">
                                      Deskripsi:
                                    </span>
                                    <p class="font-medium text-base-content mt-0.5 sm:mt-1 break-words leading-relaxed">
                                      {disabilitas.jenis_difasilitas
                                        ?.deskripsi || "Tidak ada deskripsi"}
                                    </p>
                                  </div>

                                  <div class="text-xs sm:text-sm">
                                    <span class="text-base-content/60">
                                      Sejak:
                                    </span>
                                    <span class="font-medium text-base-content ml-1 break-words">
                                      {disabilitas.sejak_kapan
                                        ? formatDate(disabilitas.sejak_kapan)
                                        : "Tidak diketahui"}
                                    </span>
                                  </div>

                                  {disabilitas.keterangan && (
                                    <div class="text-xs sm:text-sm">
                                      <span class="text-base-content/60">
                                        Keterangan:
                                      </span>
                                      <p class="font-medium text-base-content mt-0.5 sm:mt-1 leading-relaxed break-words">
                                        {disabilitas.keterangan}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>

                      {disabilitasIbk.length === 0 && (
                        <div class="text-center py-6 sm:py-8 text-base-content/60">
                          <LuInfo class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                          <p class="text-sm sm:text-base">
                            Tidak ada informasi disabilitas yang tercatat
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div class="space-y-4 sm:space-y-6">
                {/* Guardian Contact */}
                <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                  <div class="card-body p-4 sm:p-6">
                    <h2 class="card-title text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                      <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <LuUsers class="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                      </div>
                      Kontak Wali
                    </h2>

                    <div class="space-y-3 sm:space-y-4">
                      <div class="p-2.5 sm:p-3 rounded-lg bg-accent/5 border-0 sm:border border-accent/20">
                        <div class="text-xs text-base-content/60 mb-1">
                          Nama Wali
                        </div>
                        <div class="font-semibold text-sm sm:text-base text-base-content break-words">
                          {data?.nama_wali || "Belum tersedia"}
                        </div>
                      </div>

                      <div class="p-2.5 sm:p-3 rounded-lg bg-accent/5 border-0 sm:border border-accent/20">
                        <div class="text-xs text-base-content/60 mb-1 flex items-center gap-1">
                          <LuPhone class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          No. Telepon Wali
                        </div>
                        <div class="font-semibold text-sm sm:text-base text-base-content break-all">
                          {data?.no_telp_wali || "Belum tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social & Education Details - Sticky */}
                {detail && (
                  <div class="sticky top-20 z-10">
                    <div class="card bg-base-100 shadow-md sm:shadow-lg border-0 sm:border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                      <div class="card-body p-4 sm:p-6">
                        <h2 class="card-title text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-info/10 flex items-center justify-center">
                            <LuInfo class="w-3 h-3 sm:w-4 sm:h-4 text-info" />
                          </div>
                          Detail Sosial
                        </h2>

                        <div class="space-y-2.5 sm:space-y-3">
                          <div class="p-2.5 sm:p-3 rounded-lg bg-info/5 border-0 sm:border border-info/20">
                            <div class="text-xs text-base-content/60 mb-1">
                              Pekerjaan
                            </div>
                            <div class="font-semibold text-base-content text-xs sm:text-sm break-words">
                              {detail?.pekerjaan || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-2.5 sm:p-3 rounded-lg bg-info/5 border-0 sm:border border-info/20">
                            <div class="text-xs text-base-content/60 mb-1">
                              Pendidikan
                            </div>
                            <div class="font-semibold text-base-content text-xs sm:text-sm break-words">
                              {detail?.pendidikan || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-2.5 sm:p-3 rounded-lg bg-info/5 border-0 sm:border border-info/20">
                            <div class="text-xs text-base-content/60 mb-1">
                              Status Perkawinan
                            </div>
                            <div class="font-semibold text-base-content text-xs sm:text-sm break-words">
                              {detail?.status_perkawinan || "Belum tersedia"}
                            </div>
                          </div>

                          <div class="p-2.5 sm:p-3 rounded-lg bg-info/5 border-0 sm:border border-info/20">
                            <div class="text-xs text-base-content/60 mb-1">
                              Koordinat
                            </div>
                            <div class="font-mono text-xs text-base-content break-all">
                              {detail?.titik_koordinat || "Belum tersedia"}
                            </div>
                          </div>

                          {detail?.keterangan_tambahan && (
                            <div class="p-2.5 sm:p-3 rounded-lg bg-info/5 border-0 sm:border border-info/20">
                              <div class="text-xs text-base-content/60 mb-1">
                                Keterangan Tambahan
                              </div>
                              <div class="text-xs sm:text-sm text-base-content leading-relaxed break-words">
                                {detail.keterangan_tambahan}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
