import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuArrowRight } from "~/components/icons/lucide-optimized";
import CtaImg from "~/media/home/section-6.jpg?w=800&h=520&jsx";

export const CTASection = component$(() => {
  return (
    <section id="mulai" class="py-14 lg:py-20" data-animate="section">
      <div class="container mx-auto px-4">
        <div class="card bg-base-100 shadow-xl border">
          <div class="card-body grid grid-cols-1 lg:grid-cols-2 items-center">
            <div class="flex flex-col items-center">
              <div class="flex flex-col items-start">
                <h3 class="text-3xl font-bold mb-2 text-gradient-secondary text-base-content">
                  Mulai Menggunakan SI-DIFA
                </h3>
                <p class="text-base-content/80 mb-4">
                  Daftar sebagai kader atau masuk jika sudah memiliki akun.
                </p>
                <div class="flex flex-wrap items-center gap-3">
                  <Link
                    href="/auth/signup/kader"
                    class="btn btn-primary btn-lg gap-2"
                  >
                    Daftar sebagai Kader <LuArrowRight class="w-5 h-5" />
                  </Link>
                  <Link href="/auth/login" class="btn btn-ghost btn-lg gap-2">
                    Masuk <LuArrowRight class="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div class="relative">
              <CtaImg alt="Ilustrasi ajakan untuk mulai menggunakan SI-DIFA" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
