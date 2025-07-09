import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui";

interface WelcomeCardProps {
  userName: string;
  userRole: string;
}

export default component$<WelcomeCardProps>(({ userName, userRole }) => {
  return (
    <Card class="max-w-md mx-auto text-center">
      <div class="avatar placeholder mb-4">
        <div class="bg-primary text-primary-content rounded-full w-20">
          <span class="text-3xl">👋</span>
        </div>
      </div>
      <h2 class="card-title text-2xl mb-4 justify-center">
        Selamat Datang, {userName}!
      </h2>
      <p class="text-base-content/70 mb-6">
        Anda login sebagai{" "}
        <span class="badge badge-primary badge-lg">{userRole}</span>
      </p>
      <div class="card-actions justify-center">
        <a href="/dashboard/profile" class="btn btn-primary">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          Lihat Profile
        </a>
      </div>
    </Card>
  );
});
