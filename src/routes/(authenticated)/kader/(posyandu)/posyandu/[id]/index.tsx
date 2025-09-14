// File: /sidifa-fev2/src/routes/posyandu/index.tsx

import { component$, useSignal, useTask$ } from "@qwik.dev/core";
import { Link, useLocation } from "@qwik.dev/router";
import { useAuth } from "~/hooks/useAuth";
import { getPosyanduDetail } from "~/services/api";
import type { PosyanduDetail } from "~/types";
import { extractErrorMessage } from "~/utils/error";
import StatisticsCard from "~/components/ui/StatisticsCard";
import {
  LuUser,
  LuMapPin,
  LuPhone,
  LuCalendar,
  LuPencil,
  LuTrash,
  LuShare,
  LuArrowRight,
  LuMenu,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const loc = useLocation();
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<PosyanduDetail | null>(null);
  const { isLoggedIn } = useAuth();

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    const idParam = track(() => loc.params.id);
    if (isLoggedIn.value && idParam) {
      loading.value = true;
      error.value = null;
      try {
        const res = await getPosyanduDetail(idParam);
        data.value = res;
      } catch (err: any) {
        error.value = extractErrorMessage(err);
      } finally {
        loading.value = false;
      }
    }
  });

  // Dummy status badge
  const statusBadge = (
    <span class="badge badge-success badge-lg gap-2">Aktif</span>
  );

  // Dummy statistics for posyandu
  const stats = [
    {
      title: "Total Anggota",
      value: 120,
      icon: "LuUsers",
      color: "primary" as const,
      description: "Jumlah seluruh anggota posyandu",
    },
    {
      title: "IBK Terdaftar",
      value: 8,
      icon: "LuHeart",
      color: "accent" as const,
      description: "Individu Berkebutuhan Khusus",
    },
    {
      title: "Kunjungan Bulan Ini",
      value: 15,
      icon: "LuActivity",
      color: "success" as const,
      description: "Total kunjungan posyandu bulan ini",
    },
    {
      title: "Jadwal Berikutnya",
      value: 3,
      icon: "LuCalendar",
      color: "secondary" as const,
      description: "Kunjungan terjadwal minggu ini",
    },
  ];

  // Dummy user info
  const userInfo = (userId: string) => (
    <div class="flex items-center gap-2 mt-2">
      <LuUser class="w-4 h-4 text-primary" />
      <span class="text-xs text-base-content/70">User ID: {userId}</span>
    </div>
  );

  // Action menu (dropdown)
  const actionMenu = (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-ghost btn-circle">
        <LuMenu class="w-6 h-6" />
      </label>
      <ul
        tabIndex={0}
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100/95 backdrop-blur-md rounded-box w-44 border border-base-200/50"
      >
        <li>
          <button class="flex items-center gap-2" onClick$={() => {}}>
            <LuPencil class="w-4 h-4 text-primary" /> Edit Data
          </button>
        </li>
        <li>
          <button class="flex items-center gap-2" onClick$={() => {}}>
            <LuTrash class="w-4 h-4 text-error" /> Hapus Data
          </button>
        </li>
        <li>
          <button class="flex items-center gap-2" onClick$={() => {}}>
            <LuShare class="w-4 h-4 text-info" /> Bagikan
          </button>
        </li>
        <li>
          <button class="flex items-center gap-2" onClick$={() => {}}>
            <LuArrowRight class="w-4 h-4" /> Salin ID
          </button>
        </li>
      </ul>
    </div>
  );

  // Inline skeletons only where values are dynamic

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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <StatisticsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>
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
          {/* Hamburger menu in top right */}
          <div class="absolute top-4 right-4 z-10">{actionMenu}</div>
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
                          {new Date(data.value!.created_at).toLocaleString()}
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
                <div class="divider">Aksi Lainnya</div>
                <div class="flex flex-wrap gap-3 justify-end">
                  <button class="btn btn-outline gap-2" onClick$={() => {}}>
                    <LuArrowRight class="w-4 h-4" /> Salin ID
                  </button>
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
