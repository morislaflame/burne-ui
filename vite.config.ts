import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

import { componentLibEntries } from "./scripts/componentEntries.mjs";
import {
  isServerSafeDistFile,
  needsUseClient,
  prependUseClient,
} from "./scripts/rscBoundaries.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, "src");

/** Build-only CSS entry name — stub JS is deleted after emit; keep `dist/ui.css`. */
const STYLES_ENTRY = "styles.entry";

function dropStylesEntryArtifacts(): Plugin {
  return {
    name: "burne-ui-drop-styles-entry",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      for (const file of [`${STYLES_ENTRY}.js`, `${STYLES_ENTRY}.d.ts`]) {
        const target = path.join(dist, file);
        if (fs.existsSync(target)) fs.unlinkSync(target);
      }
    },
  };
}

/**
 * Per-file `"use client"` from emitted JS so Next App Router sees facades
 * (`Object.assign` on a client import) and automatic JSX runtime.
 * Barrels, `cn`, tokens, and `ThemeScript` stay server-safe.
 */
function rscUseClientPlugin(): Plugin {
  return {
    name: "burne-ui-use-client",
    apply: "build",
    renderChunk(code, chunk) {
      if (isServerSafeDistFile(chunk.fileName)) return null;
      if (!needsUseClient(code)) return null;
      const next = prependUseClient(code);
      return next === code ? null : next;
    },
  };
}

/** CSS is shipped as `ui.css`; do not leave `.css` imports in published JS. */
function stripCssImportsFromJs(): Plugin {
  const emptyCssComment = /\/\* empty css[^*]*\*\//g;
  const cssImport = /^\s*import\s+["'][^"']+\.css["'];?\r?\n/gm;

  function strip(code: string): string {
    return code.replace(cssImport, "").replace(emptyCssComment, "");
  }

  return {
    name: "burne-ui-strip-css-imports",
    apply: "build",
    renderChunk(code) {
      if (!code.includes(".css") && !code.includes("empty css")) return null;
      const next = strip(code);
      return next === code ? null : next;
    },
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full);
            continue;
          }
          if (!entry.name.endsWith(".js")) continue;
          const code = fs.readFileSync(full, "utf8");
          if (!code.includes("empty css") && !code.includes(".css")) continue;
          const next = strip(code).replace(/\n{3,}/g, "\n\n");
          if (next !== code) fs.writeFileSync(full, next);
        }
      };
      if (fs.existsSync(dist)) walk(dist);
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      insertTypesEntry: true,
      rollupTypes: false,
      exclude: [`src/${STYLES_ENTRY}.ts`, "src/__tests__/**", "src/**/*.test.ts", "src/**/*.test.tsx"],
    }),
    stripCssImportsFromJs(),
    rscUseClientPlugin(),
    dropStylesEntryArtifacts(),
  ],
  build: {
    /** JS syntax floor of the published bundle. CSS/runtime floor is `browserslist` in package.json. */
    target: "es2020",
    emptyOutDir: true,
    /** Consumer bundlers minify. Keep live `export { x } from` for tree-shaking. */
    minify: false,
    /** Readable `ui.css` for npm (not minified to a single line). */
    cssMinify: false,
    lib: {
      entry: {
        index: path.resolve(srcDir, "index.ts"),
        internal: path.resolve(srcDir, "internal.ts"),
        skin: path.resolve(srcDir, "skin.ts"),
        studio: path.resolve(srcDir, "studio.ts"),
        authoring: path.resolve(srcDir, "authoring.ts"),
        /** Emits `ui.css`; stub JS removed in `dropStylesEntryArtifacts`. */
        [STYLES_ENTRY]: path.resolve(srcDir, `${STYLES_ENTRY}.ts`),
        ...componentLibEntries(rootDir),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => id.endsWith(".css"),
      },
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "clsx",
        "tailwind-merge",
        /^react-icons(\/.*)?$/,
        /^gsap(\/.*)?$/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: srcDir,
        assetFileNames: "ui.css",
      },
    },
  },
});
