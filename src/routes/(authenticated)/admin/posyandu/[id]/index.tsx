import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useLocation } from "@builder.io/qwik-city";
import { adminService } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  LuMapPin,
  LuPhone,
  LuCalendar,
  LuUsers,
  LuClipboardList,
  LuBarChart,
  LuLoader2,
  LuAlertCircle,
} from "@qwikest/icons/lucide";
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
      const response = await adminService.detailPosyandu(posyanduId);
      posyanduData.value = response;
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
        <h1 class="text-3xl font-bold mb-2">Dashboard Posyandu</h1>
        <p class="text-base-content/70">
          Selamat datang di dashboard admin untuk posyandu{" "}
          {posyandu.nama_posyandu}
        </p>
      </div>

      {/* Posyandu Info Card */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">{posyandu.nama_posyandu}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <LuMapPin class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Alamat</p>
                <p class="text-base-content/70">{posyandu.alamat}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <LuPhone class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">No. Telepon</p>
                <p class="text-base-content/70">{posyandu.no_telp}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <LuCalendar class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Tanggal Dibuat</p>
                <p class="text-base-content/70">
                  {new Date(posyandu.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <LuUsers class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Status</p>
                <p class="text-base-content/70">
                  {posyandu.deleted_at ? "Tidak Aktif" : "Aktif"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-primary">
            <LuUsers class="w-8 h-8" />
          </div>
          <div class="stat-title">Total Kader</div>
          <div class="stat-value text-primary">0</div>
          <div class="stat-desc">Kader terdaftar</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-secondary">
            <LuClipboardList class="w-8 h-8" />
          </div>
          <div class="stat-title">Data IBK</div>
          <div class="stat-value text-secondary">0</div>
          <div class="stat-desc">Data terdaftar</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-accent">
            <LuBarChart class="w-8 h-8" />
          </div>
          <div class="stat-title">Laporan</div>
          <div class="stat-value text-accent">0</div>
          <div class="stat-desc">Laporan dibuat</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-info">
            <LuCalendar class="w-8 h-8" />
          </div>
          <div class="stat-title">Aktivitas</div>
          <div class="stat-value text-info">0</div>
          <div class="stat-desc">Aktivitas bulan ini</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuUsers class="w-5 h-5" />
              Manajemen Kader
            </h3>
            <p class="text-base-content/70">
              Kelola kader yang terdaftar di posyandu ini
            </p>
            <div class="card-actions justify-end">
              <a
                href={`/admin/posyandu/${posyanduId}/manajemen-kader`}
                class="btn btn-primary btn-sm"
              >
                Kelola Kader
              </a>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuClipboardList class="w-5 h-5" />
              Pendataan IBK
            </h3>
            <p class="text-base-content/70">
              Lihat dan kelola data IBK posyandu
            </p>
            <div class="card-actions justify-end">
              <a
                href={`/admin/posyandu/${posyanduId}/pendataan-ibk`}
                class="btn btn-secondary btn-sm"
              >
                Lihat Data
              </a>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuBarChart class="w-5 h-5" />
              Laporan Statistik
            </h3>
            <p class="text-base-content/70">
              Lihat laporan dan statistik posyandu
            </p>
            <div class="card-actions justify-end">
              <a
                href={`/admin/posyandu/${posyanduId}/laporan-statistik`}
                class="btn btn-accent btn-sm"
              >
                Lihat Laporan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
