import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { useNavigate } from "@builder.io/qwik-city";

// Modular Table
const InformasiTable = component$(({ items, page, limit }: any) => (
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>No</th>
          <th>Judul</th>
          <th>Tipe</th>
          <th>Deskripsi</th>
          <th>File</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} class="text-center">
              Tidak ada data
            </td>
          </tr>
        ) : (
          items.map((item: any, idx: number) => (
            <tr key={item.id}>
              <td>{(page - 1) * limit + idx + 1}</td>
              <td>{item.judul}</td>
              <td>{item.tipe}</td>
              <td>{item.deskripsi}</td>
              <td>{item.file_url || "-"}</td>
              <td>
                <slot name={`edit-${item.id}`} />
                <slot name={`delete-${item.id}`} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
));

// Modular Filter
// Hapus InformasiFilter

// Modular Modal Delete
const ModalDelete = component$(
  ({ open, onCancel, onConfirm }: any) =>
    open.value && (
      <div class="modal modal-open">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Konfirmasi Hapus</h3>
          <p>Yakin ingin menghapus data ini?</p>
          <div class="modal-action">
            <button class="btn" onClick$={onCancel}>
              Batal
            </button>
            <button class="btn btn-error" onClick$={onConfirm}>
              Hapus
            </button>
          </div>
        </div>
      </div>
    ),
);

export default component$(() => {
  const {
    items,
    loading,
    error,
    success,
    total,
    page,
    limit,
    fetchList,
    deleteItem,
  } = useInformasiEdukasiAdmin();
  const nav = useNavigate();

  // State untuk filter dan modal
  const filterJudul = useSignal("");
  const filterDeskripsi = useSignal("");
  const deleteId = useSignal<string | null>(null);

  const { isLoggedIn } = useAuth();

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(filterJudul);
    track(filterDeskripsi);
    track(page);
    track(limit);

    if (isLoggedIn.value) {
      fetchList({
        judul: filterJudul.value,
        deskripsi: filterDeskripsi.value,
        page: page.value,
        limit: limit.value,
      });
    } else {
      items.value = [];
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
    }
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Manajemen Informasi Edukasi</h1>
      <div class="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari Judul..."
          class="input input-bordered"
          value={filterJudul.value}
          onInput$={(e) => {
            filterJudul.value = (e.target as HTMLInputElement).value;
            fetchList({
              judul: filterJudul.value,
              deskripsi: filterDeskripsi.value,
            });
          }}
        />
        <input
          type="text"
          placeholder="Cari Deskripsi..."
          class="input input-bordered"
          value={filterDeskripsi.value}
          onInput$={(e) => {
            filterDeskripsi.value = (e.target as HTMLInputElement).value;
            fetchList({
              judul: filterJudul.value,
              deskripsi: filterDeskripsi.value,
            });
          }}
        />
      </div>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      {loading.value ? (
        <div class="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <InformasiTable
          items={items.value}
          page={page.value}
          limit={limit.value}
        >
          {items.value.map((item: any) => (
            <>
              <button
                q:slot={`edit-${item.id}`}
                class="btn btn-sm btn-primary mr-2"
                onClick$={() => nav(`/admin/(page)/informasi/${item.id}/edit`)}
              >
                Edit
              </button>
              <button
                q:slot={`delete-${item.id}`}
                class="btn btn-sm btn-error"
                onClick$={() => {
                  deleteId.value = item.id;
                }}
              >
                Delete
              </button>
            </>
          ))}
        </InformasiTable>
      )}
      {/* Pagination */}
      <div class="flex justify-between items-center mt-4">
        <div>Total: {total.value}</div>
        <div class="join">
          <button
            class="join-item btn"
            disabled={page.value === 1}
            onClick$={() => fetchList({ page: page.value - 1 })}
          >
            «
          </button>
          <button class="join-item btn">{page.value}</button>
          <button
            class="join-item btn"
            disabled={items.value.length < limit.value}
            onClick$={() => fetchList({ page: page.value + 1 })}
          >
            »
          </button>
        </div>
      </div>
      {/* Modal Delete */}
      <ModalDelete
        open={deleteId}
        onCancel$={() => {
          deleteId.value = null;
        }}
        onConfirm$={async () => {
          if (deleteId.value) {
            await deleteItem(deleteId.value);
            deleteId.value = null;
            fetchList();
          }
        }}
      />
    </div>
  );
});
