import {
  LuActivity,
  LuBrain,
  LuHeart,
  LuEye,
  LuCheck,
  LuInfo,
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

export function IBKSectionDisability() {
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
          return (
            <div
              key={disability.type}
              class={`card cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${disability.color}`}
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
                  {/* Dummy toggle, tidak update state */}
                  <LuCheck class="w-6 h-6 text-success opacity-30" />
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
    </div>
  );
}

export default IBKSectionDisability;
