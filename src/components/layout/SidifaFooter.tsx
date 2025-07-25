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
} from "~/components/icons/lucide-optimized"; // Changed import source
import {
  ContactItem,
  FeatureCard,
  FooterLink,
  FooterSection,
  SocialButton,
} from "~/components/common";

export const SidifaFooter = component$(() => {
  return (
    <footer class="footer footer-center p-10 bg-gradient-to-br from-base-200 to-base-300 text-base-content border-t border-base-200/50">
      <div class="container mx-auto px-4">
        {/* Main Footer Content */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <FooterSection
            title="SIDIFA"
            gradientClass="text-gradient-primary"
            textAlign="center"
          >
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
          </FooterSection>

          {/* Quick Links */}
          <FooterSection
            title="Layanan"
            gradientClass="text-gradient-secondary"
            textAlign="center"
          >
            <ul class="space-y-2">
              <FooterLink href="/" label="Beranda" />
              <FooterLink href="/auth/login" label="Masuk" />
              <FooterLink href="/auth/signup/kader" label="Daftar Posyandu" />
              <FooterLink
                href="/auth/signup/psikolog"
                label="Daftar Psikolog"
              />
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection
            title="Kontak"
            gradientClass="text-gradient-secondary"
            textAlign="center"
          >
            <div class="space-y-3">
              <ContactItem icon={LuMapPin} text="Malang, Jawa Timur" />
              <ContactItem icon={LuPhone} text="+62 341 123456" />
              <ContactItem icon={LuMail} text="info@sidifa.id" />
            </div>
          </FooterSection>

          {/* Social Media */}
          <FooterSection
            title="Ikuti Kami"
            gradientClass="text-gradient-secondary"
            textAlign="center"
          >
            <div class="flex justify-center lg:justify-start gap-3">
              <SocialButton icon={LuFacebook} ariaLabel="Facebook" />
              <SocialButton icon={LuInstagram} ariaLabel="Instagram" />
              <SocialButton icon={LuTwitter} ariaLabel="Twitter" />
              <SocialButton icon={LuYoutube} ariaLabel="YouTube" />
            </div>
          </FooterSection>
        </div>

        {/* Features Section */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FeatureCard
            icon={LuUsers}
            title="Layanan Inklusif"
            description="Mendukung semua kalangan"
          />
          <FeatureCard
            icon={LuShield}
            title="Keamanan Data"
            description="Terlindungi dan terpercaya"
          />
          <FeatureCard
            icon={LuZap}
            title="Akses Cepat"
            description="Real-time dan responsif"
          />
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
            <FooterLink isButton={true} label="Kebijakan Privasi" />
            <FooterLink isButton={true} label="Syarat & Ketentuan" />
            <FooterLink isButton={true} label="Bantuan" />
          </nav>
        </div>
      </div>
    </footer>
  );
});
