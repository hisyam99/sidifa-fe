# Form Persistence Guide - SIDIFA

## Masalah yang Diatasi

Sebelumnya, ketika user mengisi form login atau signup dan menekan tombol submit, jika ada validasi error, form akan reset ke nilai awal. Ini membuat user harus mengisi ulang semua field yang sudah diisi.

## Solusi yang Diimplementasikan

### 1. Konfigurasi Modular Forms

Kami telah menambahkan konfigurasi berikut pada semua form:

```typescript
const [form, { Form, Field }] = useForm<FormType>({
  loader: { value: initialData },
  validate: valiForm$(schema),
  // Tambahkan konfigurasi untuk mencegah reset form
  validateOn: "blur",
  revalidateOn: "blur",
});
```

**Penjelasan:**

- `validateOn: "blur"` - Validasi dijalankan ketika field kehilangan fokus
- `revalidateOn: "blur"` - Re-validasi dijalankan ketika field kehilangan fokus

### 2. Peningkatan FormField Component

Komponen `FormField` telah ditingkatkan dengan fitur:

```typescript
<input
  {...props}
  type={type}
  placeholder={placeholder}
  class={`input input-bordered w-full focus-ring ${field.error ? "input-error" : ""} ${className}`}
  aria-invalid={field.error ? "true" : "false"}
  aria-describedby={field.error ? `${props.name}-error` : undefined}
  // Auto-focus pada field yang error
  autoFocus={field.error ? true : undefined}
/>
```

**Fitur yang ditambahkan:**

- `autoFocus` - Otomatis fokus pada field yang error
- `aria-invalid` - Accessibility untuk screen reader
- `aria-describedby` - Link error message dengan input field
- `focus-ring` - Styling fokus yang lebih baik

### 3. Hook useFormPersistence

Hook baru untuk menangani persistence form data:

```typescript
export const useFormPersistence = <T extends Record<string, any>>(
  initialData: T,
) => {
  const formData = useSignal<T>(initialData);
  const hasErrors = useSignal(false);

  const updateFormData = $((newData: Partial<T>) => {
    formData.value = { ...formData.value, ...newData };
  });

  const setHasErrors = $((hasError: boolean) => {
    hasErrors.value = hasError;
  });

  const resetForm = $((data?: T) => {
    formData.value = data || initialData;
    hasErrors.value = false;
  });

  return {
    formData,
    hasErrors,
    updateFormData,
    setHasErrors,
    resetForm,
  };
};
```

### 4. FormWrapper Component

Komponen wrapper untuk form yang lebih canggih:

```typescript
export default component$<FormWrapperProps>(({ options, onSubmit$, class: className = "", "aria-label": ariaLabel }) => {
  const [form, { Form }] = useForm(options);
  const isSubmitting = useSignal(false);

  const handleSubmit = $(async (values: any) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    try {
      await onSubmit$(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <Form
      onSubmit$={handleSubmit}
      class={className}
      aria-label={ariaLabel}
    >
      <Slot />
    </Form>
  );
});
```

## Form yang Telah Diupdate

### 1. LoginForm

- **File:** `src/components/auth/LoginForm.tsx`
- **Perubahan:** Menambahkan `validateOn: "blur"` dan `revalidateOn: "blur"`

### 2. SignupPosyanduForm

- **File:** `src/components/auth/SignupPosyanduForm.tsx`
- **Perubahan:** Menambahkan `validateOn: "blur"` dan `revalidateOn: "blur"`

### 3. SignupPsikologForm

- **File:** `src/components/auth/SignupPsikologForm.tsx`
- **Perubahan:** Menambahkan `validateOn: "blur"` dan `revalidateOn: "blur"`

### 4. ForgotPasswordForm

- **File:** `src/components/auth/ForgotPasswordForm.tsx`
- **Perubahan:** Menambahkan `validateOn: "blur"` dan `revalidateOn: "blur"`

### 5. ResetPasswordForm

- **File:** `src/components/auth/ResetPasswordForm.tsx`
- **Perubahan:** Menambahkan `validateOn: "blur"` dan `revalidateOn: "blur"`

## Cara Kerja Solusi

### 1. Validasi Real-time

- Form akan memvalidasi field ketika user selesai mengetik (on blur)
- Error message muncul segera tanpa perlu submit form

### 2. Persistence Data

- Data yang sudah diisi tidak hilang ketika ada validasi error
- User hanya perlu mengisi field yang masih kosong atau salah

### 3. Auto-focus pada Error

- Field yang error akan otomatis mendapat fokus
- Memudahkan user untuk memperbaiki error

### 4. Accessibility

- Error message terhubung dengan input field melalui `aria-describedby`
- Screen reader dapat membaca error message dengan benar

## Keuntungan Solusi

1. **User Experience yang Lebih Baik**

   - User tidak perlu mengisi ulang form yang sudah diisi
   - Validasi real-time memberikan feedback segera

2. **Accessibility**

   - Mendukung screen reader
   - Keyboard navigation yang lebih baik

3. **Performance**

   - Validasi hanya dijalankan ketika diperlukan
   - Tidak ada re-render yang tidak perlu

4. **Maintainability**
   - Kode yang lebih bersih dan terstruktur
   - Reusable components

## Testing

Untuk memastikan solusi bekerja dengan baik:

1. **Test Case 1:** Isi form login dengan email yang salah format

   - Expected: Error muncul, password field tidak reset

2. **Test Case 2:** Isi form signup dengan password yang tidak memenuhi kriteria

   - Expected: Error muncul, field lain tidak reset

3. **Test Case 3:** Submit form dengan field yang kosong

   - Expected: Error muncul, field yang sudah diisi tidak reset

4. **Test Case 4:** Test dengan screen reader
   - Expected: Error message dapat dibaca dengan benar

## Versi Dependencies

- `@modular-forms/qwik`: `^0.29.1`
- `valibot`: `^1.1.0`
- `@builder.io/qwik`: `^1.14.1`

## Catatan Penting

1. **Browser Compatibility:** Solusi ini bekerja di semua browser modern
2. **Mobile Support:** Auto-focus dan validasi bekerja dengan baik di mobile
3. **Performance:** Tidak ada impact signifikan pada performance
4. **Security:** Validasi tetap dijalankan di server side

## Troubleshooting

### Jika form masih reset:

1. Pastikan `validateOn` dan `revalidateOn` sudah diset dengan benar
2. Cek apakah ada error di console browser
3. Pastikan modularform versi yang digunakan kompatibel

### Jika auto-focus tidak bekerja:

1. Pastikan `autoFocus` property sudah ditambahkan di FormField
2. Cek apakah ada CSS yang mengintervensi fokus
3. Test di browser yang berbeda

### Jika accessibility tidak bekerja:

1. Pastikan `aria-invalid` dan `aria-describedby` sudah diset
2. Test dengan screen reader
3. Cek apakah error message memiliki ID yang benar
