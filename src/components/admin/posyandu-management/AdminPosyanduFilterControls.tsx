import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { AdminPosyanduFilterOptions } from "~/types/admin-posyandu-management";

interface AdminPosyanduFilterControlsProps {
  filterOptions: Signal<AdminPosyanduFilterOptions>;
  onFilterChange$: QRL<() => void>;
}

export const AdminPosyanduFilterControls = component$(
  (props: AdminPosyanduFilterControlsProps) => {
    const { filterOptions, onFilterChange$ } = props;

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">Filter Posyandu</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="search-name" class="label">
              <span class="label-text">Cari Nama Posyandu</span>
            </label>
            <SearchBox
              id="search-name"
              placeholder="Masukkan nama posyandu..."
              value={filterOptions.value.nama_posyandu || ""} // Ensure it's always a string
              onInput$={(e) =>
                (filterOptions.value.nama_posyandu = (e.target as HTMLInputElement).value)
              }
              onEnter$={onFilterChange$}
              class="input-bordered"
            />
          </div>
          <div class="form-control flex-1">
            <label for="filter-status" class="label">
              <span class="label-text">Filter berdasarkan Status</span>
            </label>
            <select
              id="filter-status"
              class="select select-bordered w-full"
              value={filterOptions.value.status}
              onChange$={(e) => {
                filterOptions.value.status = (e.target as HTMLSelectElement)
                  .value as "Aktif" | "Tidak Aktif" | "";
                onFilterChange$();
              }}
            >
              <option value="">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button class="btn btn-primary" onClick$={onFilterChange$}>
            Terapkan Filter
          </button>
        </div>
      </div>
    );
  },
);
