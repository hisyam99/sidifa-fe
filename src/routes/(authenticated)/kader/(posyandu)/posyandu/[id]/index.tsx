import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { getPosyanduDetail } from "~/services/api";
import { kaderDashboardService } from "~/services/dashboard.service";
import type { PosyanduDetail } from "~/types";
import type { KaderDashboardStats } from "~/services/dashboard.service";
import { extractErrorMessage } from "~/utils/error";
import { KaderStatCard } from "~/components/kader";
import {
  LuUser,
  LuMapPin,
  LuPhone,
  LuCalendar,
  LuUsers,
  LuActivity,
  LuArrowRight,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const loc = useLocation();
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<PosyanduDetail | null>(null);
  const stats = useSignal<KaderDashboardStats | null>(null);
  const statsLoading = useSignal(true);
  const { isLoggedIn } = useAuth();

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    const idParam = track(() => loc.params.id);
    if (isLoggedIn.value && idParam) {
      loading.value = true;
      statsLoading.value = true;
      error.value = null;

      try {
        // Fetch posyandu detail
        const res = await getPosyanduDetail(idParam);
        data.value = res;

        // Fetch stats
        try {
          const statsData =
            await kaderDashboardService.getStatsByPosyandu(idParam);
          stats.value = statsData;
        } catch (statsErr) {
          console.error("Error fetching stats:", statsErr);
          // Stats error doesn't block main content
        } finally {
          statsLoading.value = false;
        }
      } catch (err: unknown) {
        error.value = extractErrorMessage(err as Error);
      } finally {
        loading.value = false;
      }
    }
  });

  const statusBadge = (
    <span class="badge badge-success badge-lg gap-2">Aktif</span>
  );

  const userInfo = (userId: string) => (
    <div class="flex items-center gap-2 mt-2">
      <LuUser class="w-4 h-4 text-primary" />
      <span class="text-xs text-base-content/70">User ID: {userId}</span>
    </div>
  );

  return (
    <div class="">
      <div class="container mx-auto">
        {/* Judul dan subjudul */}
        <div class="mb-8">
          <h1 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-2">
            Dashboard Posyandu
          </h1>
          <p class="text-base-content/70 text-lg">
            Informasi lengkap, statistik, dan aksi untuk posyandu ini
          </p>
        </div>

        {/* Statistik grid */}
        {statsLoading.value ? (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} class="skeleton h-32 w-full rounded-2xl"></div>
            ))}
          </div>
        ) : stats.value ? (
          <section
            aria-label="Statistik posyandu"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-[fadeInUp_500ms_ease_0ms_both]"
          >
            <div style={{ animationDelay: "0ms" }} class="contents">
              <KaderStatCard
                title="Total Anggota"
                value={stats.value.totalAnggota.toString()}
                icon={LuUsers}
                description="Anggota terdaftar"
              />
            </div>
            <div style={{ animationDelay: "60ms" }} class="contents">
              <KaderStatCard
                title="Total IBK"
                value={stats.value.totalIbk.toString()}
                icon={LuActivity}
                description="Ibu dan balita terdaftar"
              />
            </div>
            <div style={{ animationDelay: "120ms" }} class="contents">
              <KaderStatCard
                title="Kunjungan Bulan Ini"
                value={stats.value.kunjunganBulanIni.toString()}
                icon={LuCalendar}
                description="Total kunjungan"
              />
            </div>
          </section>
        ) : (
          <div class="alert alert-warning mb-8">
            <span>Data statistik tidak tersedia</span>
          </div>
        )}

        {/* Tombol Tambah IBK */}
        <div class="flex justify-end mb-4">
          {loading.value ? (
            <div class="skeleton h-10 w-36"></div>
          ) : (
            <Link
              href={`/kader/posyandu/${data.value?.id}/ibk/create`}
              class="btn btn-primary gap-2"
            >
              Tambah IBK
            </Link>
          )}
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-200/50 relative">
          <div class="card-body p-6 lg:p-8">
            {error.value && (
              <div class="alert alert-error mb-4" role="alert">
                {error.value}
              </div>
            )}
            {(loading.value || (data.value && !error.value)) && (
              <>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <span class="avatar placeholder">
                        {loading.value ? (
                          <div class="skeleton rounded-full w-14 h-14"></div>
                        ) : (
                          <div class="bg-gradient-primary rounded-full w-14 h-14 text-white flex items-center justify-center">
                            <LuUser class="w-8 h-8" />
                          </div>
                        )}
                      </span>
                      <div>
                        {loading.value ? (
                          <>
                            <div class="skeleton h-6 w-48 mb-2"></div>
                            <div class="skeleton h-5 w-24"></div>
                          </>
                        ) : (
                          <>
                            <h2 class="card-title text-2xl font-bold text-base-content mb-1">
                              {data.value!.nama_posyandu}
                            </h2>
                            {statusBadge}
                          </>
                        )}
                      </div>
                    </div>
                    {loading.value ? (
                      <div class="skeleton h-4 w-40 mt-2"></div>
                    ) : (
                      userInfo(data.value!.users_id)
                    )}
                  </div>
                  <div class="flex flex-col gap-2 text-sm text-base-content/70">
                    <div class="flex items-center gap-2">
                      <LuMapPin class="w-5 h-5 text-primary" />
                      {loading.value ? (
                        <div class="skeleton h-4 w-64"></div>
                      ) : (
                        <span>{data.value!.alamat}</span>
                      )}
                    </div>
                    <div class="flex items-center gap-2">
                      <LuPhone class="w-5 h-5 text-primary" />
                      {loading.value ? (
                        <div class="skeleton h-4 w-40"></div>
                      ) : (
                        <span>{data.value!.no_telp}</span>
                      )}
                    </div>
                    <div class="flex items-center gap-2">
                      <LuCalendar class="w-5 h-5 text-primary" />
                      {loading.value ? (
                        <div class="skeleton h-4 w-56"></div>
                      ) : (
                        <span>
                          Dibuat:{" "}
                          {new Date(data.value!.created_at).toLocaleString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                    <div class="flex items-center gap-2">
                      <LuArrowRight class="w-5 h-5 text-primary" />
                      {loading.value ? (
                        <div class="skeleton h-4 w-44"></div>
                      ) : (
                        <span>ID: {data.value!.id}</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {!data.value && !error.value && !loading.value && (
              <div class="alert alert-warning" role="alert">
                Data tidak ditemukan atau tidak tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
