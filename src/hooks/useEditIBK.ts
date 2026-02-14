import { $, useSignal } from "@builder.io/qwik";
import { ibkService } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";
import { queryClient } from "~/lib/query";

export interface EditIBKPayload {
  id: string;
  // All allowed fields (string) from ibk create schema; file is optional File
  [key: string]: string | File | undefined;
  file?: File | string;
}

export function useEditIBK() {
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const updateIbk = $(async (payload: EditIBKPayload) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      const { id, file, ...rest } = payload;
      const formData = ibkService.buildIbkUpdateFormData({ ...rest, file });
      await ibkService.updateIbk(id, formData);
      success.value = "Data IBK berhasil diperbarui.";

      // Invalidate all IBK-related caches so lists and details refetch
      queryClient.invalidateQueries("kader:ibk");
      queryClient.invalidateQueries("kader:presensi-ibk");
      queryClient.invalidateQueries("kader:monitoring-ibk");
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as Error);
    } finally {
      loading.value = false;
    }
  });

  return { loading, error, success, updateIbk };
}
