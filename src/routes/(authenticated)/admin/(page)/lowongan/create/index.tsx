import { component$, $ } from "@qwik.dev/core";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@qwik.dev/router";
import {
  LowonganForm,
  type LowonganFormData,
} from "~/components/admin/lowongan";

export default component$(() => {
  const { createItem, loading, error, success } = useLowonganAdmin();
  const nav = useNavigate();

  const handleSubmit = $(async (data: LowonganFormData) => {
    try {
      await createItem(data);
      if (!error.value) nav(`/admin/lowongan`);
    } catch {
      // handled in hook
    }
  });

  return (
    <div class="mx-auto">
      <h1 class="text-2xl font-bold mb-4">Tambah Lowongan</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      <LowonganForm
        onSubmit$={handleSubmit}
        loading={loading.value}
        submitButtonText="Tambah"
      />
    </div>
  );
});
