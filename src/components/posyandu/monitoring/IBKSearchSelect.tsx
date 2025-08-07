import { component$, useSignal, $, useTask$, QRL } from "@builder.io/qwik";
import { ibkService } from "~/services/api";

interface IBKSearchSelectProps {
  posyanduId: string;
  onSelect$?: QRL<(payload: { id: string; label: string }) => void>;
  targetInputId?: string; // optional hidden input id to write selected id
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
        fetchList();
        open.value = true;
      }, 250);
      cleanup(() => clearTimeout(handle));
    });

    const handleFocus = $(() => {
      if (!open.value && items.value.length === 0) {
        fetchList();
      }
      open.value = true;
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
      <div class="dropdown w-full">
        <div class="flex gap-2">
          <input
            type="text"
            class="input input-bordered w-full"
            placeholder={placeholder || "Cari nama IBK..."}
            value={selectedLabel.value || query.value}
            onInput$={(e) => {
              selectedLabel.value = ""; // reset when user types
              query.value = (e.target as HTMLInputElement).value;
            }}
            onFocus$={handleFocus}
          />
        </div>
        {open.value && (
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-2 max-h-60 overflow-auto">
            {loading.value && <li class="px-2 py-1 text-sm">Memuat...</li>}
            {!loading.value && items.value.length === 0 && (
              <li class="px-2 py-1 text-sm text-base-content/60">
                Tidak ada hasil
              </li>
            )}
            {!loading.value &&
              items.value.map((row: any) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick$={$(() => {
                      const label =
                        row?.nama ||
                        row?.personal_data?.nama_lengkap ||
                        row?.ibk?.nama ||
                        row?.nama_lengkap ||
                        "(Tanpa Nama)";
                      applySelection({ id: row.id, label });
                    })}
                  >
                    {row?.nama ||
                      row?.personal_data?.nama_lengkap ||
                      row?.ibk?.nama ||
                      row?.nama_lengkap ||
                      "(Tanpa Nama)"}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  },
);
