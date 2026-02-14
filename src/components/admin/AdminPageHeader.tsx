import { component$, Slot } from "@builder.io/qwik";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

/**
 * Unified page header for all admin dashboard pages.
 * Provides consistent title, description, and optional action area via <Slot />.
 *
 * Usage:
 * ```
 * <AdminPageHeader title="Dashboard" description="Overview of your system">
 *   <button class="btn btn-primary">Action</button>
 * </AdminPageHeader>
 * ```
 */
export const AdminPageHeader = component$<AdminPageHeaderProps>((props) => {
  const { title, description } = props;

  return (
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold tracking-tight text-base-content">
            {title}
          </h1>
          {description && (
            <p class="mt-1 text-sm text-base-content/60 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Slot />
        </div>
      </div>
    </div>
  );
});
