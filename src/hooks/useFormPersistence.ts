import { useSignal, $, type QRL } from "@builder.io/qwik";

/**
 * Hook untuk mengelola persistensi data form.
 * Memastikan form tidak reset saat ada error validasi.
 * @template T Tipe data form (harus berupa objek).
 * @param initialData Data awal form.
 * @returns Objek dengan signal dan fungsi untuk mengelola form.
 */
export const useFormPersistence = <T extends Record<string, unknown>>(
  initialData: T,
) => {
  const formData = useSignal<T>(initialData);
  const hasErrors = useSignal(false);

  /**
   * Memperbarui data form dengan data baru secara partial.
   */
  const updateFormData: QRL<(newData: Partial<T>) => void> = $((newData) => {
    formData.value = { ...formData.value, ...newData };
  });

  /**
   * Mengatur status error form.
   */
  const setHasErrors: QRL<(hasError: boolean) => void> = $((hasError) => {
    hasErrors.value = hasError;
  });

  /**
   * Mengatur ulang form ke data awal atau data baru.
   */
  const resetForm: QRL<(data?: T) => void> = $((data) => {
    formData.value = data ?? initialData;
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
