import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    /** Readable `ui.css` for npm (not minified to a single line). */
    cssMinify: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        internal: path.resolve(__dirname, "src/internal.ts"),
      },
      name: "BurneUI",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.cjs`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^react-icons(\/.*)?$/,
      ],
      output: {
        assetFileNames: "ui.css",
      },
    },
  },
});
