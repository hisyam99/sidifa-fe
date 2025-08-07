import { $, useSignal } from "@builder.io/qwik";
import { ibkService } from "~/services/api";
import { extractErrorMessage } from "~/utils/error";

export interface EditIBKPayload {
  id: string;
  // All allowed fields (string) from ibk create schema; file is optional File
  [key: string]: any;
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
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  return { loading, error, success, updateIbk };
}
