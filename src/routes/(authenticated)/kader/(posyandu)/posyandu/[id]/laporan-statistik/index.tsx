import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { statistikLaporanService } from "~/services/statistik-laporan.service";
import type {
  StatistikLaporanData,
  PeriodeFilter,
} from "~/types/statistik-laporan";
import { extractErrorMessage } from "~/utils/error";
import { queryClient, SHORT_STALE_TIME } from "~/lib/query";

const KEY_PREFIX = "kader:statistik-laporan";
import { KaderStatCard } from "~/components/kader";
import {
  StatDistributionBar,
  StatTrendChart,
  StatKehadiranTrend,
} from "~/components/statistik";
import {
  LuUsers,
  LuCalendar,
  LuActivity,
  LuUser,
  LuCheckCircle,
  LuFilter,
  LuLineChart,
  LuHeart,
  LuBrain,
  LuClipboardList,
  LuTrendingUp,
  LuBarChart,
  LuDownload,
} from "~/components/icons/lucide-optimized";

const PERIODE_OPTIONS: { value: PeriodeFilter; label: string }[] = [
  { value: "semua", label: "Semua Waktu" },
  { value: "tahun_ini", label: "Tahun Ini" },
  { value: "6_bulan", label: "6 Bulan Terakhir" },
  { value: "3_bulan", label: "3 Bulan Terakhir" },
  { value: "bulan_ini", label: "Bulan Ini" },
];

export default component$(() => {
  const loc = useLocation();
  const { isLoggedIn } = useAuth();

  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<StatistikLaporanData | null>(null);
  const periode = useSignal<PeriodeFilter>("semua");

  const fetchData = $(async (posyanduId: string, p: PeriodeFilter) => {
    error.value = null;

    const key = queryClient.buildKey(KEY_PREFIX, posyanduId, p);

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<StatistikLaporanData>(key);
    if (cached) {
      data.value = cached;
      loading.value = false;

      // If data is still fresh, skip the network request entirely
      if (queryClient.isFresh(key)) return;

      // Background refetch (no loading spinner)
      try {
        const result = await queryClient.fetchQuery(
          key,
          () => statistikLaporanService.getStatistikLaporan(posyanduId, p),
          SHORT_STALE_TIME,
        );
        queryClient.setQueryData(key, result, SHORT_STALE_TIME);
        data.value = result;
      } catch (err: unknown) {
        console.error("Background refetch statistik-laporan failed:", err);
      }
      return;
    }

    // No cached data — show loading spinner
    loading.value = true;
    try {
      const result = await queryClient.fetchQuery(
        key,
        () => statistikLaporanService.getStatistikLaporan(posyanduId, p),
        SHORT_STALE_TIME,
      );
      queryClient.setQueryData(key, result, SHORT_STALE_TIME);
      data.value = result;
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as Error);
    } finally {
      loading.value = false;
    }
  });

  // Initial load
  useTask$(async ({ track }) => {
    track(isLoggedIn);
    const idParam = track(() => loc.params.id);
    if (isLoggedIn.value && idParam) {
      await fetchData(idParam, periode.value);
    }
  });

  const handlePeriodeChange = $(async (newPeriode: PeriodeFilter) => {
    periode.value = newPeriode;
    const idParam = loc.params.id;
    if (idParam) {
      // Invalidate old periode cache to force fresh fetch for new filter
      queryClient.invalidateQueries(
        queryClient.buildKey(KEY_PREFIX, idParam, newPeriode),
      );
      await fetchData(idParam, newPeriode);
    }
  });

  const handlePrint = $(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  });

  const stats = data.value;
  const ringkasan = stats?.ringkasan;

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-base-content flex items-center gap-3">
            <LuLineChart class="w-7 h-7 text-primary" />
            Laporan & Statistik
          </h1>
          <p class="text-base-content/60 mt-1">
            Analisis data lengkap posyandu
          </p>
        </div>
        <button
          class="btn btn-primary btn-sm gap-2 print:hidden"
          onClick$={handlePrint}
        >
          <LuDownload class="w-4 h-4" />
          Cetak Laporan
        </button>
      </div>

      {/* Period Filter */}
      <div class="card bg-base-100 shadow-md border border-base-200/50 print:hidden">
        <div class="card-body p-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <div class="flex items-center gap-2 text-base-content/70">
              <LuFilter class="w-4 h-4 text-primary" />
              <span class="text-sm font-medium">Periode:</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              {PERIODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  class={`btn btn-xs transition-all duration-200 ${
                    periode.value === opt.value
                      ? "btn-primary"
                      : "btn-ghost bg-base-200/60 hover:bg-base-200"
                  }`}
                  onClick$={() => handlePeriodeChange(opt.value)}
                  disabled={loading.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error.value && (
        <div class="alert alert-error shadow-md" role="alert">
          <span>{error.value}</span>
        </div>
      )}

      {/* Loading State */}
      {loading.value && (
        <div class="space-y-6">
          {/* Skeleton cards */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} class="skeleton h-28 w-full rounded-2xl"></div>
            ))}
          </div>
          {/* Skeleton charts */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} class="skeleton h-64 w-full rounded-2xl"></div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading.value && stats && ringkasan && (
        <>
          {/* ════════════════ RINGKASAN ════════════════ */}
          <section aria-label="Ringkasan statistik">
            <div class="flex items-center gap-2 mb-4">
              <LuBarChart class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">Ringkasan</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <KaderStatCard
                title="Total IBK"
                value={ringkasan.totalIbk.toString()}
                icon={LuUsers}
                description="Individu berkebutuhan khusus terdaftar"
              />
              <KaderStatCard
                title="Total Kegiatan"
                value={ringkasan.totalKegiatan.toString()}
                icon={LuCalendar}
                description="Jadwal kegiatan posyandu"
              />
              <KaderStatCard
                title="Total Monitoring"
                value={ringkasan.totalMonitoring.toString()}
                icon={LuActivity}
                description="Catatan monitoring kunjungan"
              />
              <KaderStatCard
                title="Total Kader"
                value={ringkasan.totalKader.toString()}
                icon={LuUser}
                description="Kader aktif di posyandu"
              />
              <KaderStatCard
                title="Kehadiran"
                value={`${ringkasan.rataRataKehadiran}%`}
                icon={LuCheckCircle}
                description="Rata-rata tingkat kehadiran IBK"
              />
            </div>
          </section>

          {/* ════════════════ DEMOGRAFI IBK ════════════════ */}
          <section aria-label="Demografi IBK">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuUsers class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">
                Demografi IBK
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <StatDistributionBar
                title="Jenis Kelamin"
                data={stats.demografiJenisKelamin}
                emptyMessage="Belum ada data jenis kelamin"
              />
              <StatDistributionBar
                title="Kelompok Umur"
                data={stats.demografiKelompokUmur}
                emptyMessage="Belum ada data umur"
              />
              <StatDistributionBar
                title="Agama"
                data={stats.demografiAgama}
                emptyMessage="Belum ada data agama"
              />
              <StatDistributionBar
                title="Pendidikan"
                data={stats.demografiPendidikan}
                emptyMessage="Belum ada data pendidikan"
              />
              <StatDistributionBar
                title="Pekerjaan"
                data={stats.demografiPekerjaan}
                emptyMessage="Belum ada data pekerjaan"
              />
              <StatDistributionBar
                title="Status Perkawinan"
                data={stats.demografiStatusPerkawinan}
                emptyMessage="Belum ada data status perkawinan"
              />
            </div>
          </section>

          {/* ════════════════ DISABILITAS ════════════════ */}
          <section aria-label="Statistik disabilitas">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuClipboardList class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">
                Disabilitas
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatDistributionBar
                title="Jenis Disabilitas"
                data={stats.disabilitasJenis}
                emptyMessage="Belum ada data disabilitas"
              />
              <StatDistributionBar
                title="Tingkat Keparahan"
                data={stats.disabilitasTingkatKeparahan}
                emptyMessage="Belum ada data tingkat keparahan"
              />
            </div>
          </section>

          {/* ════════════════ KESEHATAN ════════════════ */}
          <section aria-label="Statistik kesehatan">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuHeart class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">Kesehatan</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ODGJ Card */}
              <div class="card bg-base-100 shadow-md border border-base-200/50">
                <div class="card-body p-5">
                  <h3 class="font-semibold text-base text-base-content/90 mb-4">
                    Status ODGJ
                  </h3>
                  {(() => {
                    const { odgj, nonOdgj, tidakDiketahui } =
                      stats.kesehatanOdgj;
                    const total = odgj + nonOdgj + tidakDiketahui;

                    if (total === 0) {
                      return (
                        <div class="flex items-center justify-center h-32 text-base-content/40 text-sm">
                          Belum ada data kesehatan
                        </div>
                      );
                    }

                    const odgjPct =
                      total > 0 ? Math.round((odgj / total) * 1000) / 10 : 0;
                    const nonOdgjPct =
                      total > 0 ? Math.round((nonOdgj / total) * 1000) / 10 : 0;
                    const unknownPct =
                      total > 0
                        ? Math.round((tidakDiketahui / total) * 1000) / 10
                        : 0;

                    return (
                      <div class="space-y-4">
                        {/* Stacked bar overview */}
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
                title="Jenis Bantuan Kesehatan"
                data={stats.kesehatanJenisBantuan}
                emptyMessage="Belum ada data jenis bantuan"
              />
            </div>
          </section>

          {/* ════════════════ ASESMEN PSIKOLOGI ════════════════ */}
          <section aria-label="Statistik asesmen">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuBrain class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">
                Asesmen Psikologi
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatDistributionBar
                title="Kategori IQ"
                data={stats.assesmenKategoriIq}
                emptyMessage="Belum ada data asesmen IQ"
              />
              <StatDistributionBar
                title="Distribusi Presensi IBK"
                data={stats.presensiDistribusi}
                emptyMessage="Belum ada data presensi"
              />
            </div>
          </section>

          {/* ════════════════ TREND BULANAN ════════════════ */}
          <section aria-label="Trend bulanan">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuTrendingUp class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">
                Trend Bulanan
              </h2>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatTrendChart
                title="Pendaftaran IBK Baru"
                data={stats.trendIbkBulanan}
                barColor="bg-primary"
                emptyMessage="Belum ada data pendaftaran"
              />
              <StatTrendChart
                title="Kegiatan Posyandu"
                data={stats.trendKegiatanBulanan}
                barColor="bg-secondary"
                emptyMessage="Belum ada data kegiatan"
              />
              <StatTrendChart
                title="Monitoring / Kunjungan"
                data={stats.trendMonitoringBulanan}
                barColor="bg-accent"
                emptyMessage="Belum ada data monitoring"
              />
              <StatKehadiranTrend
                title="Trend Kehadiran IBK"
                data={stats.trendKehadiranBulanan}
                emptyMessage="Belum ada data kehadiran"
              />
            </div>
          </section>

          {/* ════════════════ TABEL RINGKASAN ════════════════ */}
          <section aria-label="Tabel ringkasan data">
            <div class="flex items-center gap-2 mb-4 mt-2">
              <LuClipboardList class="w-5 h-5 text-primary" />
              <h2 class="text-lg font-bold text-base-content/90">
                Tabel Ringkasan Data
              </h2>
            </div>

            <div class="card bg-base-100 shadow-md border border-base-200/50">
              <div class="card-body p-0">
                <div class="overflow-x-auto">
                  <table class="table table-sm">
                    <thead>
                      <tr class="bg-base-200/40">
                        <th class="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                          Kategori
                        </th>
                        <th class="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                          Data
                        </th>
                        <th class="text-xs font-semibold uppercase tracking-wider text-base-content/60 text-right">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Ringkasan */}
                      <tr class="hover">
                        <td class="font-medium text-primary">Ringkasan</td>
                        <td>Total IBK Terdaftar</td>
                        <td class="text-right tabular-nums font-semibold">
                          {ringkasan.totalIbk}
                        </td>
                      </tr>
                      <tr class="hover">
                        <td></td>
                        <td>Total Kegiatan</td>
                        <td class="text-right tabular-nums font-semibold">
                          {ringkasan.totalKegiatan}
                        </td>
                      </tr>
                      <tr class="hover">
                        <td></td>
                        <td>Total Monitoring</td>
                        <td class="text-right tabular-nums font-semibold">
                          {ringkasan.totalMonitoring}
                        </td>
                      </tr>
                      <tr class="hover">
                        <td></td>
                        <td>Total Kader Aktif</td>
                        <td class="text-right tabular-nums font-semibold">
                          {ringkasan.totalKader}
                        </td>
                      </tr>
                      <tr class="hover">
                        <td></td>
                        <td>Rata-rata Kehadiran</td>
                        <td class="text-right tabular-nums font-semibold">
                          {ringkasan.rataRataKehadiran}%
                        </td>
                      </tr>

                      {/* Jenis Kelamin */}
                      {stats.demografiJenisKelamin.map((item, idx) => (
                        <tr key={`jk-${idx}`} class="hover">
                          <td
                            class={idx === 0 ? "font-medium text-primary" : ""}
                          >
                            {idx === 0 ? "Jenis Kelamin" : ""}
                          </td>
                          <td>{item.label}</td>
                          <td class="text-right tabular-nums font-semibold">
                            {item.jumlah}
                          </td>
                        </tr>
                      ))}

                      {/* Disabilitas */}
                      {stats.disabilitasJenis.map((item, idx) => (
                        <tr key={`dis-${idx}`} class="hover">
                          <td
                            class={idx === 0 ? "font-medium text-primary" : ""}
                          >
                            {idx === 0 ? "Jenis Disabilitas" : ""}
                          </td>
                          <td>{item.label}</td>
                          <td class="text-right tabular-nums font-semibold">
                            {item.jumlah}
                          </td>
                        </tr>
                      ))}

                      {/* Tingkat Keparahan */}
                      {stats.disabilitasTingkatKeparahan.map((item, idx) => (
                        <tr key={`tk-${idx}`} class="hover">
                          <td
                            class={idx === 0 ? "font-medium text-primary" : ""}
                          >
                            {idx === 0 ? "Tingkat Keparahan" : ""}
                          </td>
                          <td>{item.label}</td>
                          <td class="text-right tabular-nums font-semibold">
                            {item.jumlah}
                          </td>
                        </tr>
                      ))}

                      {/* Kesehatan ODGJ */}
                      <tr class="hover">
                        <td class="font-medium text-primary">Kesehatan</td>
                        <td>ODGJ</td>
                        <td class="text-right tabular-nums font-semibold">
                          {stats.kesehatanOdgj.odgj}
                        </td>
                      </tr>
                      <tr class="hover">
                        <td></td>
                        <td>Non-ODGJ</td>
                        <td class="text-right tabular-nums font-semibold">
                          {stats.kesehatanOdgj.nonOdgj}
                        </td>
                      </tr>

                      {/* Presensi */}
                      {stats.presensiDistribusi.map((item, idx) => (
                        <tr key={`pres-${idx}`} class="hover">
                          <td
                            class={idx === 0 ? "font-medium text-primary" : ""}
                          >
                            {idx === 0 ? "Status Presensi" : ""}
                          </td>
                          <td>{item.label}</td>
                          <td class="text-right tabular-nums font-semibold">
                            {item.jumlah}
                          </td>
                        </tr>
                      ))}

                      {/* Kategori IQ */}
                      {stats.assesmenKategoriIq.map((item, idx) => (
                        <tr key={`iq-${idx}`} class="hover">
                          <td
                            class={idx === 0 ? "font-medium text-primary" : ""}
                          >
                            {idx === 0 ? "Kategori IQ" : ""}
                          </td>
                          <td>{item.label}</td>
                          <td class="text-right tabular-nums font-semibold">
                            {item.jumlah}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Empty state when no data and no error */}
      {!loading.value && !stats && !error.value && (
        <div class="card bg-base-100 shadow-md border border-base-200/50">
          <div class="card-body items-center text-center py-16">
            <LuLineChart class="w-16 h-16 text-base-content/20 mb-4" />
            <h3 class="text-lg font-semibold text-base-content/60">
              Data Statistik Tidak Tersedia
            </h3>
            <p class="text-base-content/40 text-sm max-w-md">
              Belum ada data yang dapat ditampilkan untuk posyandu ini. Mulai
              dengan menambahkan data IBK dan jadwal kegiatan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Laporan & Statistik - Si-DIFA",
  meta: [
    {
      name: "description",
      content:
        "Laporan & Statistik lengkap untuk Kader Posyandu Si-DIFA — demografi IBK, disabilitas, kesehatan, asesmen, kehadiran, dan trend bulanan.",
    },
  ],
};
