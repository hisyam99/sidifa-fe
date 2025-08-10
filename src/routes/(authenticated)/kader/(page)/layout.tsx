import { component$, Slot } from "@builder.io/qwik";
import { AnimatedPageContainer } from "~/components/layout/AnimatedPageContainer";
import { useAuth } from "~/hooks";
import { LuUser } from "~/components/icons/lucide-optimized";
import { getRoleDisplayName, getRoleIcon } from "~/utils/dashboard-utils";
import { Avatar } from "~/components/ui";

export default component$(() => {
  const { user } = useAuth();
  const RoleIcon = getRoleIcon(user.value?.role);

  return (
    <div class="min-h-screen bg-base-200/60">
      <main>
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Sidebar kiri */}
          <aside class="hidden lg:block w-1/4 flex-col gap-4">
            <div class="sticky top-20">
              <div class="card bg-base-100 shadow-lg">
                <div class="card-body items-center p-6">
                  <div class="mx-auto mb-4">
                    <Avatar email={user.value?.email} size="w-24 h-24" />
                  </div>
                  <h2 class="font-bold text-lg text-center mb-1 truncate w-full">
                    {user.value?.email}
                  </h2>
                  <div class="badge badge-primary gap-2 mb-2">
                    {RoleIcon && <RoleIcon class="w-4 h-4" />}
                    <span class="capitalize text-xs">
                      {getRoleDisplayName(user.value?.role)}
                    </span>
                  </div>
                  <div class="text-xs text-base-content/60 text-center mb-2">
                    ID: {user.value?.id}
                  </div>
                </div>
              </div>
              <div class="mt-6 space-y-3">
                <a href="/kader/profile" class="btn btn-primary w-full gap-2">
                  <LuUser class="w-4 h-4" /> Lihat Profil
                </a>
              </div>
            </div>
          </aside>
          {/* Konten utama */}
          <div class="w-full lg:flex-1">
            <AnimatedPageContainer>
              <Slot />
            </AnimatedPageContainer>
          </div>
        </div>
      </main>
    </div>
  );
});
