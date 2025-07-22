import { component$, useSignal, useTask$, $ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { useLocation } from "@qwik.dev/router";
import { getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  LuUsers,
  LuLoader2,
  LuAlertCircle,
  LuSearch,
  LuPlus,
  LuMail,
  LuCalendar,
  LuCheckCircle,
  LuXCircle,
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
        <h1 class="text-3xl font-bold mb-2">Manajemen Kader</h1>
        <p class="text-base-content/70">
          Kelola kader untuk posyandu {posyandu.nama_posyandu}
        </p>
      </div>

      {/* Search and Filter */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Pencarian & Filter</h2>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="form-control flex-1">
              <label for="search-kader" class="label">
                <span class="label-text">Cari kader</span>
              </label>
              <div class="input-group">
                <input
                  id="search-kader"
                  type="text"
                  placeholder="Masukkan nama atau email kader..."
                  class="input input-bordered flex-1"
                />
                <button class="btn btn-primary">
                  <LuSearch class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="form-control">
              <label for="filter-status" class="label">
                <span class="label-text">Filter Status</span>
              </label>
              <select id="filter-status" class="select select-bordered">
                <option value="">Semua Status</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Terverifikasi</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-between items-center mb-6">
        <div class="text-sm text-base-content/70">
          Total kader: <span class="font-medium">0</span> orang
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-primary">
            <LuMail class="w-4 h-4" />
            Kirim Notifikasi
          </button>
          <button class="btn btn-primary">
            <LuPlus class="w-4 h-4" />
            Tambah Kader
          </button>
        </div>
      </div>

      {/* Kader List */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">
            <LuUsers class="w-5 h-5" />
            Daftar Kader
          </h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Status</th>
                  <th>Tanggal Bergabung</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} class="text-center text-base-content/50 py-8">
                    Belum ada kader yang terdaftar
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-primary">
            <LuUsers class="w-8 h-8" />
          </div>
          <div class="stat-title">Total Kader</div>
          <div class="stat-value text-primary">0</div>
          <div class="stat-desc">Kader terdaftar</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-success">
            <LuCheckCircle class="w-8 h-8" />
          </div>
          <div class="stat-title">Terverifikasi</div>
          <div class="stat-value text-success">0</div>
          <div class="stat-desc">Status terverifikasi</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-warning">
            <LuXCircle class="w-8 h-8" />
          </div>
          <div class="stat-title">Belum Terverifikasi</div>
          <div class="stat-value text-warning">0</div>
          <div class="stat-desc">Menunggu verifikasi</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-info">
            <LuCalendar class="w-8 h-8" />
          </div>
          <div class="stat-title">Kader Baru</div>
          <div class="stat-value text-info">0</div>
          <div class="stat-desc">Bulan ini</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuPlus class="w-5 h-5" />
              Tambah Kader Baru
            </h3>
            <p class="text-base-content/70">
              Daftarkan kader baru untuk posyandu ini
            </p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary btn-sm">Tambah Kader</button>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuMail class="w-5 h-5" />
              Kirim Notifikasi
            </h3>
            <p class="text-base-content/70">Kirim notifikasi ke semua kader</p>
            <div class="card-actions justify-end">
              <button class="btn btn-secondary btn-sm">Kirim Notif</button>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">
              <LuUsers class="w-5 h-5" />
              Verifikasi Kader
            </h3>
            <p class="text-base-content/70">
              Verifikasi kader yang belum terverifikasi
            </p>
            <div class="card-actions justify-end">
              <button class="btn btn-accent btn-sm">Verifikasi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
