import { component$, $, QRL } from "@qwik.dev/core"; // FIX: Added $, QRL
import type { JobOpportunity } from "~/types";
import {
  LuBuilding,
  LuMapPin,
  LuDollarSign,
  LuHeart,
  LuWifi,
  LuCalendar,
  LuEye,
  LuExternalLink,
  LuAccessibility,
  LuStar,
  LuBriefcase,
} from "@qwikest/icons/lucide";

interface JobCardProps {
  job: JobOpportunity;
  showActions?: boolean;
  onView$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  onApply$?: QRL<(id: string) => void>; // FIX: Changed to QRL
  compact?: boolean;
  featured?: boolean;
}

export default component$<JobCardProps>(
  ({
    job,
    showActions = true,
    onView$,
    onApply$,
    compact = false,
    featured = false,
  }) => {
    // Format salary range
    const formatSalary = (
      min?: number,
      max?: number,
      currency: string = "IDR",
    ) => {
      if (!min && !max) return "Gaji dapat dinegosiasi";

      const formatNumber = (num: number) => {
        if (num >= 1000000) {
          return `${(num / 1000000).toFixed(1)}jt`;
        } else if (num >= 1000) {
          return `${num / 1000}rb`;
        }
        return num.toString();
      };

      const currencySymbol = currency === "IDR" ? "Rp " : "$";

      if (min && max) {
        return `${currencySymbol}${formatNumber(min)} - ${formatNumber(max)}`;
      } else if (min) {
        return `${currencySymbol}${formatNumber(min)}+`;
      } else {
        return `Up to ${currencySymbol}${formatNumber(max!)}`;
      }
    };

    // Get job type display
    const getJobTypeDisplay = (type: string) => {
      switch (type) {
        case "full_time":
          return "Full Time";
        case "part_time":
          return "Part Time";
        case "internship":
          return "Magang";
        case "freelance":
          return "Freelance";
        case "volunteer":
          return "Sukarela";
        default:
          return type;
      }
    };

    // Get disability friendly level color
    const getDisabilityFriendlyColor = (level: string) => {
      switch (level) {
        case "sangat_ramah":
          return "bg-success text-success-content";
        case "ramah":
          return "bg-primary text-primary-content";
        case "cukup_ramah":
          return "bg-warning text-warning-content";
        case "perlu_adaptasi":
          return "bg-info text-info-content";
        default:
          return "bg-neutral text-neutral-content";
      }
    };

    // Get disability friendly level text
    const getDisabilityFriendlyText = (level: string) => {
      switch (level) {
        case "sangat_ramah":
          return "Sangat Ramah Disabilitas";
        case "ramah":
          return "Ramah Disabilitas";
        case "cukup_ramah":
          return "Cukup Ramah";
        case "perlu_adaptasi":
          return "Perlu Adaptasi";
        default:
          return level;
      }
    };

    const salaryText = formatSalary(job.gaji_min, job.gaji_max, job.mata_uang);
    const jobTypeText = getJobTypeDisplay(job.tipe_pekerjaan);
    const isExpired =
      job.deadline_aplikasi && new Date(job.deadline_aplikasi) < new Date();

    return (
      <div
        class={`card bg-base-100 shadow-lg border border-base-200/50 hover:shadow-xl transition-all duration-300 ${
          featured
            ? "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-base-100"
            : ""
        } ${compact ? "card-compact" : ""}`}
      >
        <div class="card-body">
          {/* Header */}
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1">
              {job.logo_perusahaan ? (
                <img
                  src={job.logo_perusahaan}
                  alt={job.nama_perusahaan}
                  width="48"
                  height="48"
                  class="w-12 h-12 rounded-lg object-cover border border-base-200"
                />
              ) : (
                <div class="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <LuBuilding class="w-6 h-6 text-white" />
                </div>
              )}

              <div class="flex-1 min-w-0">
                <h3 class="card-title text-lg font-bold text-base-content line-clamp-2">
                  {job.judul}
                </h3>
                <p class="text-sm text-base-content/70 font-medium">
                  {job.nama_perusahaan}
                </p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
              {featured && (
                <div class="badge badge-primary badge-sm gap-1">
                  <LuStar class="w-3 h-3" />
                  Featured
                </div>
              )}

              <div
                class={`badge badge-sm ${getDisabilityFriendlyColor(job.tingkat_ramah_disabilitas)}`}
              >
                <LuAccessibility class="w-3 h-3 mr-1" />
                {getDisabilityFriendlyText(job.tingkat_ramah_disabilitas)}
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <LuMapPin class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">{job.lokasi}</span>
              {job.remote_friendly && (
                <div class="badge badge-ghost badge-xs gap-1">
                  <LuWifi class="w-3 h-3" />
                  Remote OK
                </div>
              )}
            </div>

            <div class="flex items-center gap-2 text-sm">
              <LuBriefcase class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">{jobTypeText}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <LuDollarSign class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">{salaryText}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <LuEye class="w-4 h-4 text-primary/70" />
              <span class="text-base-content/70">{job.views} dilihat</span>
            </div>
          </div>

          {/* Job Description */}
          <div class="mb-4">
            <p class="text-sm text-base-content/80 line-clamp-3 leading-relaxed">
              {job.deskripsi}
            </p>
          </div>

          {/* Disability Accommodations */}
          {job.jenis_disabilitas_cocok.length > 0 && (
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <LuHeart class="w-4 h-4 text-secondary" />
                <span class="text-sm font-semibold text-base-content">
                  Cocok untuk:
                </span>
              </div>
              <div class="flex flex-wrap gap-1">
                {job.jenis_disabilitas_cocok.map((type, index) => (
                  <div key={index} class="badge badge-secondary badge-sm">
                    {type === "fisik"
                      ? "Disabilitas Fisik"
                      : type === "intelektual"
                        ? "Disabilitas Intelektual"
                        : type === "mental"
                          ? "Disabilitas Mental"
                          : "Disabilitas Sensorik"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {job.fasilitas_pendukung.length > 0 && (
            <div class="mb-4">
              <div class="text-sm text-base-content/70">
                <span class="font-medium">Fasilitas: </span>
                {job.fasilitas_pendukung.slice(0, 3).join(", ")}
                {job.fasilitas_pendukung.length > 3 &&
                  ` +${job.fasilitas_pendukung.length - 3} lainnya`}
              </div>
            </div>
          )}

          {/* Deadline Warning */}
          {job.deadline_aplikasi && (
            <div
              class={`alert alert-sm ${
                isExpired
                  ? "alert-error"
                  : new Date(job.deadline_aplikasi).getTime() -
                        new Date().getTime() <
                      7 * 24 * 60 * 60 * 1000
                    ? "alert-warning"
                    : "alert-info"
              }`}
            >
              <LuCalendar class="w-4 h-4" />
              <span class="text-sm">
                {isExpired
                  ? "Pendaftaran telah ditutup"
                  : `Deadline: ${new Date(job.deadline_aplikasi).toLocaleDateString("id-ID")}`}
              </span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div class="card-actions justify-end mt-4">
              {onView$ && (
                <button
                  class="btn btn-ghost btn-sm gap-2 hover:bg-primary/10"
                  onClick$={$(() => onView$!(job.id))} // FIX: Wrapped in $()
                >
                  <LuEye class="w-4 h-4" />
                  Detail
                </button>
              )}

              {!isExpired && job.status === "active" && onApply$ && (
                <button
                  class="btn btn-primary btn-sm gap-2"
                  onClick$={$(() => onApply$!(job.id))} // FIX: Wrapped in $()
                >
                  <LuExternalLink class="w-4 h-4" />
                  Lamar
                </button>
              )}
            </div>
          )}

          {/* Status Indicators */}
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-base-200/50">
            <div class="flex items-center gap-4 text-xs text-base-content/60">
              <span>
                Diposting:{" "}
                {new Date(job.tanggal_posting).toLocaleDateString("id-ID")}
              </span>
              {job.aplikasi_diterima > 0 && (
                <span>{job.aplikasi_diterima} aplikasi diterima</span>
              )}
            </div>

            <div
              class={`badge badge-xs ${
                job.status === "active"
                  ? "badge-success"
                  : job.status === "closed"
                    ? "badge-error"
                    : "badge-warning"
              }`}
            >
              {job.status === "active"
                ? "Aktif"
                : job.status === "closed"
                  ? "Ditutup"
                  : "Berakhir"}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
