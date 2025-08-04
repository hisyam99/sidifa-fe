import { QRL } from "@builder.io/qwik"; // FIX: Added $, QRL
import type { IBKRecord } from "~/types";

export interface IBKCardProps {
  ibk: IBKRecord;
  showActions?: boolean;
  onView$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  onEdit$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  compact?: boolean;
}

// (Remove all JSX and export, leave only the type and import if needed for detail/modal usage)
