export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Psikolog" | "Kader Posyandu" | string; // Use string for general case
  status: "Aktif" | "Tidak Aktif" | string; // Use string for general case
}

export interface RoleFilterOption {
  label: string;
  value: string;
}
