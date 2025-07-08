import { component$, useSignal, $ } from '@builder.io/qwik';
import api from '../../services/api';

export default component$(() => {
  const form = useSignal({
    name: '',
    email: '',
    password: '',
    no_telp: '',
    nama_posyandu: '',
    lokasi: '',
  });
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    form.value = { ...form.value, [target.name]: target.value };
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    error.value = null;
    success.value = null;
    
    console.log('📝 Signup Posyandu - Form Data:', form.value);
    
    try {
      const response = await api.post('/auth/signup/posyandu', { ...form.value });
      console.log('🎉 Signup Posyandu - Success Response:', response.data);
      success.value = 'Pendaftaran berhasil!';
      form.value = { name: '', email: '', password: '', no_telp: '', nama_posyandu: '', lokasi: '' };
    } catch (err: any) {
      console.log('💥 Signup Posyandu - Error:', err);
      error.value = err.response?.data?.message || 'Pendaftaran gagal';
    }
  });

  return (
    <div class="container mx-auto max-w-md p-4">
      <h1 class="text-2xl font-bold mb-4">Daftar Posyandu</h1>
      <form preventdefault:submit onSubmit$={handleSubmit} class="flex flex-col gap-3">
        <input class="input input-bordered" name="name" placeholder="Nama Lengkap" value={form.value.name} onInput$={handleInput} />
        <input class="input input-bordered" name="email" placeholder="Email" type="email" value={form.value.email} onInput$={handleInput} />
        <input class="input input-bordered" name="password" placeholder="Password" type="password" value={form.value.password} onInput$={handleInput} />
        <input class="input input-bordered" name="no_telp" placeholder="No Telp" value={form.value.no_telp} onInput$={handleInput} />
        <input class="input input-bordered" name="nama_posyandu" placeholder="Nama Posyandu" value={form.value.nama_posyandu} onInput$={handleInput} />
        <input class="input input-bordered" name="lokasi" placeholder="Lokasi" value={form.value.lokasi} onInput$={handleInput} />
        <button class="btn btn-primary" type="submit">Daftar</button>
      </form>
      {error.value && <div class="text-red-500 mt-2">{error.value}</div>}
      {success.value && <div class="text-green-500 mt-2">{success.value}</div>}
    </div>
  );
}); 