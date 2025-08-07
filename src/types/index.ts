// Re-export all types from different modules
export * from "./auth";
export * from "./admin";
export * from "./ibk";
export * from "./content";
export * from "./jadwal-posyandu";
export * from "./presensi-ibk";

// Additional utility types that might be useful across the app
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  meta: PaginationMeta;
}

// Common filter and search types
export interface BaseFilters {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
}

export interface DateRangeFilter {
  dari?: string;
  sampai?: string;
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface UploadResponse {
  success: boolean;
  data: FileUpload;
  message?: string;
}

// Notification types
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipient_id: string;
  recipient_role: string;
  read: boolean;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

// Dashboard summary types
export interface DashboardSummary {
  user_role: string;
  summary_data: Record<string, any>;
  recent_activities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: string;
  }>;
  notifications_unread: number;
  last_updated: string;
}

export interface PosyanduDetail {
  id: string;
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  users_id: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}
