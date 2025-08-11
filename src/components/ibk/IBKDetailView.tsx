import { component$, QRL } from "@builder.io/qwik";
import {
  LuArrowLeft,
  LuPencil,
  LuMapPin,
  LuPhone,
  LuUser,
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
      <div class="w-full mx-auto max-w-6xl">
        <div class="mb-6 flex items-center gap-2">
          <button class="btn btn-ghost" onClick$={onBack$} aria-label="Kembali">
            <LuArrowLeft class="w-5 h-5" />
            <span class="hidden sm:inline">Kembali</span>
          </button>
        </div>

        <div class="card bg-base-100 shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div class="avatar">
              <div class="w-24 h-24 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                {foto ? (
                  <img src={foto} alt={nama} width={96} height={96} />
                ) : (
                  <div class="w-full h-full grid place-items-center bg-base-200">
                    <LuUser class="w-10 h-10 text-base-content/50" />
                  </div>
                )}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl sm:text-3xl font-bold leading-tight break-words">
                {nama}
              </h1>
              <p class="text-base-content/70 mt-1 break-words">NIK: {nik}</p>
              <div class="mt-2 flex flex-wrap gap-2 text-sm text-base-content/70">
                <span class="badge badge-outline">{jenisKelamin}</span>
                <span class="badge badge-outline">Umur: {umur}</span>
                <span class="badge badge-outline">{agama}</span>
              </div>
            </div>
            {onEdit$ && (
              <div class="mt-2 sm:mt-0">
                <button
                  class="btn btn-primary gap-2"
                  onClick$={onEdit$}
                  aria-label="Edit IBK"
                >
                  <LuPencil class="w-5 h-5" />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>

          <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section class="col-span-2 card bg-base-100 border border-base-200">
              <div class="card-body">
                <h2 class="card-title">Data Diri</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span class="font-semibold">Tempat Lahir:</span>{" "}
                    {tempatLahir}
                  </div>
                  <div>
                    <span class="font-semibold">Tanggal Lahir:</span>{" "}
                    {tanggalLahir}
                  </div>
                  <div class="flex items-start gap-2">
                    <LuMapPin class="w-4 h-4 mt-0.5 text-primary" />
                    <div class="min-w-0">
                      <div class="font-semibold">Alamat</div>
                      <div class="break-words whitespace-normal">{alamat}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <LuPhone class="w-4 h-4 text-primary" />
                    <div>
                      <span class="font-semibold">No. Telp:</span> {noTelp}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside class="card bg-base-100 border border-base-200">
              <div class="card-body">
                <h2 class="card-title">Wali & Kontak</h2>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-semibold">Nama Wali:</span>{" "}
                    {data?.nama_wali ?? "-"}
                  </div>
                  <div>
                    <span class="font-semibold">No. Telp Wali:</span>{" "}
                    {data?.no_telp_wali ?? "-"}
                  </div>
                </div>
              </div>
            </aside>

            {kesehatan && (
              <section class="card bg-base-100 border border-base-200 lg:col-span-3">
                <div class="card-body">
                  <h2 class="card-title">Kesehatan IBK</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span class="font-semibold">Hasil Diagnosa:</span>{" "}
                      {kesehatan?.hasil_diagnosa ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">ODGJ:</span>{" "}
                      {kesehatan?.odgj ? "Ya" : "Tidak"}
                    </div>
                    <div>
                      <span class="font-semibold">Jenis Bantuan:</span>{" "}
                      {kesehatan?.jenis_bantuan ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Riwayat Terapi:</span>{" "}
                      {kesehatan?.riwayat_terapi ?? "-"}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {detail && (
              <section class="card bg-base-100 border border-base-200 lg:col-span-3">
                <div class="card-body">
                  <h2 class="card-title">Detail Sosial & Pendidikan</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span class="font-semibold">Pekerjaan:</span>{" "}
                      {detail?.pekerjaan ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Pendidikan:</span>{" "}
                      {detail?.pendidikan ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Status Perkawinan:</span>{" "}
                      {detail?.status_perkawinan ?? "-"}
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-semibold">Titik Koordinat:</span>{" "}
                      {detail?.titik_koordinat ?? "-"}
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-semibold">Keterangan Tambahan:</span>{" "}
                      {detail?.keterangan_tambahan ?? "-"}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {assesmen && (
              <section class="card bg-base-100 border border-base-200 lg:col-span-3">
                <div class="card-body">
                  <h2 class="card-title">Asesmen Psikologi</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span class="font-semibold">Total IQ:</span>{" "}
                      {assesmen?.total_iq ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Kategori IQ:</span>{" "}
                      {assesmen?.kategori_iq ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Tipe Kepribadian:</span>{" "}
                      {assesmen?.tipe_kepribadian ?? "-"}
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-semibold">Deskripsi Kepribadian:</span>{" "}
                      {assesmen?.deskripsi_kepribadian ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Potensi:</span>{" "}
                      {assesmen?.potensi ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Minat:</span>{" "}
                      {assesmen?.minat ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Bakat:</span>{" "}
                      {assesmen?.bakat ?? "-"}
                    </div>
                    <div>
                      <span class="font-semibold">Keterampilan:</span>{" "}
                      {assesmen?.keterampilan ?? "-"}
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-semibold">Catatan Psikolog:</span>{" "}
                      {assesmen?.catatan_psikolog ?? "-"}
                    </div>
                    <div class="md:col-span-3">
                      <span class="font-semibold">Rekomendasi Intervensi:</span>{" "}
                      {assesmen?.rekomendasi_intervensi ?? "-"}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  },
);
