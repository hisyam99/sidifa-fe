import { component$, useSignal, $ } from "@builder.io/qwik";

export default component$(() => {
  const loading = useSignal(false);
  const result = useSignal<string | null>(null);
  const error = useSignal<string | null>(null);

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
      // Simulasi file upload (file harus ada di public/media atau gunakan File API jika di browser)
      // Untuk test, file kosong saja:
      const file = new File([""], "1752590666771-22624.png", {
        type: "image/png",
      });
      formData.append("file_foto", file);
      formData.append("jenis_kelamin", "Laki-laki");
      formData.append("agama", "Islam");
      formData.append("umur", "15");
      formData.append("alamat", "Jl. Soekarno Hatta No. 12, Malang");
      formData.append("no_telp", "081234567890");
      formData.append("nama_wali", "Siti Aminah");
      formData.append("no_telp_wali", "081298765432");
      formData.append("posyanduId", "356682f4-6cfd-4148-84bd-4fc631db753a");
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

      const res = await fetch(
        "https://apisd.krisnabmntr.my.id/api/v1/kader/ibk",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) {
        throw new Error("Status " + res.status + ": " + (await res.text()));
      }
      const data = await res.json();
      result.value = JSON.stringify(data, null, 2);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="max-w-xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-4">Test Create IBK (POST)</h1>
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
