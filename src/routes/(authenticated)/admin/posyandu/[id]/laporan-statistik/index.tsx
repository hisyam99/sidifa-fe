import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useLocation } from "@builder.io/qwik-city";
import { getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  LuBarChart,
  LuLoader2,
  LuAlertCircle,
  LuCalendar,
  LuTrendingUp,
  LuTrendingDown,
  LuUsers,
  LuClipboardList,
} from "~/components/icons/lucide-optimized"; // Changed import source
import type { PosyanduDetail } from "~/types";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const posyanduData = useSignal<PosyanduDetail | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  // Extract posyanduId from the URL
  const pathParts = location.url.pathname.split("/");
  const posyanduId = pathParts[pathParts.indexOf("posyandu") + 1];

  const fetchPosyanduDetail = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getPosyanduDetail(posyanduId);
      posyanduData.value = response.data;
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  // Initial load
  useTask$(({ track }) => {
    track(isLoggedIn);
    if (isLoggedIn.value && posyanduId) {
      fetchPosyanduDetail();
    }
  });

  if (loading.value) {
    return (
      <div class="flex justify-center items-center min-h-64">
        <LuLoader2
          class="animate-spin text-primary"
          style={{ width: "32px", height: "32px" }}
        />
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="alert alert-error">
        <LuAlertCircle class="w-4 h-4" />
        <span>{error.value}</span>
      </div>
    );
  }

  if (!posyanduData.value) {
    return (
      <div class="alert alert-warning">
        <span>Data posyandu tidak ditemukan.</span>
      </div>
    );
  }

  const posyandu = posyanduData.value;

  return (
    <div>
      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-2">Laporan Statistik</h1>
        <p class="text-base-content/70">
          Laporan dan statistik untuk posyandu {posyandu.nama_posyandu}
        </p>
      </div>

      {/* Stats Overview */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-primary">
            <LuUsers class="w-8 h-8" />
          </div>
          <div class="stat-title">Total Kader</div>
          <div class="stat-value text-primary">0</div>
          <div class="stat-desc">
            <LuTrendingUp class="w-4 h-4 text-success" />
            +0% dari bulan lalu
          </div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-secondary">
            <LuClipboardList class="w-8 h-8" />
          </div>
          <div class="stat-title">Data IBK</div>
          <div class="stat-value text-secondary">0</div>
          <div class="stat-desc">
            <LuTrendingUp class="w-4 h-4 text-success" />
            +0% dari bulan lalu
          </div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-accent">
            <LuBarChart class="w-8 h-8" />
          </div>
          <div class="stat-title">Laporan Dibuat</div>
          <div class="stat-value text-accent">0</div>
          <div class="stat-desc">
            <LuTrendingDown class="w-4 h-4 text-error" />
            -0% dari bulan lalu
          </div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-info">
            <LuCalendar class="w-8 h-8" />
          </div>
          <div class="stat-title">Aktivitas</div>
          <div class="stat-value text-info">0</div>
          <div class="stat-desc">
            <LuTrendingUp class="w-4 h-4 text-success" />
            +0% dari bulan lalu
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuBarChart class="w-5 h-5" />
              Grafik Data IBK Bulanan
            </h3>
            <div class="h-64 flex items-center justify-center text-base-content/50">
              <div class="text-center">
                <LuBarChart class="w-16 h-16 mx-auto mb-4" />
                <p>Grafik akan ditampilkan di sini</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuTrendingUp class="w-5 h-5" />
              Tren Aktivitas
            </h3>
            <div class="h-64 flex items-center justify-center text-base-content/50">
              <div class="text-center">
                <LuTrendingUp class="w-16 h-16 mx-auto mb-4" />
                <p>Grafik tren akan ditampilkan di sini</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">
            <LuCalendar class="w-5 h-5" />
            Aktivitas Terbaru
          </h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Aktivitas</th>
                  <th>Kader</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} class="text-center text-base-content/50 py-8">
                    Belum ada aktivitas yang tercatat
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});
