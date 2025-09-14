import { component$, $, Signal, QRL } from "@qwik.dev/core";
import { SearchBox } from "~/components/common";
import type { PosyanduFilterOptions } from "~/types/posyandu";
import { useDebouncer } from "~/utils/debouncer";

interface PosyanduFilterSortProps {
  filterOptions: Signal<PosyanduFilterOptions>;
  onFilterSortChange$: QRL<() => void>;
  onLimitChange$?: QRL<(event: Event) => void>; // Add onLimitChange$
  limit: Signal<number>; // Add limit signal
}

export const PosyanduFilterSort = component$(
  (props: PosyanduFilterSortProps) => {
    const { filterOptions, onFilterSortChange$, onLimitChange$, limit } = props;

    // const sortByOptions = [
    //   { label: "Nama Posyandu (A-Z)", value: "nama_asc" },
    //   { label: "Nama Posyandu (Z-A)", value: "nama_desc" },
    // ];

    // const statusOptions = [
    //   { label: "Semua Status", value: "" },
    //   { label: "Aktif", value: "Aktif" },
    //   { label: "Tidak Aktif", value: "Tidak Aktif" },
    // ];

    const limitOptions = [
      { label: "5 per halaman", value: 5 },
      { label: "10 per halaman", value: 10 },
      { label: "20 per halaman", value: 20 },
      { label: "50 per halaman", value: 50 },
      { label: "100 per halaman", value: 100 },
    ];

    // Debounced filter trigger for search input
    const debouncedFilterSort = useDebouncer(
      $(() => {
        onFilterSortChange$();
      }),
      500, // 500ms debounce, adjust as needed
    );

    return (
      <div class="card mb-6 p-6 bg-base-100 shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">
          Filter & Urutkan Posyandu
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="form-control">
            <label for="search-name" class="label">
              <span class="label-text">Cari Nama Posyandu</span>
            </label>
            <SearchBox
              id="search-name"
              placeholder="Cari berdasarkan nama..."
              value={filterOptions.value.nama_posyandu || ""}
              onInput$={(e) => {
                filterOptions.value.nama_posyandu = (
                  e.target as HTMLInputElement
                ).value;
                debouncedFilterSort();
              }}
              onEnter$={onFilterSortChange$}
              size="sm"
              variant="minimal"
            />
          </div>
          {/* <div class="form-control">
            <label for="sort-by" class="label">
              <span class="label-text">Urutkan Berdasarkan</span>
            </label>
            <select
              id="sort-by"
              class="select select-bordered w-full"
              value={sortOptions.value.sortBy}
              onChange$={(e) => {
                sortOptions.value.sortBy = (
                  e.target as HTMLSelectElement
                ).value;
                onFilterSortChange$();
              }}
            >
              {sortByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> */}
          {/* <div class="form-control">
            <label for="filter-status" class="label">
              <span class="label-text">Filter Status</span>
            </label>
            <select
              id="filter-status"
              class="select select-bordered w-full"
              value={filterOptions.value.status}
              onChange$={(e) => {
                filterOptions.value.status = (e.target as HTMLSelectElement)
                  .value as "Aktif" | "Tidak Aktif" | "";
                onFilterSortChange$();
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> */}
          <div class="form-control">
            <label for="limit-select" class="label">
              <span class="label-text">Tampilkan Per Halaman</span>
            </label>
            <select
              id="limit-select"
              class="select select-bordered w-full"
              value={limit.value}
              onChange$={onLimitChange$}
            >
              {limitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Terapkan Filter & Urutkan button removed, filter/sort now applies automatically */}
      </div>
    );
  },
);
