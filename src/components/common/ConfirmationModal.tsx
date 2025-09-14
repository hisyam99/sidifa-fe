import { component$, Signal, QRL, Slot } from "@qwik.dev/core";

interface ConfirmationModalProps {
  isOpen: Signal<boolean>;
  title: string;
  message: string;
  onConfirm$: QRL<() => void>;
  onCancel$: QRL<() => void>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

export const ConfirmationModal = component$((props: ConfirmationModalProps) => {
  const {
    isOpen,
    title,
    message,
    onConfirm$,
    onCancel$,
    confirmButtonText = "Konfirmasi",
    cancelButtonText = "Batal",
    confirmButtonClass = "btn-error",
    cancelButtonClass = "btn-ghost",
  } = props;

  if (!isOpen.value) {
    return null;
  }

  return (
    <dialog
      open
      class="modal modal-bottom sm:modal-middle"
      onClose$={() => {
        isOpen.value = false;
      }}
    >
      <div class="modal-box max-w-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
        <h3 class="font-bold text-lg mb-2">{title}</h3>
        {message && <p class="py-4 text-base-content/70">{message}</p>}

        {/* Slot untuk children content seperti form */}
        <div class="py-4">
          <Slot />
        </div>

        <div class="modal-action">
          <div
            class="tooltip tooltip-warning tooltip-top"
            data-tip="Cancel action"
          >
            <button class={`btn ${cancelButtonClass}`} onClick$={onCancel$}>
              {cancelButtonText}
            </button>
          </div>
          {confirmButtonText && (
            <div
              class={`tooltip ${confirmButtonClass.includes("error") ? "tooltip-error" : confirmButtonClass.includes("success") ? "tooltip-success" : "tooltip-primary"} tooltip-top`}
              data-tip="Confirm action"
            >
              <button class={`btn ${confirmButtonClass}`} onClick$={onConfirm$}>
                {confirmButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button onClick$={onCancel$}>close</button>
      </form>
    </dialog>
  );
});
