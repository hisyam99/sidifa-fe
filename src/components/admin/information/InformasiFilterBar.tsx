import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { InformasiFilterOptions } from "~/types/informasi";

interface InformasiFilterBarProps {
  filterOptions: Signal<InformasiFilterOptions>;
  onFilterChange$: QRL<() => void>;
}

export const InformasiFilterBar = component$(
  (props: InformasiFilterBarProps) => {
    const { filterOptions, onFilterChange$ } = props;

    const typeOptions = [
      { label: "Semua Tipe", value: "" },
      { label: "Artikel", value: "artikel" },
      { label: "Panduan", value: "panduan" },
      { label: "Video", value: "video" },
      { label: "Infografis", value: "infografis" },
    ];

    return (
      <div class="mb-6 p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-4">Filter Informasi</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <label for="filter-judul" class="label">
              <span class="label-text">Cari Judul</span>
            </label>
            <SearchBox
              id="filter-judul"
              placeholder="Cari berdasarkan judul..."
              value={filterOptions.value.judul || ""}
              onInput$={(e) =>
                (filterOptions.value.judul = (
                  e.target as HTMLInputElement
                ).value)
              }
              onEnter$={onFilterChange$}
              size="md"
              variant="floating"
            />
          </div>
          <div class="form-control flex-1">
            <label for="filter-deskripsi" class="label">
              <span class="label-text">Cari Deskripsi</span>
            </label>
            <SearchBox
              id="filter-deskripsi"
              placeholder="Cari berdasarkan deskripsi..."
              value={filterOptions.value.deskripsi || ""}
              onInput$={(e) =>
                (filterOptions.value.deskripsi = (
                  e.target as HTMLInputElement
                ).value)
              }
              onEnter$={onFilterChange$}
              size="md"
              variant="floating"
            />
          </div>
          <div class="form-control flex-1">
            <label for="filter-type" class="label">
              <span class="label-text">Filter berdasarkan Tipe</span>
            </label>
            <select
              id="filter-type"
              class="select select-bordered w-full"
              value={filterOptions.value.tipe}
              onChange$={(e) => {
                filterOptions.value.tipe = (
                  e.target as HTMLSelectElement
                ).value;
                onFilterChange$();
              }}
            >
              {typeOptions.map((option) => (
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
