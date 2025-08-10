import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { InformasiFilterOptions } from "~/types/informasi";

interface InformasiFilterBarProps {
  filterOptions: Signal<InformasiFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit?: Signal<number>;
  onLimitChange$?: QRL<(newLimit: number) => void>;
}

export const InformasiFilterBar = component$(
  (props: InformasiFilterBarProps) => {
    const { filterOptions, onFilterChange$, limit, onLimitChange$ } = props;

    const typeOptions = [
      { label: "Semua Tipe", value: "" },
      { label: "Artikel", value: "ARTIKEL" },
      { label: "Panduan", value: "PANDUAN" },
      { label: "Regulasi", value: "REGULASI" },
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
        <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          {limit && onLimitChange$ && (
            <div class="form-control w-40">
              <label for="limit-select" class="label">
                <span class="label-text">Tampilkan per halaman</span>
              </label>
              <select
                id="limit-select"
                class="select select-bordered"
                value={limit.value}
                onChange$={(e) => {
                  const newLimit = Number(
                    (e.target as HTMLSelectElement).value,
                  );
                  onLimitChange$(newLimit);
                }}
              >
                {[10, 20, 50].map((val) => (
                  <option key={val} value={val.toString()}>
                    {`${val} data`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button class="btn btn-primary" onClick$={onFilterChange$}>
            Terapkan Filter
          </button>
        </div>
      </div>
    );
  },
);
