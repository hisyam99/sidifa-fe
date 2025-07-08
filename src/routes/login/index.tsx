import { component$, useSignal, $ } from '@builder.io/qwik';
import api from '../../services/api';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const form = useSignal({ email: '', password: '' });
  const error = useSignal<string | null>(null);
  const nav = useNavigate();

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    form.value = { ...form.value, [target.name]: target.value };
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    error.value = null;
    
    console.log('🔐 Login - Form Data:', form.value);
    
    try {
      const res = await api.post('/auth/login', form.value);
      console.log('🎉 Login - Success Response:', res.data);
      localStorage.setItem('access_token', res.data.access_token);
      console.log('💾 Token saved to localStorage');
      nav('/profile');
    } catch (err: any) {
      console.log('💥 Login - Error:', err);
      error.value = err.response?.data?.message || 'Login gagal';
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form preventdefault:submit onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <input class="input input-bordered" name="email" placeholder="Email" type="email" value={form.value.email} onInput$={handleInput} />
        <input class="input input-bordered" name="password" placeholder="Password" type="password" value={form.value.password} onInput$={handleInput} />
        <button class="btn btn-primary" type="submit">Login</button>
      </form>
      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
    </div>
  );
}); 