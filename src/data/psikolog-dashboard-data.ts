export interface AppointmentItem {
  name: string;
  time: string;
  type: string;
}

export interface HandledIBKItem {
  id: string;
  name: string;
  last_session: string;
}

export const upcomingAppointmentsData: AppointmentItem[] = [
  { name: "Andi Pratama", time: "10:00 - 11:00", type: "Konsultasi Awal" },
  { name: "Sari Dewi", time: "13:00 - 14:00", type: "Asesmen Lanjutan" },
];

export const handledIBKData: HandledIBKItem[] = [
  { id: "IBK-001", name: "Budi Cahyono", last_session: "10 Des 2024" },
  { id: "IBK-007", name: "Rina Amelia", last_session: "12 Des 2024" },
];
