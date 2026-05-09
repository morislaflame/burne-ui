import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Отдельный Vite-конфиг для Storybook (без vite-plugin-dts и library mode). */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
