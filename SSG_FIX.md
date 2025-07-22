# 🔧 SSG Fix untuk Reset Password Token Issue

## 🚨 Masalah yang Ditemukan

Token reset password hilang di production karena konfigurasi **Static Site Generation (SSG)** yang terlalu agresif.

### Gejala:

- ✅ **Local**: Token terbaca dengan baik dari URL parameter
- ❌ **Production**: Token kosong, tidak terbaca dari URL parameter

### Log Perbandingan:

**Local (Development):**

```
Full URL: http://localhost:5174/auth/reset-password/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Search params: ?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token extracted: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Production (Sebelum Fix):**

```
Full URL: https://sidifa.bits.my.id/auth/reset-password/
Search params: <empty string>
Token extracted: <empty string>
```

## 🔍 Root Cause

Konfigurasi SSG di `adapters/bun/vite.config.ts` menggunakan `include: ["/*"]` yang menyebabkan:

1. **Semua route di-generate secara statis** saat build time
2. **URL parameters tidak tersedia** saat SSG karena halaman sudah di-pre-render
3. **Dynamic content seperti token** tidak bisa diakses

```typescript
// ❌ Konfigurasi Lama (Masalah)
bunServerAdapter({
  ssg: {
    include: ["/*"],  // ← Terlalu agresif
    origin: "https://sidifa.bits.my.id",
    maxWorkers: 1,
  },
}),
```

## ✅ Solusi yang Diterapkan

### 1. Update SSG Configuration

Mengubah konfigurasi SSG untuk mengecualikan route yang memerlukan dynamic parameters:

```typescript
// ✅ Konfigurasi Baru (Fixed)
bunServerAdapter({
  ssg: {
    include: [
      "/",                           // Home page
      "/auth/login",                 // Login page
      "/auth/signup/kader",       // Signup posyandu
      "/auth/signup/psikolog",       // Signup psikolog
      "/auth/forgot-password",       // Forgot password
      "/demo/*",                     // Demo routes
      "/dashboard",                  // Dashboard
      "/dashboard/profile"           // Profile page
    ],
    exclude: [
      "/auth/reset-password",        // ← Exclude karena butuh dynamic token
      "/auth/reset-password/*"       // ← Exclude semua sub-routes juga
    ],
    origin: "https://sidifa.bits.my.id",
    maxWorkers: 1,
  },
}),
```

### 2. Prinsip yang Diterapkan

- **Include**: Route yang bisa di-generate secara statis (tidak memerlukan dynamic data)
- **Exclude**: Route yang memerlukan dynamic URL parameters atau user-specific data

## 🚀 Cara Deploy

### 1. Build Ulang Aplikasi

```bash
# Clean build
rm -rf dist/
rm -rf server/

# Build dengan konfigurasi baru
bun run build.server
```

### 2. Deploy ke Production

```bash
# Deploy ke server production
# Pastikan menggunakan build yang baru
```

### 3. Test Reset Password

1. Akses forgot password: `https://sidifa.bits.my.id/auth/forgot-password`
2. Masukkan email yang valid
3. Klik link di email reset password
4. Pastikan token terbaca dengan benar di URL

## 🧪 Testing

### Test Case 1: Reset Password Flow

1. **Forgot Password**: `https://sidifa.bits.my.id/auth/forgot-password`
2. **Email Reset**: Klik link di email
3. **Reset Page**: `https://sidifa.bits.my.id/auth/reset-password?token=...`
4. **Expected**: Token terbaca dengan benar

### Test Case 2: URL Parameter Debug

Akses halaman debug untuk memverifikasi:

```
https://sidifa.bits.my.id/test-reset-token?token=test-token-123
```

Expected output:

```
Full URL: https://sidifa.bits.my.id/test-reset-token?token=test-token-123
Search params: ?token=test-token-123
Token extracted: test-token-123
Token length: 13
Is empty: false
```

## 📋 Checklist Deployment

- [ ] Build ulang dengan konfigurasi SSG baru
- [ ] Deploy ke production server
- [ ] Test forgot password flow
- [ ] Test reset password dengan token
- [ ] Verifikasi token terbaca dengan benar
- [ ] Test semua route yang di-include SSG masih berfungsi

## 🔄 Monitoring

Setelah deploy, monitor:

1. **Console logs** untuk memastikan token terbaca
2. **Network requests** untuk memastikan API calls berhasil
3. **User feedback** untuk reset password flow
4. **Error rates** untuk route yang di-exclude dari SSG

## 📚 Referensi

- [Qwik SSG Documentation](https://qwik.dev/docs/deployments/static-site-generation/)
- [Bun Adapter Configuration](https://qwik.dev/docs/deployments/bun/)
- [Dynamic Routes in Qwik](https://qwik.dev/docs/routing/dynamic/)

## 🎯 Expected Result

Setelah fix ini diterapkan:

- ✅ Token reset password terbaca dengan benar di production
- ✅ Reset password flow berfungsi normal
- ✅ Route lain tetap di-optimize dengan SSG
- ✅ Performance tetap optimal untuk static content
