import { component$, $, QRL } from "@qwik.dev/core"; // FIX: Added $, QRL
import type { IBKRecord } from "~/types";
import {
  LuUser,
  LuCalendar,
  LuMapPin,
  LuPhone,
  LuEye,
  LuPencil,
  LuHeart,
  LuClock,
  LuActivity,
} from "@qwikest/icons/lucide";

interface IBKCardProps {
  ibk: IBKRecord;
  showActions?: boolean;
  onView$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  onEdit$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  compact?: boolean;
}

export default component$<IBKCardProps>(
  ({ ibk, showActions = true, onView$, onEdit$, compact = false }) => {
    const { personal_data, disability_info, visit_history, status } = ibk;

    // Calculate age from birth date
    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age;
    };

    const age = calculateAge(personal_data.tanggal_lahir);
    const lastVisit = visit_history[visit_history.length - 1];

    // Get status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "badge-success";
        case "inactive":
          return "badge-warning";
        case "referred":
          return "badge-info";
        case "graduated":
          return "badge-primary";
        default:
          return "badge-neutral";
      }
    };

    // Get disability types display
    const disabilityTypes = disability_info?.jenis_disabilitas || [];

    return (
      <div
        class={`card bg-base-100 shadow-lg border border-base-200/50 hover:shadow-xl transition-all duration-300 ${compact ? "card-compact" : ""}`}
      >
        <div class="card-body">
          {/* Header */}
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="avatar placeholder">
                <div class="bg-gradient-primary rounded-full w-12 h-12 text-white flex items-center justify-center">
                  <LuUser class="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 class="card-title text-lg font-bold text-base-content">
                  {personal_data.nama_lengkap}
                </h3>
                <p class="text-sm text-base-content/70">
                  NIK: {personal_data.nik}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class={`badge ${getStatusColor(status)} badge-sm`}>
                {status === "active"
                  ? "Aktif"
                  : status === "inactive"
                    ? "Tidak Aktif"
                    : status === "referred"
                      ? "Dirujuk"
                      : "Lulus"}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <LuCalendar class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">Usia: {age} tahun</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <LuMapPin class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">
                {personal_data.kecamatan}
              </span>
            </div>

            {personal_data.no_telp && (
              <div class="flex items-center gap-2 text-sm">
                <LuPhone class="w-4 h-4 text-primary/70" />
                <span class="text-base-content/70">
                  {personal_data.no_telp}
                </span>
              </div>
            )}

            <div class="flex items-center gap-2 text-sm">
              <LuActivity class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">
                {ibk.total_kunjungan} kunjungan
              </span>
            </div>
          </div>

          {/* Disability Info */}
          {disabilityTypes.length > 0 && (
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <LuHeart class="w-4 h-4 text-secondary" />
                <span class="text-sm font-semibold text-base-content">
                  Jenis Disabilitas:
                </span>
              </div>
              <div class="flex flex-wrap gap-1">
                {disabilityTypes.map((type, index) => (
                  <div key={index} class="badge badge-secondary badge-sm">
                    {type === "fisik"
                      ? "Fisik"
                      : type === "intelektual"
                        ? "Intelektual"
                        : type === "mental"
                          ? "Mental"
                          : "Sensorik"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Visit Info */}
          {lastVisit && (
            <div class="bg-base-200/50 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2 mb-2">
                <LuClock class="w-4 h-4 text-accent" />
                <span class="text-sm font-semibold text-base-content">
                  Kunjungan Terakhir:
                </span>
              </div>
              <p class="text-sm text-base-content/80">
                {new Date(lastVisit.tanggal_kunjungan).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
              {lastVisit.keluhan_utama && (
                <p class="text-xs text-base-content/70 mt-1 line-clamp-2">
                  Keluhan: {lastVisit.keluhan_utama}
                </p>
              )}
            </div>
          )}

          {/* Next Visit */}
          {ibk.next_scheduled_visit && (
            <div class="alert alert-info alert-sm">
              <LuCalendar class="w-4 h-4" />
              <span class="text-sm">
                Kunjungan berikutnya:{" "}
                {new Date(ibk.next_scheduled_visit).toLocaleDateString("id-ID")}
              </span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div class="card-actions justify-end mt-4">
              {onView$ && (
                <button
                  class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10"
                  onClick$={$(() => onView$!(personal_data.id || ""))} // FIX: Wrapped in $()
                >
                  <LuEye class="w-4 h-4" />
                  Lihat Detail
                </button>
              )}
              {onEdit$ && (
                <button
                  class="btn btn-primary btn-sm gap-2"
                  onClick$={$(() => onEdit$!(personal_data.id || ""))} // FIX: Wrapped in $()
                >
                  <LuPencil class="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
