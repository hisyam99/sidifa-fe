import { component$, useSignal } from "@builder.io/qwik";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const { createItem, loading, error, success } = useInformasiEdukasiAdmin();
  const nav = useNavigate();
  const form = useSignal<any>({
    judul: "",
    tipe: "",
    deskripsi: "",
    file_name: "",
  });

  return (
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Tambah Informasi Edukasi</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      <form
        class="space-y-4"
        preventdefault:submit
        onSubmit$={async () => {
          await createItem({
            judul: form.value.judul,
            tipe: form.value.tipe,
            deskripsi: form.value.deskripsi,
            file_name: form.value.file_name,
            role: "admin",
            name: form.value.judul,
          });
          nav(`/admin/(page)/informasi`);
        }}
      >
        <div>
          <label class="label">Judul</label>
          <input
            class="input input-bordered w-full"
            value={form.value.judul}
            onInput$={(e) =>
              (form.value.judul = (e.target as HTMLInputElement).value)
            }
            required
          />
        </div>
        <div>
          <label class="label">Tipe</label>
          <input
            class="input input-bordered w-full"
            value={form.value.tipe}
            onInput$={(e) =>
              (form.value.tipe = (e.target as HTMLInputElement).value)
            }
            required
          />
        </div>
        <div>
          <label class="label">Deskripsi</label>
          <textarea
            class="textarea textarea-bordered w-full"
            value={form.value.deskripsi}
            onInput$={(e) =>
              (form.value.deskripsi = (e.target as HTMLTextAreaElement).value)
            }
            required
          />
        </div>
        <div>
          <label class="label">File Name</label>
          <input
            class="input input-bordered w-full"
            value={form.value.file_name}
            onInput$={(e) =>
              (form.value.file_name = (e.target as HTMLInputElement).value)
            }
          />
        </div>
        <button
          class="btn btn-primary w-full"
          type="submit"
          disabled={loading.value}
        >
          {loading.value ? <LoadingSpinner text="" /> : "Tambah"}
        </button>
      </form>
    </div>
  );
});
