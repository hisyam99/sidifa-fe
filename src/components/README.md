# Komponen SIDIFA

Struktur komponen yang sudah direfactor mengikuti best practice Qwik framework.

## Struktur Folder

```
src/components/
├── auth/                    # Komponen autentikasi
│   ├── LoginForm.tsx
│   ├── SignupPosyanduForm.tsx
│   ├── SignupPsikologForm.tsx
│   ├── ForgotPasswordForm.tsx
│   ├── ResetPasswordForm.tsx
│   └── index.ts
├── layout/                  # Komponen layout
│   ├── Navigation.tsx
│   ├── PageContainer.tsx
│   ├── SidifaHeader.tsx
│   ├── SidifaFooter.tsx
│   └── index.ts
├── ui/                      # Komponen UI dasar
│   ├── FormField.tsx
│   ├── Alert.tsx
│   ├── LoadingSpinner.tsx
│   ├── Card.tsx
│   └── index.ts
├── home/                    # Komponen halaman home
│   ├── WelcomeCard.tsx
│   ├── SignupCards.tsx
│   └── index.ts
├── profile/                 # Komponen halaman profile
│   ├── ProfileCard.tsx
│   └── index.ts
└── README.md
```

## Prinsip Colocation

Setiap route memiliki folder `components/` sendiri untuk komponen yang spesifik untuk route tersebut:

```
src/routes/
├── login/
│   ├── components/
│   │   └── index.ts
│   └── index.tsx
├── signup-posyandu/
│   ├── components/
│   │   └── index.ts
│   └── index.tsx
├── signup-psikolog/
│   ├── components/
│   │   └── index.ts
│   └── index.tsx
├── profile/
│   ├── components/
│   │   └── index.ts
│   └── index.tsx
├── forgot-password/
│   ├── components/
│   │   └── index.ts
│   └── index.tsx
└── reset-password/
    ├── components/
    │   └── index.ts
    └── index.tsx
```

## Kategori Komponen

### 1. UI Components (`src/components/ui/`)

Komponen UI dasar yang dapat digunakan kembali di seluruh aplikasi:

- `FormField`: Komponen input form dengan validasi
- `Alert`: Komponen untuk menampilkan pesan (error, success, warning, info)
- `LoadingSpinner`: Komponen loading spinner
- `Card`: Komponen card wrapper

### 1.1. Common Components (`src/components/common/`)

Komponen umum yang dapat digunakan kembali:

- `SearchBox`: Komponen search input yang fleksibel dengan berbagai size dan variant
- `BrandLogo`: Komponen logo brand SIDIFA
- `NavLink`: Komponen link navigasi yang dapat digunakan kembali

### 2. Layout Components (`src/components/layout/`)

Komponen layout yang digunakan di seluruh aplikasi:

- `Navigation`: Komponen navbar dengan state login
- `PageContainer`: Wrapper untuk container halaman
- `SidifaHeader`: Header aplikasi SIDIFA
- `SidifaFooter`: Footer aplikasi SIDIFA

### 3. Auth Components (`src/components/auth/`)

Komponen khusus untuk autentikasi:

- `LoginForm`: Form login
- `SignupPosyanduForm`: Form pendaftaran posyandu
- `SignupPsikologForm`: Form pendaftaran psikolog
- `ForgotPasswordForm`: Form lupa password
- `ResetPasswordForm`: Form reset password

### 4. Feature Components

Komponen yang spesifik untuk fitur tertentu:

- `home/`: Komponen untuk halaman home
- `profile/`: Komponen untuk halaman profile

## Best Practices yang Diterapkan

1. **Colocation**: Komponen yang spesifik untuk route tertentu ditempatkan di folder `components/` dalam route tersebut
2. **Reusability**: Komponen yang dapat digunakan kembali ditempatkan di folder utama `components/`
3. **Separation of Concerns**: Setiap komponen memiliki tanggung jawab yang jelas
4. **TypeScript**: Semua komponen menggunakan TypeScript dengan interface yang jelas
5. **Qwik Best Practices**: Menggunakan `component$`, `useSignal`, `$` sesuai dengan Qwik framework
6. **Modular Forms**: Menggunakan `@modular-forms/qwik` untuk form handling
7. **Consistent Styling**: Menggunakan DaisyUI classes secara konsisten

## Cara Penggunaan

### Import Komponen

```typescript
// Import komponen UI
import { FormField, Alert, LoadingSpinner, Card } from "~/components/ui";

// Import komponen common
import { SearchBox, BrandLogo, NavLink } from "~/components/common";

// Import komponen layout
import { PageContainer, Navigation } from "~/components/layout";

// Import komponen auth
import { LoginForm, SignupPosyanduForm } from "~/components/auth";

// Import komponen feature
import { WelcomeCard } from "~/components/home";
import { ProfileCard } from "~/components/profile";
```

### Penggunaan dalam Route

```typescript
import { component$ } from "@builder.io/qwik";
import { PageContainer } from "~/components/layout";
import { LoginForm } from "~/components/auth";

export default component$(() => {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  );
});
```

## Contoh Penggunaan SearchBox

```typescript
import { component$, useSignal } from "@builder.io/qwik";
import { SearchBox } from "~/components/common";

export default component$(() => {
  const searchValue = useSignal("");
  const filterValue = useSignal("");

  return (
    <div class="space-y-4">
      {/* SearchBox dengan size default dan variant default */}
      <SearchBox
        placeholder="Cari sesuatu..."
        value={searchValue}
        onInput$={(e) => searchValue.value = (e.target as HTMLInputElement).value}
        onEnter$={() => console.log("Search for:", searchValue.value)}
      />

      {/* SearchBox kecil dengan variant minimal */}
      <SearchBox
        placeholder="Filter data..."
        value={filterValue}
        onInput$={(e) => filterValue.value = (e.target as HTMLInputElement).value}
        size="sm"
        variant="minimal"
      />

      {/* SearchBox besar dengan variant floating */}
      <SearchBox
        placeholder="Pencarian utama..."
        value={searchValue}
        onInput$={(e) => searchValue.value = (e.target as HTMLInputElement).value}
        size="lg"
        variant="floating"
      />
    </div>
  );
});
```

### Varian SearchBox

**Size Variants:**

- `sm`: Kecil, cocok untuk filter atau ruang terbatas
- `md`: Medium, ukuran default yang balanced
- `lg`: Besar, cocok untuk pencarian utama

**Visual Variants:**

- `default`: Styling standar dengan shadow dan border
- `minimal`: Tampilan minimal dengan border tipis
- `floating`: Tampilan modern dengan backdrop blur

**Props Tambahan:**

- `disabled`: Untuk menonaktifkan input
- `class`: Untuk menambah custom CSS classes
- `onEnter$`: Callback ketika user menekan Enter

## Keuntungan Refactoring

1. **Maintainability**: Kode lebih mudah dipelihara karena terorganisir dengan baik
2. **Reusability**: Komponen dapat digunakan kembali di berbagai tempat
3. **Testability**: Komponen yang terpisah lebih mudah untuk di-test
4. **Scalability**: Struktur yang baik memudahkan penambahan fitur baru
5. **Performance**: Qwik dapat mengoptimalkan loading komponen yang terpisah
6. **Developer Experience**: Lebih mudah untuk menemukan dan mengubah komponen
