import { component$, useSignal, $, useTask$, QRL } from "@builder.io/qwik";
import { ibkService } from "~/services/api";

interface IBKSearchSelectProps {
  posyanduId: string;
  onSelect$?: QRL<(payload: { id: string; label: string }) => void>;
  targetInputId?: string;
  placeholder?: string;
}

export const IBKSearchSelect = component$<IBKSearchSelectProps>(
  ({ posyanduId, onSelect$, targetInputId, placeholder }) => {
    const query = useSignal("");
    const open = useSignal(false);
    const loading = useSignal(false);
    const items = useSignal<any[]>([]);
    const selectedLabel = useSignal<string>("");

    const fetchList = $(async () => {
      if (!posyanduId) return;
      loading.value = true;
      try {
        const res: any = await ibkService.getIbkListByPosyandu({
          posyanduId,
          page: 1,
          limit: 10,
          nama: query.value || undefined,
        });
        items.value = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
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
      // Delay agar click item tetap diproses sebelum tertutup
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
            selectedLabel.value = ""; // reset saat user mengetik
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
                const label =
                  row?.nama ||
                  row?.personal_data?.nama_lengkap ||
                  row?.ibk?.nama ||
                  row?.nama_lengkap ||
                  "(Tanpa Nama)";
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
