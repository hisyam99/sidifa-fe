import { component$, useVisibleTask$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import {
  Hero,
  PartnersMarquee,
  About,
  Features,
  HowItWorks,
  Audience,
  FAQCompact,
  CTASection,
} from "~/components/home/landing";
import { animate, inView } from "motion";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    inView(
      "[data-animate=fade-up]",
      (el) => {
        animate(
          el,
          { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] },
          { duration: 0.7, ease: "easeOut" },
        );
      },
      { amount: 0.2 },
    );

    const features = document.querySelectorAll("[data-animate=feature]");
    features.forEach((el, idx) => {
      animate(
        el,
        { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
        { delay: idx * 0.08, duration: 0.6, ease: "easeOut" },
      );
    });

    const sections = document.querySelectorAll("[data-animate=section]");
    sections.forEach((el, idx) => {
      animate(
        el,
        { opacity: [0, 1], transform: ["translateY(18px)", "translateY(0)"] },
        { delay: idx * 0.08, duration: 0.6, ease: "easeOut" },
      );
    });

    const marquee = document.querySelector("[data-animate=marquee]");
    if (marquee) {
      animate(
        marquee,
        { transform: ["translateX(0)", "translateX(-40px)", "translateX(0)"] },
        { duration: 10, ease: "linear", repeat: Infinity },
      );
    }
  });

  return (
    <main class="bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 animate-fade-in-up">
      <Hero />
      <PartnersMarquee />
      <About />
      <Features />
      <HowItWorks />
      <Audience />
      <FAQCompact />
      <CTASection />
    </main>
  );
});

export const head: DocumentHead = {
  title: "SI-DIFA — Digitalisasi Posyandu Disabilitas",
  meta: [
    {
      name: "description",
      content:
        "SI-DIFA: platform pendataan IBK, informasi inklusi, lowongan kerja, dan laporan statistik untuk posyandu disabilitas.",
    },
  ],
};
