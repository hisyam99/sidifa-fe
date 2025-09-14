import { component$ } from "@qwik.dev/core";
import LogoSidifa from "~/media/logo/umm-logo.png?jsx";
import LogoLinksos from "~/media/logo/linksos-logo.png?jsx";

export const PartnersMarquee = component$(() => {
  const items = [
    { id: "sidifa-1", Comp: LogoSidifa, alt: "SIDIFA" },
    { id: "linksos-1", Comp: LogoLinksos, alt: "LINKSOS" },
    { id: "sidifa-2", Comp: LogoSidifa, alt: "SIDIFA" },
    { id: "linksos-2", Comp: LogoLinksos, alt: "LINKSOS" },
    { id: "sidifa-3", Comp: LogoSidifa, alt: "SIDIFA" },
    { id: "linksos-3", Comp: LogoLinksos, alt: "LINKSOS" },
  ];

  return (
    <section class="py-8 lg:py-10" aria-label="Mitra">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6">
          <p class="text-base-content/80">
            Didukung komunitas dan pemangku kepentingan
          </p>
        </div>
        <div class="overflow-hidden">
          <div
            class="flex gap-8 sm:gap-10 lg:gap-16 items-center justify-center [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            data-animate="marquee"
          >
            {items.map(({ id, Comp, alt }) => (
              <div
                key={id}
                class="opacity-90 hover:opacity-100 transition flex items-center justify-center"
                style={{
                  width: "clamp(140px, 24vw, 200px)",
                  height: "clamp(48px, 8vw, 72px)",
                  padding: "0.25rem",
                }}
              >
                <Comp class="w-full h-full object-contain" alt={alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
