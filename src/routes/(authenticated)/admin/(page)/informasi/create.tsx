import { component$, $ } from "@builder.io/qwik";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@builder.io/qwik-city";
import {
  InformasiForm,
  InformasiFormData,
} from "~/components/admin/information";

export default component$(() => {
  const { createItem, loading, error, success } = useInformasiEdukasiAdmin();
  const nav = useNavigate();

  const handleSubmit = $(async (data: InformasiFormData) => {
    await createItem({
      judul: data.judul,
      tipe: data.tipe,
      deskripsi: data.deskripsi,
      file_url: data.file_url, // Changed from file_name to file_url
    });
    if (!error.value) {
      nav(`/admin/informasi`);
    }
  });

  return (
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Tambah Informasi Edukasi</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      <InformasiForm
        onSubmit$={handleSubmit}
        loading={loading.value}
        submitButtonText="Tambah"
      />
    </div>
  );
});
