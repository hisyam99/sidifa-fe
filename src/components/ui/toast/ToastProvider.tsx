import {
  component$,
  useContextProvider,
  createContextId,
  useSignal,
  $,
  useContext,
  Slot,
  useVisibleTask$,
  isServer,
} from "@builder.io/qwik";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  durationMs: number;
  visible: boolean;
}

export interface ToastApi {
  show: (
    type: ToastType,
    message: string,
    durationMs?: number,
  ) => Promise<void>;
  success: (message: string, durationMs?: number) => Promise<void>;
  error: (message: string, durationMs?: number) => Promise<void>;
  warning: (message: string, durationMs?: number) => Promise<void>;
  info: (message: string, durationMs?: number) => Promise<void>;
}

const ToastContext = createContextId<{ toasts: ToastItem[]; api: ToastApi }>(
  "sidifa.toast.context",
);

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const ToastProvider = component$(() => {
  const toastsSig = useSignal<ToastItem[]>([]);

  const remove = $((id: string, immediate = false) => {
    const current = toastsSig.value;
    const idx = current.findIndex((t) => t.id === id);
    if (idx === -1) return;
    if (immediate) {
      toastsSig.value = current.filter((t) => t.id !== id);
      return;
    }
    // animate out
    current[idx] = { ...current[idx], visible: false };
    toastsSig.value = [...current];
    setTimeout(() => {
      toastsSig.value = toastsSig.value.filter((t) => t.id !== id);
    }, 220);
  });

  const show = $(
    async (type: ToastType, message: string, durationMs = 4000) => {
      const id = generateId();
      const item: ToastItem = { id, type, message, durationMs, visible: false };
      toastsSig.value = [item, ...toastsSig.value].slice(0, 5); // keep max 5
      // animate in on next tick
      setTimeout(() => {
        const current = toastsSig.value;
        const idx = current.findIndex((t) => t.id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], visible: true };
          toastsSig.value = [...current];
        }
      }, 10);
      // auto dismiss
      setTimeout(() => {
        remove(id);
      }, durationMs);
    },
  );

  const api: ToastApi = {
    show,
    success: $(async (message: string, durationMs = 3000) =>
      show("success", message, durationMs),
    ),
    error: $(async (message: string, durationMs = 4000) =>
      show("error", message, durationMs),
    ),
    warning: $(async (message: string, durationMs = 4000) =>
      show("warning", message, durationMs),
    ),
    info: $(async (message: string, durationMs = 3500) =>
      show("info", message, durationMs),
    ),
  };

  useContextProvider(ToastContext, { toasts: toastsSig.value, api });

  // Bridge: listen to global events to trigger toasts without capturing context
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (isServer) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        type: ToastType;
        message: string;
        durationMs?: number;
      }>;

      // Handle undefined detail with explicit check
      if (!ce.detail) return;

      const { type, message, durationMs } = ce.detail;
      if (!type || !message) return;
      show(type, message, durationMs);
    };
    window.addEventListener("sidifa:toast", handler as EventListener);
    return () =>
      window.removeEventListener("sidifa:toast", handler as EventListener);
  });

  const toastColorBorder = (t: ToastType) => {
    switch (t) {
      case "success":
        return "border-success/60";
      case "error":
        return "border-error/60";
      case "warning":
        return "border-warning/60";
      default:
        return "border-info/60";
    }
  };

  const toastBadge = (t: ToastType) => {
    switch (t) {
      case "success":
        return "badge-success";
      case "error":
        return "badge-error";
      case "warning":
        return "badge-warning";
      default:
        return "badge-info";
    }
  };

  return (
    <>
      {/* Render descendants so they can consume the context */}
      <Slot />

      {/* Toast viewport */}
      <div class="z-[9999] fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
        <div class="flex flex-col gap-2">
          {toastsSig.value.map((t) => (
            <div
              key={t.id}
              role="alert"
              class={`alert bg-base-100/95 backdrop-blur-md border ${toastColorBorder(
                t.type,
              )} ring-2 ring-base-300/60 rounded-xl shadow-2xl flex items-start gap-3 transition-all duration-200 ease-out pointer-events-auto ${
                t.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <div class={`badge ${toastBadge(t.type)} badge-sm mt-1`} />
              <div class="min-w-0">
                <div class="font-semibold tracking-wide">
                  {(() => {
                    switch (t.type) {
                      case "success":
                        return "Berhasil";
                      case "error":
                        return "Gagal";
                      case "warning":
                        return "Peringatan";
                      default:
                        return "Info";
                    }
                  })()}
                </div>
                <div class="text-sm opacity-80 break-words">{t.message}</div>
              </div>
              <button
                class="btn btn-ghost btn-xs ml-auto"
                aria-label="Tutup pemberitahuan"
                onClick$={$(() => remove(t.id))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  return ctx.api;
};

export const emitToast = $(
  (type: ToastType, message: string, durationMs = 4000) => {
    if (isServer) return;
    window.dispatchEvent(
      new CustomEvent("sidifa:toast", {
        detail: { type, message, durationMs },
      }),
    );
  },
);

export const emitToastSuccess = $((message: string, durationMs = 3000) => {
  return emitToast("success", message, durationMs);
});

export const emitToastError = $((message: string, durationMs = 4000) => {
  return emitToast("error", message, durationMs);
});

export const emitToastWarning = $((message: string, durationMs = 4000) => {
  return emitToast("warning", message, durationMs);
});

export const emitToastInfo = $((message: string, durationMs = 3500) => {
  return emitToast("info", message, durationMs);
});
