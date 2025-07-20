export interface AssessmentReportItem {
  id: string;
  patient: string;
  date: string;
  status: "Selesai" | "Draft" | "Menunggu Tinjauan";
}

export const assessmentReportsData: AssessmentReportItem[] = [
  {
    id: "LAP-0012",
    patient: "Budi Cahyono",
    date: "10 Des 2024",
    status: "Selesai",
  },
  {
    id: "LAP-0011",
    patient: "Rina Amelia",
    date: "12 Des 2024",
    status: "Selesai",
  },
  {
    id: "LAP-0010",
    patient: "Andi Pratama",
    date: "05 Des 2024",
    status: "Selesai",
  },
];

export const patientsListForForm: string[] = [
  "Andi Pratama",
  "Sari Dewi",
  "Budi Cahyono",
  "Rina Amelia",
];
