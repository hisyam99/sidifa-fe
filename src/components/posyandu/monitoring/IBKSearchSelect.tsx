import { component$, useSignal, $, useTask$, QRL } from "@builder.io/qwik";
import { presensiIBKService } from "~/services/presensi-ibk.service";

interface IBKSearchSelectProps {
  posyanduId: string;
  jadwalId?: string; // optional; when provided, use ibk-not-registered endpoint
  onSelect$?: QRL<(payload: { id: string; label: string }) => void>;
  targetInputId?: string;
  placeholder?: string;
}

export const IBKSearchSelect = component$<IBKSearchSelectProps>(
  ({ posyanduId, jadwalId, onSelect$, targetInputId, placeholder }) => {
    const query = useSignal("");
    const open = useSignal(false);
    const loading = useSignal(false);
    const items = useSignal<any[]>([]);
    const selectedLabel = useSignal<string>("");

    const fetchList = $(async () => {
      if (!posyanduId) return;
      loading.value = true;
      try {
        if (jadwalId) {
          // Use new endpoint for IBK not registered in this jadwal
          const res = await presensiIBKService.listIbkNotRegistered(
            jadwalId,
            posyanduId,
          );
          const q = (query.value || "").toLowerCase();
          items.value = res.filter((r) =>
            (r.nama || "").toLowerCase().includes(q),
          );
        } else {
          // Fallback: no jadwalId provided; return empty
          items.value = [];
        }
      } finally {
        loading.value = false;
      }
    });

    useTask$(({ track, cleanup }) => {
      track(() => query.value);
      const handle = setTimeout(() => {
        if (open.value) fetchList();
      }, 200);
      cleanup(() => clearTimeout(handle));
    });

    const openDropdown = $(() => {
      if (!open.value) {
        open.value = true;
        if (items.value.length === 0) fetchList();
      }
    });

    const closeDropdown = $(() => {
      setTimeout(() => (open.value = false), 120);
    });

    const applySelection = $((payload: { id: string; label: string }) => {
      selectedLabel.value = payload.label;
      if (targetInputId) {
        const el = document.getElementById(
          targetInputId,
        ) as HTMLInputElement | null;
        if (el) {
          el.value = payload.id;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      if (onSelect$) onSelect$(payload);
      open.value = false;
    });

    return (
      <div class="relative w-full" onClick$={openDropdown}>
        <input
          type="text"
          class="input input-bordered w-full"
          placeholder={placeholder || "Cari nama IBK..."}
          value={selectedLabel.value || query.value}
          onInput$={(e) => {
            selectedLabel.value = "";
            query.value = (e.target as HTMLInputElement).value;
          }}
          onFocus$={openDropdown}
          onBlur$={closeDropdown}
          autoComplete="off"
          autoCapitalize="off"
          spellcheck={false}
        />
        {open.value && (
          <ul class="absolute left-0 right-0 mt-2 z-[9999] menu menu-sm p-2 shadow bg-base-100 rounded-box max-h-60 overflow-auto">
            {loading.value && <li class="px-2 py-1 text-sm">Memuat...</li>}
            {!loading.value && items.value.length === 0 && (
              <li class="px-2 py-1 text-sm text-base-content/60">
                Tidak ada hasil
              </li>
            )}
            {!loading.value &&
              items.value.map((row: any) => {
                const label = row?.nama || "(Tanpa Nama)";
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      class="justify-start"
                      onClick$={$(() => applySelection({ id: row.id, label }))}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    );
  },
);
