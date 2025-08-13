export interface AdminVerificationItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "posyandu" | "psikolog";
  verification: "verified" | "unverified" | "declined";
  // Add other relevant properties like document details, etc.
}

export interface AdminVerificationFilterOptions {
  name?: string;
  role?: "admin" | "posyandu" | "psikolog" | "";
  verification?: "verified" | "unverified" | "declined" | "";
  orderBy?: "asc" | "desc" | "";
}

export interface AdminVerificationFilterControlsProps {
  filterOptions: Signal<AdminVerificationFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit: Signal<number>;
  onLimitChange$: QRL<(newLimit: number) => void>;
}
