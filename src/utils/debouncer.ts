import { $, useSignal, type QRL } from "@qwik.dev/core";

/**
 * Debouncer for Qwik - returns a QRL function that debounces the given function.
 * @param fn The function to debounce (QRL)
 * @param delay The debounce delay in ms
 */
export const useDebouncer = <A extends unknown[], R>(
  fn: QRL<(...args: A) => R>,
  delay: number,
): QRL<(...args: A) => void> => {
  const timeoutId = useSignal<number>();
  return $((...args: A): void => {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = window.setTimeout((): void => {
      void fn(...args);
    }, delay);
  });
};
