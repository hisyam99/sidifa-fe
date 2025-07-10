# 🧪 Test Guide: Reset Password Form Debugging

## Cara Test Form Reset Password

### 1. Start Server

```bash
npm run dev
```

### 2. Akses Halaman Reset Password

Buka browser dan akses salah satu URL berikut:

#### Test dengan Token Dummy:

```
http://localhost:5174/auth/reset-password?token=test-token-123
```

#### Test dengan Token Real:

```
http://localhost:5174/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhpc3lhbWthbWlsOTlAZ21haWwuY29tIiwiaWF0IjoxNzUyMDkzNTUwLCJleHAiOjE3NTIwOTUzNTB9.O-u88Z5xpwKwhLFt9gj1dGucaS0PaikvLZJ5xv0tipc
```

### 3. Buka Developer Tools

- Tekan `F12` atau `Ctrl+Shift+I`
- Pilih tab **Console**

### 4. Test Input User

Isi form dengan data berikut:

#### Test Case 1: Password Valid

- **Password Baru**: `Admins1234`
- **Konfirmasi Password**: `Admins1234`

#### Test Case 2: Password Tidak Sama

- **Password Baru**: `Admins1234`
- **Konfirmasi Password**: `Admins5678`

#### Test Case 3: Password Terlalu Pendek

- **Password Baru**: `123`
- **Konfirmasi Password**: `123`

### 5. Lihat Console Log

#### Saat Halaman Load:

```javascript
🔍 URL Debug Info:
Full URL: http://localhost:5174/auth/reset-password?token=...
Token extracted: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token length: 173
Token is empty: false

🔍 Form State:
submitting: false
dirty: false
touched: false
invalid: false
```

#### Saat Input Password:

```javascript
🔍 Password Field Change:
value: "Admins1234"
length: 10
hasError: false
error: null

🔍 Confirm Password Field Change:
value: "Admins1234"
length: 10
hasError: false
error: null
```

#### Saat Submit Form (Success):

```javascript
================================================================================
🚀 RESET PASSWORD FORM SUBMIT STARTED
================================================================================
📝 USER INPUT:
  • Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  • Password: Admins1234
  • Confirm Password: Admins1234
  • Password Length: 10
  • Token Length: 173

✅ VALIDATION PASSED: Password confirmation match

📤 REQUEST TO SERVER:
  • URL: /auth/reset-password
  • Method: POST
  • Data: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "password": "Admins1234"
  }

🔄 SENDING REQUEST...

✅ SUCCESS RESPONSE FROM SERVER:
  • Status: 201
  • Status Text: Created
  • Response Time: 245ms
  • Headers: {...}
  • Data: {}

✅ SUCCESS: Password reset completed
🔄 REDIRECTING: Going to login page...
================================================================================
🏁 RESET PASSWORD FORM SUBMIT ENDED
================================================================================
```

#### Saat Submit Form (Error):

```javascript
❌ ERROR RESPONSE FROM SERVER:
  • Error Type: Error
  • Error Message: Request failed with status code 400
  • Response Status: 400
  • Response Status Text: Bad Request
  • Response Data: {
    "message": "Token expired or invalid"
  }
  • Response Config: {
    "url": "/auth/reset-password",
    "method": "POST",
    "baseURL": "https://apisd.krisnabmntr.my.id/api/v1"
  }
```

### 6. Test Cases yang Harus Dicoba

#### ✅ Test Case 1: Success Flow

1. Gunakan token yang valid dan belum expired
2. Masukkan password yang memenuhi kriteria
3. Expected: Status 201, redirect ke login

#### ❌ Test Case 2: Token Expired

1. Gunakan token yang sudah expired
2. Expected: Status 400, error message

#### ❌ Test Case 3: Password Mismatch

1. Masukkan password dan konfirmasi yang berbeda
2. Expected: Validation error, tidak submit ke server

#### ❌ Test Case 4: Weak Password

1. Masukkan password yang tidak memenuhi kriteria
2. Expected: Validation error

### 7. Debugging Tips

#### Jika Token Tidak Terbaca:

- Cek URL parameter `?token=...`
- Pastikan token tidak terpotong
- Cek apakah ada karakter khusus yang perlu di-encode

#### Jika Request Gagal:

- Cek network tab di DevTools
- Lihat status code response
- Cek apakah API URL benar
- Cek CORS error

#### Jika Form Tidak Submit:

- Cek validation error
- Pastikan semua field required terisi
- Cek console error

### 8. Expected Console Output

#### Success Case:

- ✅ URL Debug Info (token terbaca)
- ✅ Form State (valid)
- ✅ User Input (password match)
- ✅ Request to Server (data lengkap)
- ✅ Success Response (status 201)
- ✅ Redirect message

#### Error Case:

- ✅ URL Debug Info (token terbaca)
- ✅ Form State (valid)
- ✅ User Input (password match)
- ✅ Request to Server (data lengkap)
- ❌ Error Response (status 4xx/5xx)
- ❌ Error details (message, config)

Dengan debugging ini, Anda akan bisa melihat secara detail apa yang terjadi di setiap tahap proses reset password!
