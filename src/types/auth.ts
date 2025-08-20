import {
  object,
  string,
  email,
  minLength,
  regex,
  pipe,
  type InferInput,
  forward,
  check,
} from "valibot";

// Signup Posyandu schema
export const signupKaderSchema = pipe(
  object({
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
    confirmPassword: pipe(
      string(),
      minLength(1, "Konfirmasi password harus diisi"),
    ),
    no_telp: pipe(
      string(),
      minLength(1, "No telepon harus diisi"),
      regex(
        /^08\d{8,13}$/,
        "Nomor telepon harus format Indonesia dan hanya angka, contoh: 081234567890",
      ),
    ),
    jabatan: pipe(string(), minLength(1, "Jabatan harus diisi")),
  }),
  forward(
    check(
      ({ password, confirmPassword }) => password === confirmPassword,
      "Password dan konfirmasi password tidak sama",
    ),
    ["confirmPassword"],
  ),
);

// Signup Psikolog schema
export const signupPsikologSchema = pipe(
  object({
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
    confirmPassword: pipe(
      string(),
      minLength(1, "Konfirmasi password harus diisi"),
    ),
    no_telp: pipe(
      string(),
      minLength(1, "No telepon harus diisi"),
      regex(
        /^08\d{8,13}$/,
        "Nomor telepon harus format Indonesia dan hanya angka, contoh: 081234567890",
      ),
    ),
    spesialis: pipe(string(), minLength(1, "Spesialis harus diisi")),
    lokasi: pipe(string(), minLength(1, "Lokasi harus diisi")),
  }),
  forward(
    check(
      ({ password, confirmPassword }) => password === confirmPassword,
      "Password dan konfirmasi password tidak sama",
    ),
    ["confirmPassword"],
  ),
);

// Login schema
export const loginSchema = object({
  email: pipe(string(), email("Email tidak valid")),
  password: pipe(string(), minLength(1, "Password harus diisi")),
});

// Forgot password schema
export const forgotPasswordSchema = object({
  email: pipe(string(), email("Email tidak valid")),
});

// Reset password schema
export const resetPasswordSchema = object({
  token: pipe(string(), minLength(1, "Token harus diisi")),
  password: pipe(
    string(),
    minLength(8, "Password minimal 8 karakter"),
    regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password harus mengandung huruf besar dan angka",
    ),
  ),
  confirmPassword: pipe(
    string(),
    minLength(1, "Konfirmasi password harus diisi"),
  ),
});

// Type exports
export type SignupKaderForm = InferInput<typeof signupKaderSchema>;
export type SignupPsikologForm = InferInput<typeof signupPsikologSchema>;
export type LoginForm = InferInput<typeof loginSchema>;
export type ForgotPasswordForm = InferInput<typeof forgotPasswordSchema>;
export type ResetPasswordForm = InferInput<typeof resetPasswordSchema>;
