import { LuHeart, LuBrain, LuUser } from "~/components/icons/lucide-optimized"; // Updated import path

export const getRoleDisplayName = (role?: string): string => {
  switch (role) {
    case "kader":
      return "Kader Posyandu";
    case "psikolog":
      return "Psikolog";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};

export const getBadgeClass = (changeType: string): string => {
  switch (changeType) {
    case "positive":
      return "badge-success";
    case "negative":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export const getActivityTypeClass = (type: string): string => {
  switch (type) {
    case "success":
      return "bg-success/10 text-success";
    case "warning":
      return "bg-warning/10 text-warning";
    default:
      return "bg-info/10 text-info";
  }
};

export const getRoleIcon = (role?: string): any => {
  switch (role) {
    case "kader":
      return LuHeart;
    case "psikolog":
      return LuBrain;
    default:
      return LuUser;
  }
};

export const getRoleColor = (role?: string): string => {
  switch (role) {
    case "kader":
      return "bg-gradient-primary";
    case "psikolog":
      return "bg-gradient-secondary";
    case "admin":
      return "bg-gradient-accent"; // Atau warna lain untuk admin
    default:
      return "bg-gradient-accent";
  }
};
