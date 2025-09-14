import { bunServerAdapter } from "@qwik.dev/router/adapters/bun-server/vite";
import { extendConfig } from "@qwik.dev/router/vite";
import { _TextEncoderStream_polyfill } from "@qwik.dev/router/middleware/request-handler";
import baseConfig from "../../vite.config.mts";
import "dotenv/config";

// This polyfill is required when you use SSG and build your app with Bun, because Bun does not have TextEncoderStream. See: https://github.com/oven-sh/bun/issues/5648
(
  globalThis as {
    TextEncoderStream?: {
      new (): TextEncoderStream;
      prototype: TextEncoderStream;
    };
  }
).TextEncoderStream ||= _TextEncoderStream_polyfill as unknown as {
  new (): TextEncoderStream;
  prototype: TextEncoderStream;
};

export default extendConfig(baseConfig as any, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.bun.ts"],
      },
      minify: true,
    },
    plugins: [
      bunServerAdapter({
        ssg: {
          include: ["/*"],
          exclude: [
            "/auth/login",
            "/auth/reset-password", // Exclude reset-password karena butuh dynamic token
            "/auth/reset-password/*", // Exclude semua sub-routes juga
          ],
          origin: process.env.PUBLIC_BASE_URL || "__PUBLIC_BASE_URL__",
          maxWorkers: 1, // Limit Workers to 1, otherwise SSG will hang when compiling Qwik City app with `bun run --bun build`.
        },
      }),
    ],
  } as any;
});
