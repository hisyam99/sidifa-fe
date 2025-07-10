# Reset Password Feature - SIDIFA

## Overview

Fitur reset password sudah diimplementasikan dengan lengkap di aplikasi SIDIFA. Fitur ini memungkinkan user untuk mengatur ulang password mereka melalui email yang dikirim dengan token JWT.

## Flow Reset Password

### 1. User Request Reset Password

- User mengakses halaman `/auth/forgot-password`
- User memasukkan email yang terdaftar
- Sistem mengirim email dengan link reset password

### 2. Email Reset Password

Email yang dikirim berisi link dengan format:

```
http://localhost:3005/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Halaman Reset Password

- User mengklik link di email
- Diarahkan ke halaman `/auth/reset-password`
- Token otomatis diambil dari URL parameter
- User memasukkan password baru dan konfirmasi password

### 4. Validasi dan Submit

- Validasi password (minimal 8 karakter, huruf besar, angka)
- Validasi konfirmasi password harus sama
- Submit ke API `/auth/reset-password`
- Redirect ke halaman login setelah berhasil

## File yang Terlibat

### Frontend

- `src/routes/auth/reset-password/index.tsx` - Halaman reset password
- `src/components/auth/ResetPasswordForm.tsx` - Form komponen
- `src/types/auth.ts` - Schema validasi

### Backend

- `src/auth/auth.controller.ts` - Endpoint reset password
- `src/auth/auth.service.ts` - Business logic reset password
- `src/mail/mail.service.ts` - Service pengiriman email

## Fitur yang Diimplementasikan

### 1. Validasi Password

- Minimal 8 karakter
- Harus mengandung huruf besar
- Harus mengandung angka
- Konfirmasi password harus sama

### 2. UI/UX

- Form yang responsif
- Loading state saat submit
- Error handling yang informatif
- Success message dengan auto redirect
- Link kembali ke halaman login

### 3. Security

- Token JWT dengan expiration time
- Token dihapus setelah password berhasil diubah
- Validasi token di backend

### 4. Form Persistence

- Form tidak reset ketika ada validasi error
- Data yang sudah diisi tetap tersimpan
- Validasi real-time

## Cara Penggunaan

### 1. Akses Halaman Forgot Password

```
http://localhost:3005/auth/forgot-password
```

### 2. Masukkan Email

- Masukkan email yang terdaftar di sistem
- Klik "Kirim Email Reset"

### 3. Cek Email

- Buka email yang dikirim
- Klik link reset password

### 4. Reset Password

- Masukkan password baru
- Konfirmasi password baru
- Klik "Ubah Password"

### 5. Login dengan Password Baru

- Setelah berhasil, diarahkan ke halaman login
- Login dengan password yang baru

## Testing

### Test Case 1: Reset Password Berhasil

1. Masukkan email yang valid
2. Klik link di email
3. Masukkan password baru yang memenuhi kriteria
4. Konfirmasi password
5. Expected: Password berhasil diubah, redirect ke login

### Test Case 2: Password Tidak Memenuhi Kriteria

1. Masukkan password kurang dari 8 karakter
2. Expected: Error message muncul

### Test Case 3: Konfirmasi Password Tidak Sama

1. Masukkan password dan konfirmasi password yang berbeda
2. Expected: Error "Password dan konfirmasi password harus sama"

### Test Case 4: Token Expired

1. Gunakan token yang sudah expired
2. Expected: Error message dari backend

## Security Considerations

1. **Token Expiration**: Token JWT memiliki waktu kadaluarsa
2. **One-time Use**: Token dihapus setelah password berhasil diubah
3. **HTTPS**: Pastikan menggunakan HTTPS di production
4. **Rate Limiting**: Implementasi rate limiting untuk mencegah abuse
5. **Email Validation**: Validasi email sebelum mengirim reset link

## Dependencies

- `@modular-forms/qwik` - Form handling
- `valibot` - Schema validation
- `@qwikest/icons/lucide` - Icons
- `axios` - HTTP client

## Notes

- Token diambil otomatis dari URL parameter `?token=`
- Form menggunakan Modular Forms untuk handling yang lebih baik
- Validasi dilakukan di frontend dan backend
- UI menggunakan DaisyUI untuk styling yang konsisten
