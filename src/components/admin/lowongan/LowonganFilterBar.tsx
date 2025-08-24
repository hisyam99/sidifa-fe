import {
  component$,
  PropFunction,
  Signal,
  $,
  useSignal,
} from "@builder.io/qwik";
import type { LowonganFilterOptions } from "~/types/lowongan";
import { useDebouncer } from "~/utils/debouncer";

interface LowonganFilterBarProps {
  filterOptions: Signal<LowonganFilterOptions>;
  onFilterChange$: PropFunction<() => void>;
  limit: Signal<number>;
  onLimitChange$: PropFunction<(limit: number) => void>;
}

export const LowonganFilterBar = component$<LowonganFilterBarProps>(
  ({ filterOptions, onFilterChange$, limit, onLimitChange$ }) => {
    // Signal lokal untuk input
    const localFilter = useSignal<LowonganFilterOptions>({
      ...filterOptions.value,
    });

    // Debounced apply: update signal parent dan trigger handler
    const debouncedApply = useDebouncer(
      $(() => {
        filterOptions.value = { ...localFilter.value };
        onFilterChange$();
      }),
      400,
    );

    // Handler input: update signal lokal, trigger debounced
    const setLocalFilter = $(
      (key: keyof LowonganFilterOptions, value: string) => {
        localFilter.value = { ...localFilter.value, [key]: value };
        debouncedApply();
      },
    );

    return (
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3 bg-base-100 p-4 rounded-lg shadow">
        <input
          class="input input-bordered w-full"
          placeholder="Nama lowongan"
          value={localFilter.value.nama_lowongan || ""}
          onInput$={(e) =>
            setLocalFilter(
              "nama_lowongan",
              (e.target as HTMLInputElement).value,
            )
          }
        />
        <input
          class="input input-bordered w-full"
          placeholder="Perusahaan"
          value={localFilter.value.nama_perusahaan || ""}
          onInput$={(e) =>
            setLocalFilter(
              "nama_perusahaan",
              (e.target as HTMLInputElement).value,
            )
          }
        />
        <input
          class="input input-bordered w-full"
          placeholder="Jenis pekerjaan"
          value={localFilter.value.jenis_pekerjaan || ""}
          onInput$={(e) =>
            setLocalFilter(
              "jenis_pekerjaan",
              (e.target as HTMLInputElement).value,
            )
          }
        />
        <input
          class="input input-bordered w-full"
          placeholder="Lokasi"
          value={localFilter.value.lokasi || ""}
          onInput$={(e) =>
            setLocalFilter("lokasi", (e.target as HTMLInputElement).value)
          }
        />
        <input
          class="input input-bordered w-full"
          placeholder="Jenis disabilitas"
          value={localFilter.value.jenis_difasilitas || ""}
          onInput$={(e) =>
            setLocalFilter(
              "jenis_difasilitas",
              (e.target as HTMLInputElement).value,
            )
          }
        />
        <select
          class="select select-bordered w-full"
          value={localFilter.value.status || ""}
          onChange$={(e) =>
            setLocalFilter("status", (e.target as HTMLSelectElement).value)
          }
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <div class="md:col-span-6 flex items-center gap-3 justify-end">
          <span class="text-sm">Tampilkan</span>
          <select
            class="select select-bordered"
            value={String(limit.value)}
            onChange$={(e) =>
              onLimitChange$(parseInt((e.target as HTMLSelectElement).value))
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span class="text-sm">per halaman</span>
        </div>
      </div>
    );
  },
);
