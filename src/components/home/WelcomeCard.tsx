import { component$ } from "@builder.io/qwik";
import Card from "~/components/ui/Card";

interface WelcomeCardProps {
  userName: string;
  userRole: string;
}

export default component$<WelcomeCardProps>(({ userName, userRole }) => {
  return (
    <Card class="max-w-md mx-auto">
      <h2 class="card-title text-2xl mb-4">Selamat Datang, {userName}!</h2>
      <p class="text-gray-600 mb-4">
        Anda login sebagai <span class="badge badge-primary">{userRole}</span>
      </p>
      <div class="card-actions justify-center">
        <a href="/profile" class="btn btn-primary">
          Lihat Profile
        </a>
      </div>
    </Card>
  );
});
