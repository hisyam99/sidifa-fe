import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { AdminPosyanduFilterOptions } from "~/types/admin-posyandu-management";

interface AdminPosyanduFilterControlsProps {
  filterOptions: Signal<AdminPosyanduFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit: Signal<number>;
  onLimitChange$: QRL<(limit: number) => void>;
}

export const AdminPosyanduFilterControls = component$(
  (props: AdminPosyanduFilterControlsProps) => {
    const { filterOptions, onFilterChange$ } = props;

    const statusOptions = [
      { label: "Semua Status", value: "" },
      { label: "Aktif", value: "Aktif" },
      { label: "Tidak Aktif", value: "Tidak Aktif" },
    ];

    const limitOptions = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ];

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">Filter Posyandu</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="search-posyandu" class="label">
              <span class="label-text">Cari Nama Posyandu</span>
            </label>
            <SearchBox
              id="search-posyandu"
              placeholder="Cari berdasarkan nama posyandu..."
              value={filterOptions.value.nama_posyandu || ""}
              onInput$={(e) =>
                (filterOptions.value.nama_posyandu = (
                  e.target as HTMLInputElement
                ).value)
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
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="form-control flex-1">
            <label for="limit-per-page" class="label">
              <span class="label-text">Limit per Halaman</span>
            </label>
            <select
              id="limit-per-page"
              class="select select-bordered w-full"
              value={props.limit.value}
              onChange$={(e) => {
                props.onLimitChange$(
                  parseInt((e.target as HTMLSelectElement).value),
                );
              }}
            >
              {limitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
