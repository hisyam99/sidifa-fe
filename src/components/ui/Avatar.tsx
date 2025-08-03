import { component$ } from "@builder.io/qwik";

interface AvatarProps {
  email?: string;
  size?: string; // e.g. 'w-10 h-10'
  className?: string;
}

export const Avatar = component$<AvatarProps>(
  ({ email, size = "w-10 h-10", className = "" }) => {
    return (
      <span
        class={`rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 inline-flex items-center justify-center ${size} ${className}`}
      >
        <span class="bg-gradient-primary rounded-full w-full h-full flex items-center justify-center">
          {email ? (
            <span class="font-bold text-base-content text-sm md:text-base">
              {email.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span class="skeleton w-full h-full rounded-full"></span>
          )}
        </span>
      </span>
    );
  },
);
