export interface AdminVerificationItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "posyandu" | "psikolog";
  status: "verified" | "unverified";
  // Add other relevant properties like document details, etc.
}

export interface AdminVerificationFilterOptions {
  name?: string;
  role?: "admin" | "posyandu" | "psikolog" | "";
  status?: "verified" | "unverified" | "";
}
