import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Card from "~/components/ui/Card";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  no_telp: string;
  nama_posyandu?: string;
  lokasi?: string;
  spesialis?: string;
}

interface ProfileCardProps {
  user: User;
}

export default component$<ProfileCardProps>(({ user }) => {
  const nav = useNavigate();

  const handleLogout = $(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      nav("/login");
    }
  });

  return (
    <Card>
      <h1 class="card-title text-2xl mb-4">Profile</h1>

      <div class="space-y-4">
        <div>
          <label class="label">
            <span class="label-text font-semibold">Nama</span>
          </label>
          <p class="text-gray-700">{user.name}</p>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-semibold">Email</span>
          </label>
          <p class="text-gray-700">{user.email}</p>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-semibold">Role</span>
          </label>
          <p class="text-gray-700 capitalize">{user.role}</p>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-semibold">No Telepon</span>
          </label>
          <p class="text-gray-700">{user.no_telp}</p>
        </div>

        {user.role === "posyandu" && (
          <>
            <div>
              <label class="label">
                <span class="label-text font-semibold">Nama Posyandu</span>
              </label>
              <p class="text-gray-700">{user.nama_posyandu}</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-semibold">Lokasi</span>
              </label>
              <p class="text-gray-700">{user.lokasi}</p>
            </div>
          </>
        )}

        {user.role === "psikolog" && (
          <>
            <div>
              <label class="label">
                <span class="label-text font-semibold">Spesialis</span>
              </label>
              <p class="text-gray-700">{user.spesialis}</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-semibold">Lokasi</span>
              </label>
              <p class="text-gray-700">{user.lokasi}</p>
            </div>
          </>
        )}
      </div>

      <div class="card-actions justify-end mt-6">
        <button onClick$={handleLogout} class="btn btn-error">
          Logout
        </button>
      </div>
    </Card>
  );
});
