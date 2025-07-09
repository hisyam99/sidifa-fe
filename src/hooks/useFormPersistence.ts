import { useSignal, $ } from "@builder.io/qwik";

/**
 * Hook untuk menangani persistence form data
 * Memastikan form tidak reset ketika ada validasi error
 */
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
