// File 1: /src/routes/(authenticated)/kader/(posyandu)/posyandu/[id]/ibk/create/test/index.tsx

import { component$, useSignal, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { ibkService } from "~/services/api";

export default component$(() => {
  const { isLoggedIn, loading: authLoading, error: authError } = useAuth();
  const loading = useSignal(false);
  const result = useSignal<string | null>(null);
  const error = useSignal<string | null>(null);
  const loc = useLocation();
  const nav = useNavigate();
  const posyanduId = loc.params.id;

  // Jika belum login, redirect ke login
  if (!authLoading.value && !isLoggedIn.value) {
    nav("/auth/login");
    return <div>Redirecting...</div>;
  }

  const handleSubmit = $(async (e: any) => {
    e.preventDefault();
    loading.value = true;
    result.value = null;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append("nama", "HIsyam");
      formData.append("nik", "1234567890123456");
      formData.append("tempat_lahir", "Malang");
      formData.append("tanggal_lahir", "2010-05-15T00:00:00.000Z");
      // Kirim nama file sebagai string, bukan File
      formData.append("file_foto", "1752590666771-22624.png");
      formData.append("jenis_kelamin", "Laki-laki");
      formData.append("agama", "Islam");
      formData.append("umur", "15");
      formData.append("alamat", "Jl. Soekarno Hatta No. 12, Malang");
      formData.append("no_telp", "081234567890");
      formData.append("nama_wali", "Siti Aminah");
      formData.append("no_telp_wali", "081298765432");
      formData.append("posyanduId", posyanduId);
      formData.append("odgj", "t");
      formData.append("hasil_diagnosa", "Sehat");
      formData.append("jenis_bantuan", "Tidak ada");
      formData.append("riwayat_terapi", "Tidak ada");
      formData.append("pekerjaan", "Programmer Handal");
      formData.append("pendidikan", "S1");
      formData.append("status_perkawinan", "Belum menikah");
      formData.append("titik_koordinat", "123111aasd'");
      formData.append("keterangan_tambahan", "tes");
      formData.append("total_iq", "110");
      formData.append("kategori_iq", "Rata-rata");
      formData.append("tipe_kepribadian", "Introvert");
      formData.append(
        "deskripsi_kepribadian",
        "Cenderung pendiam, fokus, dan menyukai kegiatan individu.",
      );
      formData.append("potensi", "Matematika dan logika");
      formData.append("minat", "Teknologi");
      formData.append("bakat", "Menggambar teknis");
      formData.append("keterampilan", "Pemrograman dasar, komunikasi tertulis");
      formData.append(
        "catatan_psikolog",
        "Anak menunjukkan kemampuan adaptasi yang cukup baik.",
      );
      formData.append(
        "rekomendasi_intervensi",
        "Berikan pelatihan lanjutan di bidang teknologi.",
      );

      // Gunakan logic ibkService (sudah handle CSRF, auth, baseURL)
      const data = await ibkService.createIbk(formData);
      result.value = JSON.stringify(data, null, 2);
    } catch (err: any) {
      error.value = err.message || JSON.stringify(err);
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="max-w-xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-4">Test Create IBK (Per Posyandu)</h1>
      {authLoading.value && <div>Loading auth...</div>}
      {authError.value && <div class="text-red-600">{authError.value}</div>}
      <form preventdefault:submit onSubmit$={handleSubmit}>
        <button type="submit" class="btn btn-primary" disabled={loading.value}>
          {loading.value ? "Menyimpan..." : "Kirim Data IBK (Test)"}
        </button>
      </form>
      {result.value && (
        <pre class="bg-green-100 text-green-800 p-4 mt-4 rounded">
          {result.value}
        </pre>
      )}
      {error.value && (
        <pre class="bg-red-100 text-red-800 p-4 mt-4 rounded">
          {error.value}
        </pre>
      )}
    </div>
  );
});
