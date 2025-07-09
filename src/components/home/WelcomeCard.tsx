import { component$ } from "@builder.io/qwik";
import {
  LuHeart,
  LuUser,
  LuArrowRight,
  LuSparkles,
} from "@qwikest/icons/lucide";

interface WelcomeCardProps {
  userName: string;
  userRole: string;
}

export default component$<WelcomeCardProps>(({ userName, userRole }) => {
  return (
    <div class="card-elegant max-w-2xl mx-auto text-center group">
      <div class="card-body p-8">
        <div class="avatar placeholder mb-6 group-hover:scale-110 transition-transform duration-300">
          <div class="bg-gradient-primary text-white rounded-full w-24 h-24 shadow-xl">
            <LuHeart class="w-12 h-12" />
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 mb-4">
          <LuSparkles class="w-5 h-5 text-accent" />
          <h2 class="card-title text-3xl font-bold text-gradient-primary">
            Selamat Datang, {userName}!
          </h2>
          <LuSparkles class="w-5 h-5 text-accent" />
        </div>

        <p class="text-base-content/70 mb-6 text-lg">
          Anda login sebagai{" "}
          <span class="badge badge-primary badge-lg gap-2 px-4 py-3">
            <LuUser class="w-4 h-4" />
            {userRole}
          </span>
        </p>

        <p class="text-base-content/60 mb-8 leading-relaxed">
          Selamat datang kembali di SIDIFA. Platform Anda untuk memberikan
          layanan kesehatan dan dukungan psikologis yang inklusif dan
          berkualitas.
        </p>

        <div class="card-actions justify-center">
          <a
            href="/dashboard/profile"
            class="btn-hero inline-flex items-center gap-3"
          >
            <LuUser class="w-5 h-5" />
            Lihat Profil
            <LuArrowRight class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});
