import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import {
  LuInfo,
  LuActivity,
  LuBrain,
  LuHeart,
  LuEye,
  LuCheck,
} from "~/components/icons/lucide-optimized";

const DISABILITY_ICON_MAP = {
  fisik: LuActivity,
  intelektual: LuBrain,
  mental: LuHeart,
  sensorik: LuEye,
};
const disabilityTypes = [
  {
    type: "fisik",
    title: "Disabilitas Fisik",
    description: "Gangguan fungsi gerak dan mobilitas tubuh",
    icon: "fisik",
    color: "border-primary bg-primary/5",
    examples: ["Lumpuh kaki", "Cacat tangan", "Kelainan tulang belakang"],
  },
  {
    type: "intelektual",
    title: "Disabilitas Intelektual",
    description: "Keterbatasan fungsi kognitif dan adaptif",
    icon: "intelektual",
    color: "border-secondary bg-secondary/5",
    examples: ["Down Syndrome", "Autisme", "Keterlambatan perkembangan"],
  },
  {
    type: "mental",
    title: "Disabilitas Mental",
    description: "Gangguan fungsi psikis dan emosional",
    icon: "mental",
    color: "border-accent bg-accent/5",
    examples: ["Bipolar", "Depresi", "Gangguan kecemasan"],
  },
  {
    type: "sensorik",
    title: "Disabilitas Sensorik",
    description: "Gangguan pendengaran, penglihatan, atau komunikasi",
    icon: "sensorik",
    color: "border-warning bg-warning/5",
    examples: ["Tuna netra", "Tuna rungu", "Gangguan bicara"],
  },
];

export const IBKSectionDisability = component$(() => {
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
          Pilih satu atau lebih jenis disabilitas yang sesuai (dummy, tidak
          dikirim ke backend)
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
                    {disability.examples.map((example, index) => (
                      <div key={index} class="badge badge-outline badge-sm">
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
                      </label>
                      <select
                        class="select select-bordered w-full"
                        value={details[type].tingkat_keparahan}
                        onChange$={(e) => {
                          details[type].tingkat_keparahan = (
                            e.target as HTMLSelectElement
                          ).value;
                        }}
                      >
                        <option value="ringan">Ringan</option>
                        <option value="sedang">Sedang</option>
                        <option value="berat">Berat</option>
                      </select>
                    </div>
                    <div>
                      <label class="label">
                        <span class="label-text font-semibold">
                          Sejak Kapan
                        </span>
                      </label>
                      <input
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="Sejak usia berapa atau kapan"
                        value={details[type].sejak_kapan}
                        onInput$={(e) => {
                          details[type].sejak_kapan = (
                            e.target as HTMLInputElement
                          ).value;
                        }}
                      />
                    </div>
                    <div>
                      <label class="label">
                        <span class="label-text font-semibold">
                          Deskripsi Kondisi
                        </span>
                      </label>
                      <textarea
                        class="textarea textarea-bordered w-full"
                        placeholder="Jelaskan kondisi disabilitas secara detail"
                        value={details[type].deskripsi_kondisi}
                        onInput$={(e) => {
                          details[type].deskripsi_kondisi = (
                            e.target as HTMLTextAreaElement
                          ).value;
                        }}
                      ></textarea>
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
});

export default IBKSectionDisability;
