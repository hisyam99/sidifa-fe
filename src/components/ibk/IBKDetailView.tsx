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
} from "~/components/icons/lucide-optimized";

interface IBKDetailViewProps {
  data: any; // API shape varies across pages; keep flexible
  onBack$?: QRL<() => void>;
  onEdit$?: QRL<() => void>;
}

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

    return (
      <div class="min-h-screen bg-base-200/30">
        <div class="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header with Back Button */}
          <div class="mb-8">
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
          <div class="space-y-6">
            {/* Hero Section */}
            <div class="card bg-base-100 shadow-lg border border-base-300/50 overflow-hidden">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5"></div>
                <div class="relative p-6 sm:p-8">
                  <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                    {/* Avatar */}
                    <div class="mx-auto lg:mx-0">
                      <div class="avatar">
                        <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-base-100 shadow-lg">
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
                              <LuUser class="w-12 h-12 sm:w-14 sm:h-14 text-base-content/40" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div class="flex-1 text-center lg:text-left space-y-4">
                      <div>
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content leading-tight">
                          {nama}
                        </h1>
                        <p class="text-lg text-base-content/70 mt-2 font-medium">
                          NIK: {nik}
                        </p>
                      </div>
                      
                      <div class="flex flex-wrap justify-center lg:justify-start gap-3">
                        <div class="badge badge-primary badge-lg gap-2 px-4 py-3 shadow-sm">
                          <LuUsers class="w-4 h-4" />
                          {jenisKelamin}
                        </div>
                        <div class="badge badge-secondary badge-lg gap-2 px-4 py-3 shadow-sm">
                          <LuCalendar class="w-4 h-4" />
                          {umur} tahun
                        </div>
                        <div class="badge badge-accent badge-lg gap-2 px-4 py-3 shadow-sm">
                          <LuInfo class="w-4 h-4" />
                          {agama}
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    {onEdit$ && (
                      <div class="mx-auto lg:mx-0">
                        <button
                          class="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick$={onEdit$}
                          aria-label="Edit IBK"
                        >
                          <LuPencil class="w-5 h-5" />
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
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Data Section */}
              <div class="xl:col-span-2 space-y-6">
                {/* Personal Data */}
                <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                  <div class="card-body p-6 sm:p-8">
                    <h2 class="card-title text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <LuUser class="w-5 h-5 text-primary" />
                      </div>
                      Data Diri
                    </h2>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div class="space-y-4">
                        <div class="p-4 rounded-xl bg-base-200/50 border border-base-300/30">
                          <div class="text-sm text-base-content/60 mb-1">Tempat Lahir</div>
                          <div class="font-semibold text-base-content">{tempatLahir}</div>
                        </div>
                        
                        <div class="p-4 rounded-xl bg-base-200/50 border border-base-300/30">
                          <div class="text-sm text-base-content/60 mb-1 flex items-center gap-2">
                            <LuCalendar class="w-4 h-4" />
                            Tanggal Lahir
                          </div>
                          <div class="font-semibold text-base-content">{tanggalLahir}</div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div class="p-4 rounded-xl bg-base-200/50 border border-base-300/30">
                          <div class="text-sm text-base-content/60 mb-2 flex items-center gap-2">
                            <LuMapPin class="w-4 h-4 text-primary" />
                            Alamat Lengkap
                          </div>
                          <div class="font-medium text-base-content break-words leading-relaxed">
                            {alamat}
                          </div>
                        </div>
                        
                        <div class="p-4 rounded-xl bg-base-200/50 border border-base-300/30">
                          <div class="text-sm text-base-content/60 mb-1 flex items-center gap-2">
                            <LuPhone class="w-4 h-4 text-primary" />
                            No. Telepon
                          </div>
                          <div class="font-semibold text-base-content">
                            {noTelp || "Belum tersedia"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Section */}
                {kesehatan && (
                  <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-6 sm:p-8">
                      <h2 class="card-title text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                          <LuStethoscope class="w-5 h-5 text-success" />
                        </div>
                        Informasi Kesehatan
                      </h2>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl bg-success/5 border border-success/20">
                          <div class="text-sm text-base-content/60 mb-1">Hasil Diagnosa</div>
                          <div class="font-semibold text-base-content">
                            {kesehatan?.hasil_diagnosa || "Belum tersedia"}
                          </div>
                        </div>
                        
                        <div class="p-4 rounded-xl bg-success/5 border border-success/20">
                          <div class="text-sm text-base-content/60 mb-1">Status ODGJ</div>
                          <div class="flex items-center gap-2">
                            <div class={`w-3 h-3 rounded-full ${kesehatan?.odgj ? 'bg-warning' : 'bg-success'}`}></div>
                            <span class="font-semibold">
                              {kesehatan?.odgj ? "Ya" : "Tidak"}
                            </span>
                          </div>
                        </div>
                        
                        <div class="p-4 rounded-xl bg-success/5 border border-success/20">
                          <div class="text-sm text-base-content/60 mb-1">Jenis Bantuan</div>
                          <div class="font-semibold text-base-content">
                            {kesehatan?.jenis_bantuan || "Belum tersedia"}
                          </div>
                        </div>
                        
                        <div class="p-4 rounded-xl bg-success/5 border border-success/20">
                          <div class="text-sm text-base-content/60 mb-1">Riwayat Terapi</div>
                          <div class="font-semibold text-base-content">
                            {kesehatan?.riwayat_terapi || "Belum tersedia"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assessment Section */}
                {assesmen && (
                  <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-6 sm:p-8">
                      <h2 class="card-title text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <LuBrain class="w-5 h-5 text-secondary" />
                        </div>
                        Asesmen Psikologi
                      </h2>
                      
                      <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Total IQ</div>
                            <div class="text-2xl font-bold text-secondary">
                              {assesmen?.total_iq || "-"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Kategori IQ</div>
                            <div class="font-semibold text-base-content">
                              {assesmen?.kategori_iq || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Tipe Kepribadian</div>
                            <div class="font-semibold text-base-content">
                              {assesmen?.tipe_kepribadian || "Belum tersedia"}
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Potensi</div>
                            <div class="font-medium text-base-content">
                              {assesmen?.potensi || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Minat</div>
                            <div class="font-medium text-base-content">
                              {assesmen?.minat || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Bakat</div>
                            <div class="font-medium text-base-content">
                              {assesmen?.bakat || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-1">Keterampilan</div>
                            <div class="font-medium text-base-content">
                              {assesmen?.keterampilan || "Belum tersedia"}
                            </div>
                          </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4">
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-2">Deskripsi Kepribadian</div>
                            <div class="font-medium text-base-content leading-relaxed">
                              {assesmen?.deskripsi_kepribadian || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-2">Catatan Psikolog</div>
                            <div class="font-medium text-base-content leading-relaxed">
                              {assesmen?.catatan_psikolog || "Belum tersedia"}
                            </div>
                          </div>
                          
                          <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                            <div class="text-sm text-base-content/60 mb-2">Rekomendasi Intervensi</div>
                            <div class="font-medium text-base-content leading-relaxed">
                              {assesmen?.rekomendasi_intervensi || "Belum tersedia"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div class="space-y-6">
                {/* Guardian Contact */}
                <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300 sticky top-6">
                  <div class="card-body p-6">
                    <h2 class="card-title text-lg font-bold mb-4 flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <LuUsers class="w-4 h-4 text-accent" />
                      </div>
                      Kontak Wali
                    </h2>
                    
                    <div class="space-y-4">
                      <div class="p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <div class="text-xs text-base-content/60 mb-1">Nama Wali</div>
                        <div class="font-semibold text-base-content">
                          {data?.nama_wali || "Belum tersedia"}
                        </div>
                      </div>
                      
                      <div class="p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <div class="text-xs text-base-content/60 mb-1 flex items-center gap-1">
                          <LuPhone class="w-3 h-3" />
                          No. Telepon Wali
                        </div>
                        <div class="font-semibold text-base-content">
                          {data?.no_telp_wali || "Belum tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social & Education Details */}
                {detail && (
                  <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
                    <div class="card-body p-6">
                      <h2 class="card-title text-lg font-bold mb-4 flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                          <LuInfo class="w-4 h-4 text-info" />
                        </div>
                        Detail Sosial
                      </h2>
                      
                      <div class="space-y-3">
                        <div class="p-3 rounded-lg bg-info/5 border border-info/20">
                          <div class="text-xs text-base-content/60 mb-1">Pekerjaan</div>
                          <div class="font-semibold text-base-content text-sm">
                            {detail?.pekerjaan || "Belum tersedia"}
                          </div>
                        </div>
                        
                        <div class="p-3 rounded-lg bg-info/5 border border-info/20">
                          <div class="text-xs text-base-content/60 mb-1">Pendidikan</div>
                          <div class="font-semibold text-base-content text-sm">
                            {detail?.pendidikan || "Belum tersedia"}
                          </div>
                        </div>
                        
                        <div class="p-3 rounded-lg bg-info/5 border border-info/20">
                          <div class="text-xs text-base-content/60 mb-1">Status Perkawinan</div>
                          <div class="font-semibold text-base-content text-sm">
                            {detail?.status_perkawinan || "Belum tersedia"}
                          </div>
                        </div>
                        
                        <div class="p-3 rounded-lg bg-info/5 border border-info/20">
                          <div class="text-xs text-base-content/60 mb-1">Koordinat</div>
                          <div class="font-mono text-xs text-base-content">
                            {detail?.titik_koordinat || "Belum tersedia"}
                          </div>
                        </div>
                        
                        {detail?.keterangan_tambahan && (
                          <div class="p-3 rounded-lg bg-info/5 border border-info/20">
                            <div class="text-xs text-base-content/60 mb-1">Keterangan Tambahan</div>
                            <div class="text-sm text-base-content leading-relaxed">
                              {detail.keterangan_tambahan}
                            </div>
                          </div>
                        )}
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
