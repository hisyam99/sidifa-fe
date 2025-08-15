import { component$, Signal, QRL } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";
import type { InformasiFilterOptions } from "~/types/informasi";
import { useDebouncer } from "~/utils/debouncer";
import { LuSearch } from "~/components/icons/lucide-optimized";

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

    const emitDebounced = useDebouncer(onFilterChange$, 400);

    return (
      <div class="mb-6 p-4 md:p-6 bg-base-100 rounded-lg shadow-md">
        <h2 class="card-title text-xl font-bold mb-3 md:mb-4">
          Filter Informasi
        </h2>
        <div class="flex flex-col md:flex-row md:flex-nowrap items-stretch md:items-center gap-2 md:gap-4">
          <div class="relative flex-1 min-w-0">
            <LuSearch class="pointer-events-none absolute z-10 left-2 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4 md:w-5 md:h-5" />
            <div onBlur$={onFilterChange$}>
              <SearchBox
                id="filter-judul"
                placeholder="Cari berdasarkan judul..."
                value={filterOptions.value.judul || ""}
                onInput$={(e) => {
                  filterOptions.value.judul = (
                    e.target as HTMLInputElement
                  ).value;
                  emitDebounced();
                }}
                onEnter$={onFilterChange$}
                class="input input-bordered input-sm md:input-md w-full pl-8"
              />
            </div>
          </div>
          <div class="relative flex-1 min-w-0">
            <div onBlur$={onFilterChange$}>
              <SearchBox
                id="filter-deskripsi"
                placeholder="Cari berdasarkan deskripsi..."
                value={filterOptions.value.deskripsi || ""}
                onInput$={(e) => {
                  filterOptions.value.deskripsi = (
                    e.target as HTMLInputElement
                  ).value;
                  emitDebounced();
                }}
                onEnter$={onFilterChange$}
                class="input input-bordered w-full"
              />
            </div>
          </div>
          <div class="shrink-0">
            <select
              id="filter-type"
              class="select select-bordered select-sm md:select-md w-auto"
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
          {limit && onLimitChange$ && (
            <div class="shrink-0">
              <select
                id="limit-select"
                class="select select-bordered select-sm md:select-md w-auto"
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
          <button
            class="btn btn-primary btn-sm md:btn-md md:ml-auto"
            onClick$={onFilterChange$}
          >
            Terapkan
          </button>
        </div>
      </div>
    );
  },
);
