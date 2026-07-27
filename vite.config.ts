import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Build-only CSS entry name — stub JS is deleted after emit; keep `dist/ui.css`. */
const STYLES_ENTRY = "styles.entry";

function dropStylesEntryArtifacts(): Plugin {
  return {
    name: "burne-ui-drop-styles-entry",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      for (const file of [
        `${STYLES_ENTRY}.js`,
        `${STYLES_ENTRY}.cjs`,
        `${STYLES_ENTRY}.d.ts`,
      ]) {
        const target = path.join(dist, file);
        if (fs.existsSync(target)) fs.unlinkSync(target);
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      insertTypesEntry: true,
      rollupTypes: false,
      exclude: [`src/${STYLES_ENTRY}.ts`],
    }),
    dropStylesEntryArtifacts(),
  ],
  build: {
    /** Readable `ui.css` for npm (not minified to a single line). */
    cssMinify: false,
    lib: {
      entry: {
        index: path.resolve(rootDir, "src/index.ts"),
        internal: path.resolve(rootDir, "src/internal.ts"),
        /** Emits `ui.css`; stub JS removed in `dropStylesEntryArtifacts`. */
        [STYLES_ENTRY]: path.resolve(rootDir, `src/${STYLES_ENTRY}.ts`),
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
        /^gsap(\/.*)?$/,
      ],
      output: {
        assetFileNames: "ui.css",
        /**
         * Next.js App Router: mark package entries as Client Components so
         * consumers can import from Server Components without a local wrapper.
         * (Flat lib bundle — cannot preserve per-file directives.)
         */
        banner: (chunk) =>
          chunk.name === STYLES_ENTRY || chunk.fileName.startsWith(`${STYLES_ENTRY}.`)
            ? ""
            : '"use client";',
      },
    },
  },
});
