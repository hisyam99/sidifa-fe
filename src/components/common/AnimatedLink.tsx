import { component$, useSignal, useTask$, $, QRL } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface AnimatedLinkProps {
  href: string;
  class?: string;
  prefetch?: boolean;
  onClick$?: QRL<() => void>;
  children?: any;
}

/**
 * AnimatedLink component that provides better control over prefetch behavior
 * and ensures animations are triggered even with prefetch enabled.
 *
 * @param href - The target URL
 * @param class - CSS classes
 * @param prefetch - Whether to prefetch the page (default: true)
 * @param onClick$ - Optional click handler (must be QRL function)
 * @param children - Link content
 */
export const AnimatedLink = component$<AnimatedLinkProps>(
  ({ href, class: className = "", prefetch = true, onClick$, children }) => {
    const location = useLocation();
    const isNavigating = useSignal(false);

    useTask$(({ track }) => {
      const currentPath = track(() => location.url.pathname);

      // If we're navigating to a different path, trigger animation
      if (currentPath !== href && isNavigating.value) {
        // Animation will be handled by AnimatedPageContainer
        setTimeout(() => {
          isNavigating.value = false;
        }, 100);
      }
    });

    const handleClick = $(() => {
      // Set navigating state to trigger animation
      if (location.url.pathname !== href) {
        isNavigating.value = true;
      }
    });

    return (
      <Link
        href={href}
        class={className}
        prefetch={prefetch}
        onClick$={onClick$ ? [onClick$, handleClick] : handleClick}
      >
        {children}
      </Link>
    );
  },
);
