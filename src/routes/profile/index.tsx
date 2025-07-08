import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import api from '../../services/api';

export default component$(() => {
  const profile = useSignal<any>(null);
  const error = useSignal<string | null>(null);

  useTask$(async () => {
    console.log('👤 Profile - Fetching user data...');
    try {
      const res = await api.get('/auth/profile');
      console.log('🎉 Profile - Success Response:', res.data);
      profile.value = res.data;
    } catch (err) {
      console.log('💥 Profile - Error:', err);
      error.value = 'Gagal mengambil profil. Silakan login ulang.';
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Profil</h1>
      {profile.value ? (
        <div class="space-y-2">
          <div>Email: {profile.value.email}</div>
          <div>Role: {profile.value.role}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
    </div>
  );
}); 