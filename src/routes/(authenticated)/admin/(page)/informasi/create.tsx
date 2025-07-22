import { component$, $ } from "@qwik.dev/core";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@qwik.dev/router";
import {
  InformasiForm,
  InformasiFormData,
} from "~/components/admin/information";

export default component$(() => {
  const { createItem, loading, error, success } = useInformasiEdukasiAdmin();
  const nav = useNavigate();

  const handleSubmit = $(async (data: InformasiFormData) => {
    try {
      await createItem({
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file: data.file,
      });
      if (!error.value) {
        nav(`/admin/informasi`);
      }
    } catch {
      // Error is already handled in createItem function
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
