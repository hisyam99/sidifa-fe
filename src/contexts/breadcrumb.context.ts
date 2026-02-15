import { createContextId, type Signal } from "@builder.io/qwik";

/**
 * Breadcrumb name overrides context.
 *
 * Maps URL segment values (typically UUIDs / dynamic route params)
 * to human-readable display names so the Breadcrumbs component can
 * show e.g. "Posyandu Melati" instead of a raw UUID.
 *
 * Provided at the authenticated layout level so every role layout
 * (kader, admin, psikolog) and their child pages can participate.
 */
export interface BreadcrumbOverrides {
  [segmentValue: string]: string;
}

export const BreadcrumbContext = createContextId<Signal<BreadcrumbOverrides>>(
  "sidifa.breadcrumb.overrides",
);

/**
 * Safely set a breadcrumb name override without causing infinite re-render loops.
 *
 * This function:
 * 1. Reads the current overrides object directly (the read happens once,
 *    not inside a reactive tracking scope when called from useTask$/useVisibleTask$).
 * 2. Checks if the value already matches — if so, it's a no-op (no new object created,
 *    no signal notification fired, no re-render triggered).
 * 3. Only creates a new object and assigns it when the value actually changed.
 *
 * IMPORTANT: Always call this from inside useTask$, useVisibleTask$, or $() callbacks.
 * NEVER call this directly in the component body (outside of a task/effect).
 */
export function setBreadcrumbName(
  overrides: Signal<BreadcrumbOverrides>,
  key: string,
  name: string,
): void {
  const current = overrides.value;
  if (current[key] === name) return;
  overrides.value = { ...current, [key]: name };
}
