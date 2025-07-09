import { component$ } from "@builder.io/qwik";
import {
  LuHeart,
  LuMail,
  LuPhone,
  LuMapPin,
  LuFacebook,
  LuInstagram,
  LuTwitter,
  LuYoutube,
  LuUsers,
  LuShield,
  LuZap,
} from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <footer class="footer footer-center p-10 bg-gradient-to-br from-base-200 to-base-300 text-base-content border-t border-base-200/50">
      <div class="container mx-auto px-4">
        {/* Main Footer Content */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div class="text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start mb-4">
              <div class="bg-gradient-primary rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-lg">
                <LuHeart class="w-6 h-6" />
              </div>
              <div class="flex flex-col items-start">
                <span class="font-bold text-xl text-gradient-primary">
                  SIDIFA
                </span>
                <span class="text-sm text-base-content/60 font-medium">
                  Sistem Informasi Difabel
                </span>
              </div>
            </div>
            <p class="text-base-content/70 text-sm leading-relaxed">
              Platform terpadu untuk mengelola data kesehatan masyarakat dan
              memberikan layanan konseling yang terintegrasi untuk penyandang
              disabilitas.
            </p>
          </div>

          {/* Quick Links */}
          <div class="text-center lg:text-left">
            <h3 class="font-bold text-lg mb-4 text-gradient-secondary">
              Layanan
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="/"
                  class="link link-hover text-sm hover:text-primary transition-colors duration-300"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  class="link link-hover text-sm hover:text-primary transition-colors duration-300"
                >
                  Masuk
                </a>
              </li>
              <li>
                <a
                  href="/auth/signup/posyandu"
                  class="link link-hover text-sm hover:text-primary transition-colors duration-300"
                >
                  Daftar Posyandu
                </a>
              </li>
              <li>
                <a
                  href="/auth/signup/psikolog"
                  class="link link-hover text-sm hover:text-primary transition-colors duration-300"
                >
                  Daftar Psikolog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div class="text-center lg:text-left">
            <h3 class="font-bold text-lg mb-4 text-gradient-secondary">
              Kontak
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-center lg:justify-start gap-3">
                <LuMapPin class="w-4 h-4 text-primary" />
                <span class="text-sm text-base-content/70">
                  Malang, Jawa Timur
                </span>
              </div>
              <div class="flex items-center justify-center lg:justify-start gap-3">
                <LuPhone class="w-4 h-4 text-primary" />
                <span class="text-sm text-base-content/70">+62 341 123456</span>
              </div>
              <div class="flex items-center justify-center lg:justify-start gap-3">
                <LuMail class="w-4 h-4 text-primary" />
                <span class="text-sm text-base-content/70">info@sidifa.id</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div class="text-center lg:text-left">
            <h3 class="font-bold text-lg mb-4 text-gradient-secondary">
              Ikuti Kami
            </h3>
            <div class="flex justify-center lg:justify-start gap-3">
              <button
                class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 transition-all duration-300"
                aria-label="Facebook"
              >
                <LuFacebook class="w-5 h-5 text-primary" />
              </button>
              <button
                class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <LuInstagram class="w-5 h-5 text-primary" />
              </button>
              <button
                class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 transition-all duration-300"
                aria-label="Twitter"
              >
                <LuTwitter class="w-5 h-5 text-primary" />
              </button>
              <button
                class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 transition-all duration-300"
                aria-label="YouTube"
              >
                <LuYoutube class="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="flex items-center justify-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm">
            <LuUsers class="w-6 h-6 text-primary" />
            <div class="text-left">
              <h4 class="font-semibold text-sm">Layanan Inklusif</h4>
              <p class="text-xs text-base-content/60">
                Mendukung semua kalangan
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm">
            <LuShield class="w-6 h-6 text-primary" />
            <div class="text-left">
              <h4 class="font-semibold text-sm">Keamanan Data</h4>
              <p class="text-xs text-base-content/60">
                Terlindungi dan terpercaya
              </p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 p-4 bg-base-100/50 backdrop-blur-sm">
            <LuZap class="w-6 h-6 text-primary" />
            <div class="text-left">
              <h4 class="font-semibold text-sm">Akses Cepat</h4>
              <p class="text-xs text-base-content/60">
                Real-time dan responsif
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div class="divider"></div>

        {/* Bottom Section */}
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <aside class="text-center md:text-left">
            <p class="text-sm text-base-content/60">
              Copyright © 2024 SIDIFA - All rights reserved
            </p>
          </aside>
          <nav class="flex gap-4">
            <button class="link link-hover text-sm text-base-content/60 hover:text-primary transition-colors duration-300">
              Kebijakan Privasi
            </button>
            <button class="link link-hover text-sm text-base-content/60 hover:text-primary transition-colors duration-300">
              Syarat & Ketentuan
            </button>
            <button class="link link-hover text-sm text-base-content/60 hover:text-primary transition-colors duration-300">
              Bantuan
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
});
