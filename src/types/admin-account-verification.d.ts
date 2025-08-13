export interface AdminVerificationItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "posyandu" | "psikolog";
  status: "verified" | "unverified" | "declined";
  requested_at: string;
  verified_at?: string | null;
}

export interface AdminVerificationFilterOptions {
  [key: string]: unknown;
  name?: string;
  role?: "admin" | "posyandu" | "psikolog" | "";
  status?: "verified" | "unverified" | "declined" | "";
  orderBy?: "asc" | "desc" | "";
}

export interface AdminVerificationFilterControlsProps {
  filterOptions: Signal<AdminVerificationFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit: Signal<number>;
  onLimitChange$: QRL<(newLimit: number) => void>;
}
