import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="footer footer-center p-10 bg-base-200 text-base-content">
      <aside>
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-12">
            <span class="text-xl font-bold">S</span>
          </div>
        </div>
        <p class="font-bold text-lg">
          SIDIFA <br />
          Sistem Informasi Digital Posyandu dan Psikolog
        </p>
        <p>Copyright © 2024 - All rights reserved</p>
      </aside>
      <nav>
        <div class="grid grid-flow-col gap-4">
          <a href="/" class="link link-hover">
            Beranda
          </a>
          <a href="/auth/login" class="link link-hover">
            Login
          </a>
          <a href="/auth/signup/posyandu" class="link link-hover">
            Daftar Posyandu
          </a>
          <a href="/auth/signup/psikolog" class="link link-hover">
            Daftar Psikolog
          </a>
        </div>
      </nav>
    </footer>
  );
});
