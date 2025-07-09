import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { PageContainer } from "~/components/layout";
import { LoadingSpinner } from "~/components/ui";
import { ProfileCard } from "~/components/profile";

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

export default component$(() => {
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);
  const nav = useNavigate();

  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      // Cek apakah user sudah login
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        nav("/login");
        return;
      }

      try {
        user.value = JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        nav("/login");
      } finally {
        loading.value = false;
      }
    }
  });

  if (loading.value) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (!user.value) {
    return null;
  }

  return (
    <PageContainer>
      <ProfileCard user={user.value} />
    </PageContainer>
  );
});
