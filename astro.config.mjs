// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import compressor from "astro-compressor";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://startpage.chaitanyas.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [alpinejs(), icon(), compress(), compressor()],
});
