export interface AdminVerificationItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "posyandu" | "psikolog";
  verification: "verified" | "unverified";
  // Add other relevant properties like document details, etc.
}

export interface AdminVerificationFilterOptions {
  name?: string;
  role?: "admin" | "posyandu" | "psikolog" | "";
  orderBy?: "asc" | "desc" | "";
}

export interface AdminVerificationFilterControlsProps {
  filterOptions: Signal<AdminVerificationFilterOptions>;
  onFilterChange$: QRL<() => void>;
  limit: Signal<number>;
  onLimitChange$: QRL<(newLimit: number) => void>;
}
