import { component$, useSignal, $ } from '@builder.io/qwik';
import api from '../../services/api';

export default component$(() => {
  const form = useSignal({ token: '', password: '' });
  const msg = useSignal<string | null>(null);
  const error = useSignal<string | null>(null);

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    form.value = { ...form.value, [target.name]: target.value };
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    msg.value = null;
    error.value = null;
    
    console.log('🔑 Reset Password - Form Data:', { token: form.value.token, password: '***' });
    
    try {
      const response = await api.post('/auth/reset-password', form.value);
      console.log('🎉 Reset Password - Success Response:', response.data);
      msg.value = 'Password berhasil direset!';
      form.value = { token: '', password: '' };
    } catch (err: any) {
      console.log('💥 Reset Password - Error:', err);
      error.value = err.response?.data?.message || 'Gagal reset password';
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
      <form preventdefault:submit onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <input class="input input-bordered" name="token" placeholder="Token" value={form.value.token} onInput$={handleInput} />
        <input class="input input-bordered" name="password" placeholder="Password Baru" type="password" value={form.value.password} onInput$={handleInput} />
        <button class="btn btn-primary" type="submit">Reset Password</button>
      </form>
      {msg.value && <div class="text-green-500 mt-2">{msg.value}</div>}
      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
    </div>
  );
}); 