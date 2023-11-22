import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    svelte(),

    viteStaticCopy({
      targets: [
          {
              src: [
                  'node_modules/bg2e/node_modules/bg2io/bg2io.js',
                  'node_modules/bg2e/node_modules/bg2io/bg2io.wasm'
              ],
              dest: 'bg2io'
          }
      ]
  })
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  }
}));
