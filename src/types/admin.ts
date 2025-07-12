export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  no_telp: string;
  role: "admin" | "posyandu" | "psikolog";
  verification: "verified" | "unverified";
  created_at: string;
}

export interface ListUserResponse {
  data: User[];
  meta: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ListUserParams {
  limit?: number;
  page?: number;
  name?: string;
  orderBy?: string;
}
