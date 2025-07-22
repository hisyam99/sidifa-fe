# SIDIFA - Sistem Informasi Digital Posyandu dan Psikolog

Aplikasi full-stack untuk sistem informasi digital posyandu dan psikolog yang dibangun dengan Qwik, NestJS, dan menggunakan modular-forms dengan valibot untuk validasi form yang robust.

## 🚀 Tech Stack

### Frontend

- **Qwik v1.14.1** - Framework JavaScript modern dengan resumability
- **DaisyUI v5** - Component library untuk TailwindCSS
- **TailwindCSS v4** - Utility-first CSS framework
- **Modular Forms** - Form library untuk Qwik dengan validasi yang powerful
- **Valibot** - Schema validation library yang lightweight dan type-safe
- **Axios** - HTTP client untuk API calls

### Backend

- **NestJS v11.1.3** - Progressive Node.js framework
- **JWT** - JSON Web Token untuk authentication
- **TypeORM** - ORM untuk database
- **PostgreSQL** - Database

## ✨ Fitur

### Authentication System

- ✅ Signup untuk Posyandu dan Psikolog
- ✅ Login dengan JWT
- ✅ Forgot Password dengan email reset
- ✅ Reset Password dengan token
- ✅ Profile management
- ✅ Logout

### Form Validation

- ✅ Real-time validation dengan Valibot
- ✅ Custom error messages dalam Bahasa Indonesia
- ✅ Password strength validation
- ✅ Email format validation
- ✅ Required field validation

### UI/UX

- ✅ Responsive design dengan DaisyUI
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Conditional navigation berdasarkan login status

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- Bun (recommended) atau npm
- PostgreSQL database

### Frontend Setup

```bash
cd sidifa-fev2
bun install
bun run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

## 📁 Project Structure

```
src/
├── routes/                 # Qwik City routes
│   ├── signup-posyandu/    # Signup form untuk posyandu
│   ├── signup-psikolog/    # Signup form untuk psikolog
│   ├── login/              # Login form
│   ├── profile/            # User profile page
│   ├── forgot-password/    # Forgot password form
│   ├── reset-password/     # Reset password form
│   └── layout.tsx          # Main layout dengan navigation
├── types/
│   └── auth.ts             # Valibot schemas dan types
├── services/
│   └── api.ts              # Axios instance dengan interceptors
└── components/             # Reusable components
```

## 🔧 Form Validation dengan Valibot

### Schema Definition

```typescript
import { object, string, email, minLength, regex, pipe } from "valibot";

export const signupPosyanduSchema = object({
  name: pipe(string(), minLength(1, "Nama harus diisi")),
  email: pipe(string(), email("Email tidak valid")),
  password: pipe(
    string(),
    minLength(8, "Password minimal 8 karakter"),
    regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password harus mengandung huruf besar dan angka",
    ),
  ),
  // ... other fields
});
```

### Form Implementation

```typescript
import { useForm, valiForm$ } from "@modular-forms/qwik";

const [form, { Form, Field }] = useForm<SignupPosyanduForm>({
  loader: { value: { name: "", email: "", password: "" } },
  validate: valiForm$(signupPosyanduSchema),
});
```

## 🔐 Authentication Flow

1. **Signup**: User mendaftar sebagai Posyandu atau Psikolog
2. **Login**: User login dengan email dan password
3. **JWT Token**: Token disimpan di localStorage
4. **Protected Routes**: Profile page hanya bisa diakses setelah login
5. **Logout**: Token dihapus dari localStorage

## 🎨 UI Components

### Form Fields

- Input fields dengan validasi real-time
- Error messages yang informatif
- Loading states saat submit
- Responsive design

### Navigation

- Conditional navigation berdasarkan login status
- Role-based display (Posyandu/Psikolog)
- Clean dan modern design

## 📱 Responsive Design

Aplikasi menggunakan DaisyUI dan TailwindCSS untuk responsive design yang optimal di berbagai device:

- Desktop
- Tablet
- Mobile

## 🔍 Development

### Running in Development

```bash
bun run dev
```

### Building for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## 🧪 Testing

Untuk menjalankan tests:

```bash
bun run test
```

## 📝 API Endpoints

### Authentication

- `POST /auth/signup/kader` - Signup posyandu
- `POST /auth/signup/psikolog` - Signup psikolog
- `POST /auth/login` - Login
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `GET /auth/profile` - Get user profile

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Qwik](https://qwik.dev/) - For the amazing framework
- [Modular Forms](https://modularforms.dev/) - For the powerful form library
- [Valibot](https://valibot.dev/) - For the lightweight validation
- [DaisyUI](https://daisyui.com/) - For the beautiful components
- [NestJS](https://nestjs.com/) - For the robust backend framework
