import {
  object,
  string,
  email,
  minLength,
  regex,
  pipe,
  type InferInput,
} from "valibot";

// Signup Posyandu schema
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
  confirmPassword: pipe(
    string(),
    minLength(1, "Konfirmasi password harus diisi"),
  ),
  no_telp: pipe(string(), minLength(1, "No telepon harus diisi")),
  nama_posyandu: pipe(string(), minLength(1, "Nama posyandu harus diisi")),
  lokasi: pipe(string(), minLength(1, "Lokasi harus diisi")),
});

// Signup Psikolog schema
export const signupPsikologSchema = object({
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
  no_telp: pipe(string(), minLength(1, "No telepon harus diisi")),
  spesialis: pipe(string(), minLength(1, "Spesialis harus diisi")),
  lokasi: pipe(string(), minLength(1, "Lokasi harus diisi")),
});

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
});

// Type exports
export type SignupPosyanduForm = InferInput<typeof signupPosyanduSchema>;
export type SignupPsikologForm = InferInput<typeof signupPsikologSchema>;
export type LoginForm = InferInput<typeof loginSchema>;
export type ForgotPasswordForm = InferInput<typeof forgotPasswordSchema>;
export type ResetPasswordForm = InferInput<typeof resetPasswordSchema>;
