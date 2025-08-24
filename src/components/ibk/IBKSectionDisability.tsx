import { component$, useSignal, useStore, $, QRL } from "@builder.io/qwik";
import {
  LuInfo,
  LuActivity,
  LuBrain,
  LuHeart,
  LuEye,
  LuCheck,
} from "~/components/icons/lucide-optimized";
import { TYPE_TO_ID, ID_TO_TYPE, disabilityTypes } from "./ibkDisabilityTypes";

const DISABILITY_ICON_MAP = {
  fisik: LuActivity,
  intelektual: LuBrain,
  mental: LuHeart,
  sensorik: LuEye,
};

export const IBKSectionDisability = component$(
  (props: {
    onChangeSelections$?: QRL<
      (
        items: Array<{
          jenis_difabilitas_id: string;
          tingkat_keparahan: string;
          sejak_kapan?: string;
          keterangan?: string;
        }>,
      ) => void
    >;
    // For edit mode: existing disabilities from backend
    initialItems?: Array<{
      id: string; // disabilitas record id (needed for update)
      jenis_difabilitas_id: string;
      tingkat_keparahan: string;
      sejak_kapan?: string;
      keterangan?: string;
    }>;
    onEditChanges$?: QRL<
      (
        items: Array<{
          id: string;
          jenis_difabilitas_id: string;
          tingkat_keparahan: string;
          sejak_kapan?: string;
          keterangan?: string;
        }>,
      ) => void
    >;
  }) => {
    // State untuk multi-select dan detail
    const selected = useSignal<string[]>([]);
    const details = useStore<
      Record<
        string,
        {
          tingkat_keparahan: string;
          sejak_kapan: string;
          deskripsi_kondisi: string;
        }
      >
    >({});
    const didPrefill = useSignal(false);

    const emitChange = $(() => {
      const items = selected.value.map((type) => {
        const id = TYPE_TO_ID[type];
        const d = details[type] || {
          tingkat_keparahan: "ringan",
          sejak_kapan: "",
          deskripsi_kondisi: "",
        };
        return {
          jenis_difabilitas_id: id,
          tingkat_keparahan: d.tingkat_keparahan,
          sejak_kapan: d.sejak_kapan || undefined,
          keterangan: d.deskripsi_kondisi || undefined,
        };
      });
      if (props.onChangeSelections$) props.onChangeSelections$(items);

      // If we have initial items, also emit edit changes for those currently visible
      if (props.onEditChanges$ && props.initialItems?.length) {
        const edited: Array<{
          id: string;
          jenis_difabilitas_id: string;
          tingkat_keparahan: string;
          sejak_kapan?: string;
          keterangan?: string;
        }> = [];
        for (const it of props.initialItems) {
          const type = ID_TO_TYPE[it.jenis_difabilitas_id];
          if (!type) continue;
          // If the card is rendered (either selected or initial), read details from state; otherwise use original
          const d = details[type] ?? {
            tingkat_keparahan: it.tingkat_keparahan,
            sejak_kapan: it.sejak_kapan ?? "",
            deskripsi_kondisi: it.keterangan ?? "",
          };
          edited.push({
            id: it.id,
            jenis_difabilitas_id: it.jenis_difabilitas_id,
            tingkat_keparahan: d.tingkat_keparahan,
            sejak_kapan: d.sejak_kapan || undefined,
            keterangan: d.deskripsi_kondisi || undefined,
          });
        }
        props.onEditChanges$(edited);
      }
    });

    // Prefill from initialItems (once) and notify parent
    if (!didPrefill.value && props.initialItems?.length) {
      for (const it of props.initialItems) {
        const type = ID_TO_TYPE[it.jenis_difabilitas_id];
        if (!type) continue;
        if (!selected.value.includes(type))
          selected.value = [...selected.value, type];
        details[type] = {
          tingkat_keparahan: it.tingkat_keparahan || "ringan",
          sejak_kapan: it.sejak_kapan || "",
          deskripsi_kondisi: it.keterangan || "",
        };
      }
      didPrefill.value = true;
      // Emit once after prefill so parent gets edited and new states
      // Note: emitChange is a $ QRL, safe to call here
      emitChange?.();
    }

    const toggleDisability = $((type: string) => {
      if (selected.value.includes(type)) {
        selected.value = selected.value.filter((t) => t !== type);
        delete details[type];
      } else {
        selected.value = [...selected.value, type];
        details[type] = {
          tingkat_keparahan: "ringan",
          sejak_kapan: "",
          deskripsi_kondisi: "",
        };
      }
      emitChange();
    });

    return (
      <div class="space-y-6">
        <div class="alert alert-info mb-4">
          <LuInfo class="w-5 h-5" />
          <span>
            Pilih satu atau lebih jenis disabilitas yang sesuai dengan kondisi
            IBK. Informasi ini hanya untuk kebutuhan pendataan internal.
          </span>
        </div>
        <div class="text-center mb-8">
          <h3 class="text-xl font-bold mb-2">Pilih Jenis Disabilitas</h3>
          <p class="text-base-content/70">
            Pilih satu atau lebih jenis disabilitas yang sesuai (data akan
            dikirim ke backend setelah penyimpanan IBK)
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disabilityTypes.map((disability) => {
            const DisabilityIcon =
              DISABILITY_ICON_MAP[
                disability.icon as keyof typeof DISABILITY_ICON_MAP
              ];
            const isActive = selected.value.includes(disability.type);
            return (
              <div
                key={disability.type}
                class={`card cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${isActive ? disability.color + " ring-2 ring-offset-2 ring-current" : "border-base-300 bg-base-100"}`}
                onClick$={() => toggleDisability(disability.type)}
              >
                <div class="card-body p-6">
                  <div class="flex items-center gap-4 mb-4">
                    <div
                      class={`w-12 h-12 rounded-lg ${disability.color} flex items-center justify-center`}
                    >
                      <DisabilityIcon class="w-6 h-6 text-current" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-lg">{disability.title}</h4>
                      <p class="text-sm text-base-content/70">
                        {disability.description}
                      </p>
                    </div>
                    {isActive && <LuCheck class="w-6 h-6 text-success" />}
                  </div>
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-base-content/80">
                      Contoh kondisi:
                    </p>
                    <div class="flex flex-wrap gap-1">
                      {disability.examples.map((example) => (
                        <div
                          key={`${disability.type}-${example}`}
                          class="badge badge-outline badge-sm"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selected.value.length > 0 && (
          <div class="space-y-8 mt-8">
            <div class="divider">Detail Kondisi Disabilitas Terpilih</div>
            {selected.value.map((type) => {
              const disability = disabilityTypes.find((d) => d.type === type);
              if (!disability) return null;
              return (
                <div key={type} class="card bg-base-100 border border-base-300">
                  <div class="card-body space-y-4">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="font-bold text-lg">{disability.title}</span>
                      <span class="badge badge-outline">{disability.type}</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="label">
                          <span class="label-text font-semibold">
                            Tingkat Keparahan
                          </span>
                          <select
                            id={`${type}-severity`}
                            class="select select-bordered w-full"
                            value={details[type].tingkat_keparahan}
                            onChange$={(e) => {
                              details[type].tingkat_keparahan = (
                                e.target as HTMLSelectElement
                              ).value;
                              emitChange();
                            }}
                          >
                            <option value="ringan">Ringan</option>
                            <option value="sedang">Sedang</option>
                            <option value="berat">Berat</option>
                          </select>
                        </label>
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text font-semibold">
                            Sejak Kapan
                          </span>
                          <input
                            id={`${type}-sejak`}
                            type="datetime-local"
                            class="input input-bordered w-full"
                            placeholder="2025-08-10T13:30"
                            value={details[type].sejak_kapan}
                            onInput$={(e) => {
                              details[type].sejak_kapan = (
                                e.target as HTMLInputElement
                              ).value;
                              emitChange();
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text font-semibold">
                            Keterangan
                          </span>
                          <textarea
                            id={`${type}-desc`}
                            class="textarea textarea-bordered w-full"
                            placeholder="Jelaskan kondisi disabilitas"
                            value={details[type].deskripsi_kondisi}
                            onInput$={(e) => {
                              details[type].deskripsi_kondisi = (
                                e.target as HTMLTextAreaElement
                              ).value;
                              emitChange();
                            }}
                          ></textarea>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

export default IBKSectionDisability;
