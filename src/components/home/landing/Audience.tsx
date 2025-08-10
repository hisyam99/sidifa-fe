import { component$ } from "@builder.io/qwik";
import {
  LuShield,
  LuStethoscope,
  LuUsers,
} from "~/components/icons/lucide-optimized";
import CardImgKader from "~/media/home/section-3.jpg?w=640&h=320&jsx";
import CardImgPsikolog from "~/media/home/section-4.jpg?w=640&h=320&jsx";
import CardImgInstansi from "~/media/home/section-5.jpg?w=640&h=320&jsx";

export const Audience = component$(() => {
  const items = [
    {
      title: "Kader Posyandu",
      icon: LuStethoscope,
      desc: "Pendataan IBK dan akses materi.",
      img: CardImgKader,
    },
    {
      title: "Psikolog",
      icon: LuUsers,
      desc: "Rujukan & catatan asesmen.",
      img: CardImgPsikolog,
    },
    {
      title: "Instansi/Pemda",
      icon: LuShield,
      desc: "Dasar kebijakan melalui statistik.",
      img: CardImgInstansi,
    },
  ] as const;
  return (
    <section id="untuk-siapa" class="py-14 lg:py-20" data-animate="section">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-10">
          <h2 class="text-3xl lg:text-4xl font-bold mb-3">Untuk Siapa</h2>
          <p class="text-base-content/70">
            Semua pihak yang terlibat dalam layanan posyandu disabilitas
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ title, icon: Icon, desc, img: Img }) => (
            <div
              key={title}
              class="card bg-base-100 shadow-md hover:shadow-xl transition"
            >
              <figure class="h-40 overflow-hidden">
                <Img alt={`Ilustrasi untuk ${title}`} />
              </figure>
              <div class="card-body">
                <div class="flex items-center gap-2">
                  <Icon class="w-5 h-5 text-primary" />
                  <h3 class="card-title text-lg">{title}</h3>
                </div>
                <p class="text-base-content/70">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
