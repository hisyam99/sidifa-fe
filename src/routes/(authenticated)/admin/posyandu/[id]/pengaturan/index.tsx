import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useLocation } from "@builder.io/qwik-city";
import { getPosyanduDetail } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import {
  LuLoader2,
  LuAlertCircle,
  LuSave,
  LuBuilding,
  LuShield,
  LuBell,
  LuDatabase,
  LuTrash,
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
        <h1 class="text-3xl font-bold mb-2">Pengaturan Posyandu</h1>
        <p class="text-base-content/70">
          Kelola pengaturan untuk posyandu {posyandu.nama_posyandu}
        </p>
      </div>

      {/* General Settings */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h3 class="card-title">
            <LuBuilding class="w-5 h-5" />
            Informasi Umum
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nama Posyandu</span>
              </label>
              <input
                type="text"
                placeholder="Nama posyandu"
                class="input input-bordered"
                value={posyandu.nama_posyandu}
                disabled
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Alamat</span>
              </label>
              <textarea
                placeholder="Alamat posyandu"
                class="textarea textarea-bordered"
                value={posyandu.alamat}
                disabled
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">No. Telepon</span>
              </label>
              <input
                type="text"
                placeholder="Nomor telepon"
                class="input input-bordered"
                value={posyandu.no_telp}
                disabled
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select class="select select-bordered" disabled>
                <option value="active" selected={!posyandu.deleted_at}>
                  Aktif
                </option>
                <option value="inactive" selected={!!posyandu.deleted_at}>
                  Tidak Aktif
                </option>
              </select>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">
              <LuSave class="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h3 class="card-title">
            <LuShield class="w-5 h-5" />
            Pengaturan Keamanan
          </h3>
          <div class="space-y-4">
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Aktifkan Verifikasi 2 Faktor</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Log Aktivitas Kader</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Notifikasi Login</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">
              <LuSave class="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h3 class="card-title">
            <LuBell class="w-5 h-5" />
            Pengaturan Notifikasi
          </h3>
          <div class="space-y-4">
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Notifikasi Email</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Notifikasi Push</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Laporan Otomatis</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </label>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">
              <LuSave class="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h3 class="card-title">
            <LuDatabase class="w-5 h-5" />
            Manajemen Data
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Backup Data</span>
              </label>
              <button class="btn btn-outline btn-primary">
                <LuDatabase class="w-4 h-4" />
                Buat Backup
              </button>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Restore Data</span>
              </label>
              <button class="btn btn-outline btn-secondary">
                <LuDatabase class="w-4 h-4" />
                Restore Data
              </button>
            </div>
          </div>
          <div class="alert alert-warning mt-4">
            <span>
              <strong>Peringatan:</strong> Backup dan restore data akan
              mempengaruhi semua data posyandu ini.
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div class="card bg-base-100 shadow-xl border-error">
        <div class="card-body">
          <h3 class="card-title text-error">
            <LuAlertCircle class="w-5 h-5" />
            Zona Berbahaya
          </h3>
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Hapus Posyandu</span>
              </label>
              <button class="btn btn-error">
                <LuTrash class="w-4 h-4" />
                Hapus Posyandu
              </button>
              <p class="text-sm text-base-content/70 mt-2">
                Tindakan ini akan menghapus semua data posyandu dan tidak dapat
                dibatalkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
