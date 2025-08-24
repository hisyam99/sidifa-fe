export const ID_TO_TYPE: Record<string, string> = {
  "b8afb93f-0232-45b7-9c9f-c2063215a8f2": "fisik",
  "889c26c0-1624-4280-aa05-f28ae71816db": "intelektual",
  "6f469ea4-974a-4240-b062-693acbd47d17": "mental_psikososial",
  "9e8c9f6d-3e05-4b62-a9df-768effa0316d": "mental_perkembangan",
  "712e4398-c116-4040-a762-bd3bc44ab835": "pendengaran",
  "f1e2d3c4-b5a6-9870-5432-109876fedcba": "wicara",
};

export const TYPE_TO_ID: Record<string, string> = {
  fisik: "b8afb93f-0232-45b7-9c9f-c2063215a8f2",
  intelektual: "889c26c0-1624-4280-aa05-f28ae71816db",
  mental_psikososial: "6f469ea4-974a-4240-b062-693acbd47d17",
  mental_perkembangan: "9e8c9f6d-3e05-4b62-a9df-768effa0316d",
  pendengaran: "712e4398-c116-4040-a762-bd3bc44ab835",
  wicara: "f1e2d3c4-b5a6-9870-5432-109876fedcba",
};

export interface DisabilityType {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

export const disabilityTypes: DisabilityType[] = [
  {
    type: "fisik",
    title: "Disabilitas Fisik",
    description:
      "Antara lain akibat amputasi, lumpuh layuh atau kaku, paraplegi, celebral palsy (CP), akibat stroke, akibat kusta, dan orang kecil.",
    icon: "fisik",
    color: "border-primary bg-primary/5",
    examples: [
      "Amputasi",
      "Lumpuh layuh",
      "Paraplegi",
      "CP",
      "Stroke",
      "Kusta",
      "Orang kecil",
    ],
  },
  {
    type: "intelektual",
    title: "Disabilitas Intelektual",
    description:
      "Antara lain lambat belajar, disabilitas grahita dan down syndrom.",
    icon: "intelektual",
    color: "border-secondary bg-secondary/5",
    examples: ["Lambat belajar", "Disabilitas grahita", "Down syndrom"],
  },
  {
    type: "mental_psikososial",
    title: "Disabilitas Mental Psikososial",
    description:
      "Di antaranya skizofrenia, bipolar, depresi, anxietas, dan gangguan kepribadian.",
    icon: "mental",
    color: "border-accent bg-accent/5",
    examples: [
      "Skizofrenia",
      "Bipolar",
      "Depresi",
      "Anxietas",
      "Gangguan kepribadian",
    ],
  },
  {
    type: "mental_perkembangan",
    title: "Disabilitas Mental Perkembangan",
    description: "Autis, ADHD, dll.",
    icon: "mental",
    color: "border-accent bg-accent/5",
    examples: ["Autis", "ADHD"],
  },
  {
    type: "pendengaran",
    title: "Disabilitas Pendengaran (Tuli)",
    description: "Gangguan atau kehilangan fungsi pendengaran.",
    icon: "sensorik",
    color: "border-warning bg-warning/5",
    examples: ["Tuna rungu", "Gangguan pendengaran"],
  },
  {
    type: "wicara",
    title: "Disabilitas Wicara",
    description: "Gangguan dalam berkomunikasi verbal atau kemampuan bicara.",
    icon: "sensorik",
    color: "border-warning bg-warning/5",
    examples: ["Gangguan bicara", "Gangguan komunikasi verbal"],
  },
];
