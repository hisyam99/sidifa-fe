import { component$, Signal, QRL } from "@qwik.dev/core";
import { SearchBox } from "~/components/common";
import type { AdminPsikologFilterOptions } from "~/types/admin-psikolog-management";

interface AdminPsikologFilterControlsProps {
  filterOptions: Signal<AdminPsikologFilterOptions>;
  onFilterChange$: QRL<() => void>;
}

export const AdminPsikologFilterControls = component$(
  (props: AdminPsikologFilterControlsProps) => {
    const { filterOptions, onFilterChange$ } = props;

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">Filter Psikolog</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="search-name" class="label">
              <span class="label-text">Cari Nama Psikolog</span>
            </label>
            <SearchBox
              id="search-name"
              placeholder="Masukkan nama psikolog..."
              value={filterOptions.value.nama || ""}
              onInput$={(e) =>
                (filterOptions.value.nama = (
                  e.target as HTMLInputElement
                ).value)
              }
              onEnter$={onFilterChange$}
              size="lg"
              variant="default"
            />
          </div>
          <div class="form-control flex-1">
            <label for="filter-specialization" class="label">
              <span class="label-text">Filter berdasarkan Spesialisasi</span>
            </label>
            <input
              type="text"
              id="filter-specialization"
              placeholder="Masukkan spesialisasi..."
              class="input input-bordered w-full"
              value={filterOptions.value.spesialisasi}
              onInput$={(e) =>
                (filterOptions.value.spesialisasi = (
                  e.target as HTMLInputElement
                ).value)
              }
              onKeyUp$={(e) => e.key === "Enter" && onFilterChange$()}
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
