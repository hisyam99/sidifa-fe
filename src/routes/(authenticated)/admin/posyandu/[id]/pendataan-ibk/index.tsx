import { component$, useSignal, useTask$, $ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { useLocation } from "@qwik.dev/router";
import { getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  LuClipboardList,
  LuLoader2,
  LuAlertCircle,
  LuSearch,
  LuDownload,
  LuPlus,
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
        <h1 class="text-3xl font-bold mb-2">Pendataan IBK</h1>
        <p class="text-base-content/70">
          Kelola data IBK untuk posyandu {posyandu.nama_posyandu}
        </p>
      </div>

      {/* Search and Filter */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Pencarian & Filter</h2>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="form-control flex-1">
              <label for="search-ibk" class="label">
                <span class="label-text">Cari data IBK</span>
              </label>
              <div class="input-group">
                <input
                  id="search-ibk"
                  type="text"
                  placeholder="Masukkan nama atau ID IBK..."
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
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div class="form-control">
              <label for="filter-date" class="label">
                <span class="label-text">Filter Tanggal</span>
              </label>
              <input
                id="filter-date"
                type="date"
                class="input input-bordered"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-between items-center mb-6">
        <div class="text-sm text-base-content/70">
          Total data: <span class="font-medium">0</span> IBK
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-primary">
            <LuDownload class="w-4 h-4" />
            Export Data
          </button>
          <button class="btn btn-primary">
            <LuPlus class="w-4 h-4" />
            Tambah IBK
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">
            <LuClipboardList class="w-5 h-5" />
            Data IBK
          </h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>ID IBK</th>
                  <th>Nama</th>
                  <th>Tanggal Lahir</th>
                  <th>Alamat</th>
                  <th>Status</th>
                  <th>Tanggal Input</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} class="text-center text-base-content/50 py-8">
                    Belum ada data IBK yang tercatat
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-primary">
            <LuClipboardList class="w-8 h-8" />
          </div>
          <div class="stat-title">Total IBK</div>
          <div class="stat-value text-primary">0</div>
          <div class="stat-desc">Data terdaftar</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-success">
            <LuClipboardList class="w-8 h-8" />
          </div>
          <div class="stat-title">IBK Aktif</div>
          <div class="stat-value text-success">0</div>
          <div class="stat-desc">Status aktif</div>
        </div>

        <div class="stat bg-base-100 shadow-xl rounded-2xl">
          <div class="stat-figure text-warning">
            <LuClipboardList class="w-8 h-8" />
          </div>
          <div class="stat-title">IBK Baru</div>
          <div class="stat-value text-warning">0</div>
          <div class="stat-desc">Bulan ini</div>
        </div>
      </div>
    </div>
  );
});
