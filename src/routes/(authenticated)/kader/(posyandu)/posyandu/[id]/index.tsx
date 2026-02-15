import { component$, useSignal, useTask$, useContext } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { getPosyanduDetail } from "~/services/api";
import { kaderDashboardService } from "~/services/dashboard.service";
import { statistikLaporanService } from "~/services/statistik-laporan.service";
import type { PosyanduDetail } from "~/types";
import type { KaderDashboardStats } from "~/services/dashboard.service";
import type { StatistikLaporanData } from "~/types/statistik-laporan";
import { extractErrorMessage } from "~/utils/error";
import { KaderStatCard } from "~/components/kader";
import {
  DashboardDonutChart,
  StatTrendChart,
  StatKehadiranTrend,
  StatDistributionBar,
} from "~/components/statistik";
import { queryClient, DEFAULT_STALE_TIME, SHORT_STALE_TIME } from "~/lib/query";
import {
  BreadcrumbContext,
  setBreadcrumbName,
} from "~/contexts/breadcrumb.context";
import {
  LuUser,
  LuMapPin,
  LuPhone,
  LuCalendar,
  LuUsers,
  LuActivity,
  LuLineChart,
  LuCheckCircle,
  LuArrowRight,
  LuBarChart,
  LuTrendingUp,
} from "~/components/icons/lucide-optimized";

const POSYANDU_KEY_PREFIX = "kader:posyandu";
const STATS_KEY_PREFIX = "kader:posyandu-stats";
const STATISTIK_KEY_PREFIX = "kader:statistik-laporan";

export default component$(() => {
  const loc = useLocation();
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<PosyanduDetail | null>(null);
  const stats = useSignal<KaderDashboardStats | null>(null);
  const statsLoading = useSignal(true);
  const statistikData = useSignal<StatistikLaporanData | null>(null);
  const statistikLoading = useSignal(true);
  const { isLoggedIn } = useAuth();
  const breadcrumbOverrides = useContext(BreadcrumbContext);

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    const idParam = track(() => loc.params.id);
    if (isLoggedIn.value && idParam) {
      error.value = null;

      // --- Posyandu Detail with caching ---
      const detailKey = queryClient.buildKey(
        POSYANDU_KEY_PREFIX,
        "detail",
        idParam,
      );
      const cachedDetail = queryClient.getQueryData<PosyanduDetail>(detailKey);
      if (cachedDetail) {
        data.value = cachedDetail;
        loading.value = false;

        setBreadcrumbName(
          breadcrumbOverrides,
          idParam,
          cachedDetail.nama_posyandu,
        );

        if (!queryClient.isFresh(detailKey)) {
          try {
            const res = await queryClient.fetchQuery(
              detailKey,
              () => getPosyanduDetail(idParam),
              DEFAULT_STALE_TIME,
            );
            data.value = res;
            queryClient.setQueryData(detailKey, res, DEFAULT_STALE_TIME);
            setBreadcrumbName(breadcrumbOverrides, idParam, res.nama_posyandu);
          } catch (err: unknown) {
            console.error("Background refetch posyandu detail failed:", err);
          }
        }
      } else {
        loading.value = true;
        try {
          const res = await queryClient.fetchQuery(
            detailKey,
            () => getPosyanduDetail(idParam),
            DEFAULT_STALE_TIME,
          );
          data.value = res;
          queryClient.setQueryData(detailKey, res, DEFAULT_STALE_TIME);
          setBreadcrumbName(breadcrumbOverrides, idParam, res.nama_posyandu);
        } catch (err: unknown) {
          error.value = extractErrorMessage(err as Error);
        } finally {
          loading.value = false;
        }
      }

      // --- Stats with caching ---
      const statsKey = queryClient.buildKey(STATS_KEY_PREFIX, idParam);
      const cachedStats =
        queryClient.getQueryData<KaderDashboardStats>(statsKey);
      if (cachedStats) {
        stats.value = cachedStats;
        statsLoading.value = false;

        if (!queryClient.isFresh(statsKey)) {
          try {
            const statsResult = await queryClient.fetchQuery(
              statsKey,
              () => kaderDashboardService.getStatsByPosyandu(idParam),
              DEFAULT_STALE_TIME,
            );
            stats.value = statsResult;
            queryClient.setQueryData(statsKey, statsResult, DEFAULT_STALE_TIME);
          } catch (statsErr) {
            console.error("Background refetch stats failed:", statsErr);
          }
        }
      } else {
        statsLoading.value = true;
        try {
          const statsResult = await queryClient.fetchQuery(
            statsKey,
            () => kaderDashboardService.getStatsByPosyandu(idParam),
            DEFAULT_STALE_TIME,
          );
          stats.value = statsResult;
          queryClient.setQueryData(statsKey, statsResult, DEFAULT_STALE_TIME);
        } catch (statsErr) {
          console.error("Error fetching stats:", statsErr);
        } finally {
          statsLoading.value = false;
        }
      }

      // --- Statistik Laporan with caching (for dashboard charts) ---
      const statistikKey = queryClient.buildKey(
        STATISTIK_KEY_PREFIX,
        idParam,
        "6_bulan",
      );
      const cachedStatistik =
        queryClient.getQueryData<StatistikLaporanData>(statistikKey);
      if (cachedStatistik) {
        statistikData.value = cachedStatistik;
        statistikLoading.value = false;

        if (!queryClient.isFresh(statistikKey)) {
          try {
            const statistikResult = await queryClient.fetchQuery(
              statistikKey,
              () =>
                statistikLaporanService.getStatistikLaporan(idParam, "6_bulan"),
              SHORT_STALE_TIME,
            );
            statistikData.value = statistikResult;
            queryClient.setQueryData(
              statistikKey,
              statistikResult,
              SHORT_STALE_TIME,
            );
          } catch (statistikErr) {
            console.error(
              "Background refetch statistik-laporan failed:",
              statistikErr,
            );
          }
        }
      } else {
        statistikLoading.value = true;
        try {
          const statistikResult = await queryClient.fetchQuery(
            statistikKey,
            () =>
              statistikLaporanService.getStatistikLaporan(idParam, "6_bulan"),
            SHORT_STALE_TIME,
          );
          statistikData.value = statistikResult;
          queryClient.setQueryData(
            statistikKey,
            statistikResult,
            SHORT_STALE_TIME,
          );
        } catch (statistikErr) {
          console.error("Error fetching statistik-laporan:", statistikErr);
        } finally {
          statistikLoading.value = false;
        }
      }
    }
  });

  const statusBadge = (
    <span class="badge badge-success badge-lg gap-2">Aktif</span>
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

        {/* ═══════════ STATISTIK KARTU UTAMA ═══════════ */}
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
            <KaderStatCard
              title="Total Anggota"
              value={stats.value.totalAnggota.toString()}
              icon={LuUsers}
              description="Anggota terdaftar"
            />
            <KaderStatCard
              title="Total IBK"
              value={stats.value.totalIbk.toString()}
              icon={LuActivity}
              description="Ibu dan balita terdaftar"
            />
            <KaderStatCard
              title="Kunjungan Bulan Ini"
              value={stats.value.kunjunganBulanIni.toString()}
              icon={LuCalendar}
              description="Total kunjungan"
            />
          </section>
        ) : (
          <div class="alert alert-warning mb-8">
            <span>Data statistik tidak tersedia</span>
          </div>
        )}

        {/* ═══════════ RINGKASAN STATISTIK TAMBAHAN ═══════════ */}
        {statistikLoading.value && (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} class="skeleton h-28 w-full rounded-2xl"></div>
            ))}
          </div>
        )}
        {!statistikLoading.value && statistikData.value?.ringkasan && (
          <section
            aria-label="Ringkasan tambahan"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-[fadeInUp_500ms_ease_100ms_both]"
          >
            <KaderStatCard
              title="Total Kegiatan"
              value={statistikData.value.ringkasan.totalKegiatan.toString()}
              icon={LuBarChart}
              description="Jadwal kegiatan posyandu"
            />
            <KaderStatCard
              title="Total Monitoring"
              value={statistikData.value.ringkasan.totalMonitoring.toString()}
              icon={LuTrendingUp}
              description="Catatan monitoring kunjungan"
            />
            <KaderStatCard
              title="Total Kader"
              value={statistikData.value.ringkasan.totalKader.toString()}
              icon={LuUser}
              description="Kader aktif di posyandu"
            />
            <KaderStatCard
              title="Kehadiran"
              value={`${statistikData.value.ringkasan.rataRataKehadiran}%`}
              icon={LuCheckCircle}
              description="Rata-rata tingkat kehadiran IBK"
            />
          </section>
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

        {/* ═══════════ INFO POSYANDU ═══════════ */}
        <div class="card bg-base-100 shadow-xl border border-base-200/50 relative mb-8">
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

        {/* ═══════════ GRAFIK VISUALISASI DASHBOARD ═══════════ */}
        <section aria-label="Grafik visualisasi" class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <LuLineChart class="w-6 h-6 text-primary" />
              <h2 class="text-xl lg:text-2xl font-bold text-base-content/90">
                Grafik & Visualisasi
              </h2>
            </div>
            {!loading.value && data.value && (
              <Link
                href={`/kader/posyandu/${data.value.id}/laporan-statistik`}
                class="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
              >
                Lihat Statistik Lengkap
                <LuArrowRight class="w-4 h-4" />
              </Link>
            )}
          </div>

          {statistikLoading.value ? (
            <div class="space-y-6">
              {/* Skeleton donut row */}
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} class="skeleton h-56 w-full rounded-2xl"></div>
                ))}
              </div>
              {/* Skeleton trend row */}
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} class="skeleton h-64 w-full rounded-2xl"></div>
                ))}
              </div>
            </div>
          ) : statistikData.value ? (
            <div class="space-y-6 animate-[fadeInUp_500ms_ease_200ms_both]">
              {/* Row 1: Donut Charts — demographic overview */}
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <DashboardDonutChart
                  title="Jenis Kelamin"
                  data={statistikData.value.demografiJenisKelamin}
                  emptyMessage="Belum ada data jenis kelamin"
                  centerLabel="Total"
                />
                <DashboardDonutChart
                  title="Jenis Disabilitas"
                  data={statistikData.value.disabilitasJenis}
                  emptyMessage="Belum ada data disabilitas"
                  centerLabel="Total"
                />
                <DashboardDonutChart
                  title="Kelompok Umur"
                  data={statistikData.value.demografiKelompokUmur}
                  emptyMessage="Belum ada data umur"
                  centerLabel="Total"
                />
              </div>

              {/* Row 2: ODGJ Status + Distribusi Presensi */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ODGJ Status Card */}
                <div class="card bg-base-100 shadow-md border border-base-200/50 flex flex-col h-full">
                  <div class="card-body p-5 flex flex-col min-h-0">
                    <h3 class="font-semibold text-base text-base-content/90 mb-4 shrink-0">
                      Status ODGJ
                    </h3>
                    {(() => {
                      const { odgj, nonOdgj, tidakDiketahui } =
                        statistikData.value!.kesehatanOdgj;
                      const total = odgj + nonOdgj + tidakDiketahui;

                      if (total === 0) {
                        return (
                          <div class="flex items-center justify-center flex-1 min-h-[8rem] text-base-content/40 text-sm">
                            Belum ada data kesehatan
                          </div>
                        );
                      }

                      const odgjPct =
                        total > 0 ? Math.round((odgj / total) * 1000) / 10 : 0;
                      const nonOdgjPct =
                        total > 0
                          ? Math.round((nonOdgj / total) * 1000) / 10
                          : 0;
                      const unknownPct =
                        total > 0
                          ? Math.round((tidakDiketahui / total) * 1000) / 10
                          : 0;

                      return (
                        <div class="space-y-4">
                          {/* Stacked bar */}
                          <div class="w-full h-6 rounded-full overflow-hidden flex bg-base-200/80">
                            {odgj > 0 && (
                              <div
                                class="bg-error h-full transition-all duration-500"
                                style={{ width: `${odgjPct}%` }}
                              ></div>
                            )}
                            {nonOdgj > 0 && (
                              <div
                                class="bg-success h-full transition-all duration-500"
                                style={{ width: `${nonOdgjPct}%` }}
                              ></div>
                            )}
                            {tidakDiketahui > 0 && (
                              <div
                                class="bg-base-300 h-full transition-all duration-500"
                                style={{ width: `${unknownPct}%` }}
                              ></div>
                            )}
                          </div>

                          {/* Legend */}
                          <div class="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <div class="flex items-center justify-center gap-1.5 mb-1">
                                <span class="inline-block w-2.5 h-2.5 rounded-sm bg-error"></span>
                                <span class="text-xs text-base-content/60">
                                  ODGJ
                                </span>
                              </div>
                              <div class="text-lg font-bold text-error tabular-nums">
                                {odgj}
                              </div>
                              <div class="text-[10px] text-base-content/40">
                                {odgjPct}%
                              </div>
                            </div>
                            <div>
                              <div class="flex items-center justify-center gap-1.5 mb-1">
                                <span class="inline-block w-2.5 h-2.5 rounded-sm bg-success"></span>
                                <span class="text-xs text-base-content/60">
                                  Non-ODGJ
                                </span>
                              </div>
                              <div class="text-lg font-bold text-success tabular-nums">
                                {nonOdgj}
                              </div>
                              <div class="text-[10px] text-base-content/40">
                                {nonOdgjPct}%
                              </div>
                            </div>
                            <div>
                              <div class="flex items-center justify-center gap-1.5 mb-1">
                                <span class="inline-block w-2.5 h-2.5 rounded-sm bg-base-300"></span>
                                <span class="text-xs text-base-content/60">
                                  N/A
                                </span>
                              </div>
                              <div class="text-lg font-bold text-base-content/50 tabular-nums">
                                {tidakDiketahui}
                              </div>
                              <div class="text-[10px] text-base-content/40">
                                {unknownPct}%
                              </div>
                            </div>
                          </div>

                          {/* Total */}
                          <div class="pt-2 border-t border-base-200/60 flex items-center justify-between">
                            <span class="text-xs font-medium text-base-content/50">
                              Total
                            </span>
                            <span class="text-xs font-bold text-base-content/70 tabular-nums">
                              {total}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <StatDistributionBar
                  title="Distribusi Presensi IBK"
                  data={statistikData.value.presensiDistribusi}
                  emptyMessage="Belum ada data presensi"
                />
              </div>

              {/* Row 3: Trend Charts */}
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatTrendChart
                  title="Pendaftaran IBK Baru (6 Bulan)"
                  data={statistikData.value.trendIbkBulanan}
                  barColor="bg-primary"
                  emptyMessage="Belum ada data pendaftaran"
                />
                <StatKehadiranTrend
                  title="Trend Kehadiran IBK (6 Bulan)"
                  data={statistikData.value.trendKehadiranBulanan}
                  emptyMessage="Belum ada data kehadiran"
                />
              </div>
            </div>
          ) : (
            <div class="card bg-base-100 shadow-md border border-base-200/50">
              <div class="card-body items-center text-center py-12">
                <LuLineChart class="w-12 h-12 text-base-content/20 mb-3" />
                <h3 class="text-base font-semibold text-base-content/60">
                  Data Visualisasi Tidak Tersedia
                </h3>
                <p class="text-base-content/40 text-sm max-w-md">
                  Mulai dengan menambahkan data IBK dan jadwal kegiatan untuk
                  melihat grafik dan visualisasi.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
});
