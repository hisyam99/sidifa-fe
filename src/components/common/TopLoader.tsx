import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

/**
 * Qwik TopLoader - A top progress bar for route transitions.
 * Inspired by nprogress/nextjs-toploader, Qwik idiomatic.
 */
export const TopLoader = component$(() => {
  const progress = useSignal(0);
  const isActive = useSignal(false);
  const location = useLocation();

  // Animate progress bar on route change
  useVisibleTask$(({ track, cleanup }) => {
    track(() => location.url.pathname);

    let frame: number | undefined;
    let running = true;

    // Start loader
    isActive.value = true;
    progress.value = 0.08;

    // Simulate progress
    function trickle() {
      if (!running) return;
      progress.value = Math.min(progress.value + Math.random() * 0.2, 0.95);
      if (progress.value < 0.95) {
        frame = window.setTimeout(trickle, 200);
      }
    }
    frame = window.setTimeout(trickle, 200);

    // Complete loader after navigation settles
    const done = () => {
      running = false;
      progress.value = 1;
      setTimeout(() => {
        isActive.value = false;
        progress.value = 0;
      }, 400);
    };

    // Listen for Qwik router idle event (navigation done)
    window.addEventListener("qwik:idle", done, { once: true });

    cleanup(() => {
      running = false;
      if (frame) clearTimeout(frame);
      window.removeEventListener("qwik:idle", done);
    });
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress.value * 100}%`,
        height: "3px",
        background: "#2299DD",
        boxShadow: "0 0 10px #2299DD,0 0 5px #2299DD",
        opacity: isActive.value ? 1 : 0,
        transition:
          "width 0.2s ease, opacity 0.4s ease, background 0.2s, box-shadow 0.2s",
        zIndex: 1600,
        pointerEvents: "none",
      }}
    />
  );
});

export default TopLoader;
