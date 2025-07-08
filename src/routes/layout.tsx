import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Header from "../components/starter/header/header";
import Footer from "../components/starter/footer/footer";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <Header />
      <nav class="flex gap-4 justify-center my-4">
        <a class="btn btn-sm btn-outline" href="/login">Login</a>
        <a class="btn btn-sm btn-outline" href="/signup-posyandu">Signup Posyandu</a>
        <a class="btn btn-sm btn-outline" href="/signup-psikolog">Signup Psikolog</a>
        <a class="btn btn-sm btn-outline" href="/profile">Profile</a>
        <a class="btn btn-sm btn-outline" href="/forgot-password">Forgot Password</a>
        <a class="btn btn-sm btn-outline" href="/reset-password">Reset Password</a>
      </nav>
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
