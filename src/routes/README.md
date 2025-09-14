# Struktur Routing SIDIFA

Struktur routing yang telah direstrukturisasi mengikuti best practice Qwik framework dengan organisasi yang lebih terstruktur.

## 📁 Struktur Folder Routing

```
src/routes/
├── index.tsx                    # Home page (/)
├── layout.tsx                   # Root layout (header + footer)
├── auth/                        # Authentication routes
│   ├── layout.tsx              # Auth layout (header + footer, bg-gray-50)
│   ├── login/
│   │   └── index.tsx           # /auth/login
│   ├── signup/
│   │   ├── posyandu/
│   │   │   └── index.tsx       # /auth/signup/kader
│   │   └── psikolog/
│   │       └── index.tsx       # /auth/signup/psikolog
│   ├── forgot-password/
│   │   └── index.tsx           # /auth/forgot-password
│   └── reset-password/
│       └── index.tsx           # /auth/reset-password
├── dashboard/                   # Protected routes (requires authentication)
│   ├── layout.tsx              # Dashboard layout (with auth protection)
│   └── profile/
│       └── index.tsx           # /dashboard/profile
├── demo/                        # Demo routes (existing)
│   └── ...
└── [legacy routes]             # Redirect routes for backward compatibility
    ├── login/index.tsx         # Redirects to /auth/login
    ├── signup-posyandu/index.tsx # Redirects to /auth/signup/kader
    ├── signup-psikolog/index.tsx # Redirects to /auth/signup/psikolog
    ├── forgot-password/index.tsx # Redirects to /auth/forgot-password
    ├── reset-password/index.tsx  # Redirects to /auth/reset-password
    └── profile/index.tsx       # Redirects to /dashboard/profile
```

## 🎯 Kategori Routing

### 1. **Public Routes** (`/`)

- **Home Page**: Landing page untuk semua pengunjung
- **Layout**: Header + Footer tanpa Navigation

### 2. **Authentication Routes** (`/auth/*`)

- **Layout**: Header + Footer dengan background gray-50
- **Login**: `/auth/login`
- **Signup Posyandu**: `/auth/signup/kader`
- **Signup Psikolog**: `/auth/signup/psikolog`
- **Forgot Password**: `/auth/forgot-password`
- **Reset Password**: `/auth/reset-password`

### 3. **Protected Routes** (`/dashboard/*`)

- **Layout**: Header + Navigation + Footer dengan auth protection
- **Profile**: `/dashboard/profile`
- **Auth Protection**: Otomatis redirect ke `/auth/login` jika tidak authenticated

### 4. **Legacy Routes** (Backward Compatibility)

- Semua route lama masih berfungsi dengan redirect otomatis
- Memastikan tidak ada broken links dari external sources

## 🔐 Authentication Flow

### Login Flow:

1. User mengakses `/auth/login`
2. Setelah login berhasil → redirect ke `/dashboard/profile`
3. Jika user mencoba akses `/dashboard/*` tanpa login → redirect ke `/auth/login`

### Logout Flow:

1. User logout dari `/dashboard/profile`
2. Redirect ke `/auth/login`
3. Clear localStorage (access_token, user)

## 🎨 Layout Hierarchy

```
Root Layout (layout.tsx)
├── SidifaHeader
├── Main Content
└── SidifaFooter

Auth Layout (auth/layout.tsx)
├── SidifaHeader
├── Main Content (bg-gray-50)
└── SidifaFooter

Dashboard Layout (dashboard/layout.tsx)
├── SidifaHeader
├── Navigation (navbar dengan user info)
├── Main Content (bg-gray-50)
└── SidifaFooter
```

## 🔗 URL Mapping

| Old URL            | New URL                 | Status      |
| ------------------ | ----------------------- | ----------- |
| `/login`           | `/auth/login`           | ✅ Redirect |
| `/signup-posyandu` | `/auth/signup/kader`    | ✅ Redirect |
| `/signup-psikolog` | `/auth/signup/psikolog` | ✅ Redirect |
| `/forgot-password` | `/auth/forgot-password` | ✅ Redirect |
| `/reset-password`  | `/auth/reset-password`  | ✅ Redirect |
| `/profile`         | `/dashboard/profile`    | ✅ Redirect |

## 🚀 Best Practices yang Diterapkan

### 1. **Logical Grouping**

- Auth routes dikelompokkan di `/auth/*`
- Protected routes dikelompokkan di `/dashboard/*`
- Demo routes tetap di `/demo/*`

### 2. **Security**

- Dashboard routes memiliki auth protection otomatis
- Redirect ke login jika tidak authenticated
- Clear separation antara public dan protected routes

### 3. **User Experience**

- Backward compatibility dengan redirect otomatis
- Consistent layout untuk setiap kategori route
- Loading states untuk auth protection

### 4. **Maintainability**

- Clear separation of concerns
- Easy to add new auth or dashboard routes
- Consistent naming convention

### 5. **SEO Friendly**

- Clean URL structure
- Logical hierarchy
- Proper redirects untuk old URLs

## 📝 Cara Menambah Route Baru

### Menambah Auth Route:

```bash
mkdir -p src/routes/auth/new-feature
touch src/routes/auth/new-feature/index.tsx
```

### Menambah Dashboard Route:

```bash
mkdir -p src/routes/dashboard/new-feature
touch src/routes/dashboard/new-feature/index.tsx
```

### Template untuk Route Baru:

```typescript
import { component$ } from "@qwik.dev/core";
import { PageContainer } from "~/components/layout";

export default component$(() => {
  return (
    <PageContainer>
      {/* Your component here */}
    </PageContainer>
  );
});
```

## 🔄 Migration Notes

- Semua link internal telah diupdate ke URL baru
- External links masih berfungsi dengan redirect
- No breaking changes untuk existing functionality
- Improved security dengan auth protection
- Better organization dan maintainability
