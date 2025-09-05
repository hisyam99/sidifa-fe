import { component$ } from "@builder.io/qwik";
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuFacebook,
  LuInstagram,
  LuTwitter,
  LuYoutube,
} from "~/components/icons/lucide-optimized"; // Changed import source
import {
  ContactItem,
  FooterLink,
  FooterSection,
  SocialButton,
  BrandLogo,
} from "~/components/common";
import { useAuth } from "~/hooks/useAuth";

export const SidifaFooter = component$(() => {
  const { isLoggedIn, user } = useAuth();

  // Fungsi untuk mendapatkan menu layanan berdasarkan status auth
  const getLayananMenu = () => {
    if (!isLoggedIn.value) {
      // Menu untuk user yang belum login
      return [
        { href: "/", label: "Beranda" },
        { href: "/auth/login", label: "Masuk" },
        { href: "/auth/signup/kader", label: "Daftar Posyandu" },
      ];
    }

    // Menu untuk user yang sudah login
    const baseMenu = [{ href: "/", label: "Beranda" }];

    // Tambahkan menu berdasarkan role
    if (user.value?.role === "admin") {
      baseMenu.push({ href: "/admin", label: "Dashboard Admin" });
    } else if (user.value?.role === "kader") {
      baseMenu.push({ href: "/kader", label: "Dashboard Kader" });
    } else if (user.value?.role === "psikolog") {
      baseMenu.push({ href: "/psikolog", label: "Dashboard Psikolog" });
    } else if (user.value?.role === "posyandu") {
      baseMenu.push({ href: "/posyandu", label: "Dashboard Posyandu" });
    }

    return baseMenu;
  };

  const layananMenu = getLayananMenu();

  return (
    <footer
      class="bg-base-200 border-t border-base-300 backdrop-blur supports-[backdrop-filter]:bg-base-200"
      role="contentinfo"
    >
      {/* Decorative wave */}
      <div class="w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

      <div class="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand Section */}
          <div class="text-left">
            <div class="flex items-center justify-start mb-4">
              <BrandLogo hideTextOnMobile={false} size="sm" />
            </div>
            <p class="text-base-content/70 text-sm leading-relaxed">
              Platform terpadu untuk mengelola data kesehatan masyarakat dan
              memberikan layanan konseling yang terintegrasi untuk penyandang
              disabilitas.
            </p>
          </div>

          {/* Quick Links */}
          <FooterSection
            title="Layanan"
            gradientClass="text-gradient-secondary"
          >
            <ul class="space-y-2">
              {layananMenu.map((menuItem) => (
                <FooterLink
                  key={menuItem.href}
                  href={menuItem.href}
                  label={menuItem.label}
                />
              ))}
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Kontak" gradientClass="text-gradient-secondary">
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
          >
            <div class="flex justify-start gap-3">
              <SocialButton icon={LuFacebook} ariaLabel="Facebook" />
              <SocialButton icon={LuInstagram} ariaLabel="Instagram" />
              <SocialButton icon={LuTwitter} ariaLabel="Twitter" />
              <SocialButton icon={LuYoutube} ariaLabel="YouTube" />
            </div>
          </FooterSection>
        </div>

        <div class="divider my-0" />

        {/* Bottom Section */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6">
          <aside class="text-left">
            <p class="text-sm text-base-content/80">
              © 2025 SIDIFA — All rights reserved
            </p>
          </aside>
          <nav
            class="flex flex-wrap justify-start md:justify-end gap-x-6 gap-y-2"
            aria-label="Footer links"
          >
            <FooterLink isButton={true} label="Kebijakan Privasi" />
            <FooterLink isButton={true} label="Syarat & Ketentuan" />
            <FooterLink isButton={true} label="Bantuan" />
          </nav>
        </div>
      </div>
    </footer>
  );
});
