import { component$, useSignal, $ } from '@builder.io/qwik';
import api from '../../services/api';

export default component$(() => {
  const email = useSignal('');
  const msg = useSignal<string | null>(null);
  const error = useSignal<string | null>(null);

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    email.value = target.value;
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    msg.value = null;
    error.value = null;
    
    console.log('📧 Forgot Password - Email:', email.value);
    
    try {
      const response = await api.post('/auth/forgot-password', { email: email.value });
      console.log('🎉 Forgot Password - Success Response:', response.data);
      msg.value = 'Link reset password telah dikirim ke email Anda';
    } catch (err: any) {
      console.log('💥 Forgot Password - Error:', err);
      error.value = err.response?.data?.message || 'Gagal mengirim link';
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Lupa Password</h1>
      <form preventdefault:submit onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <input class="input input-bordered" name="email" placeholder="Email" type="email" value={email.value} onInput$={handleInput} />
        <button class="btn btn-primary" type="submit">Kirim Link Reset</button>
      </form>
      {msg.value && <div class="text-green-500 mt-2">{msg.value}</div>}
      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
    </div>
  );
}); 