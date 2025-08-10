import { component$ } from "@builder.io/qwik";

interface AvatarProps {
  email?: string;
  name?: string;
  src?: string;
  alt?: string;
  size?: string; // e.g. 'w-10 h-10'
  className?: string;
}

export const Avatar = component$<AvatarProps>(
  ({
    email,
    name,
    src,
    alt = "Avatar",
    size = "w-10 h-10",
    className = "",
  }) => {
    const initial = (
      name?.trim()?.charAt(0) ||
      email?.trim()?.charAt(0) ||
      ""
    ).toUpperCase();

    return (
      <span
        class={`rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 inline-flex items-center justify-center ${size} ${className}`}
      >
        <span class="rounded-full w-full h-full overflow-hidden flex items-center justify-center bg-gradient-primary">
          {src ? (
            <img src={src} alt={alt} class="w-full h-full object-cover" />
          ) : initial ? (
            <span class="font-bold text-base-content text-sm md:text-base">
              {initial}
            </span>
          ) : (
            <span class="skeleton w-full h-full rounded-full"></span>
          )}
        </span>
      </span>
    );
  },
);
