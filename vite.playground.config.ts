import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Локальное приложение `playground/` (не библиотечный lib-mode). */
export default defineConfig({
  root: path.resolve(__dirname, "playground"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "burne-ui": path.resolve(__dirname, "src/index.ts"),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // tuna.am и другие туннели шлют Host != localhost
    allowedHosts: [".tuna.am", "localhost"],
  },
});
