interface JobItem {
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  description?: string; // Optional: for full job description
}

export const jobsData: JobItem[] = [
  {
    title: "Admin Entry Data",
    company: "PT Maju Terus",
    location: "Jakarta",
    type: "Remote",
    tags: ["Disabilitas Fisik", "Tuna Daksa"],
  },
  {
    title: "Desainer Grafis",
    company: "Creative Studio",
    location: "Bandung",
    type: "Full-time",
    tags: ["Tuna Rungu", "Tuna Wicara"],
  },
  {
    title: "Operator Jahit",
    company: "Garment Sejahtera",
    location: "Surabaya",
    type: "Full-time",
    tags: ["Semua Disabilitas"],
  },
];
