import {
  createContextId,
  useContextProvider,
  useSignal,
  useTask$,
  Signal,
} from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";

export interface RoutingProgressContext {
  progress: Signal<number>;
  isLoading: Signal<boolean>;
}

export const RoutingProgressContextId = createContextId<RoutingProgressContext>(
  "RoutingProgressContext",
);

export const useRoutingProgressProvider = () => {
  const progress = useSignal(0);
  const isLoading = useSignal(false);
  const location = useLocation();

  useTask$(({ track, cleanup }) => {
    track(() => location.isNavigating);
    let interval: any;
    if (location.isNavigating) {
      isLoading.value = true;
      progress.value = 0;
      interval = setInterval(() => {
        // Naik perlahan, misal 1-3% per 50ms, max 90%
        if (progress.value < 90) {
          progress.value += Math.random() * 2 + 1;
          if (progress.value > 90) progress.value = 90;
        }
      }, 50);
    } else if (isLoading.value) {
      clearInterval(interval);
      const finish = () => {
        if (progress.value < 100) {
          progress.value += 10;
          if (progress.value > 100) progress.value = 100;
          setTimeout(finish, 20);
        } else {
          setTimeout(() => {
            isLoading.value = false;
            progress.value = 0;
          }, 300);
        }
      };
      finish();
    }
    cleanup(() => clearInterval(interval));
  });

  useContextProvider(RoutingProgressContextId, { progress, isLoading });
};
