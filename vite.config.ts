import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, "src");

/** Build-only CSS entry name — stub JS is deleted after emit; keep `dist/ui.css`. */
const STYLES_ENTRY = "styles.entry";

const SERVER_SAFE_FACADES = new Set([
  path.join(srcDir, "index.ts"),
  path.join(srcDir, "internal.ts"),
  path.join(srcDir, "utils/cn.ts"),
  path.join(srcDir, "utils/prettify.ts"),
  path.join(srcDir, "theme/themeScript.ts"),
  path.join(srcDir, `${STYLES_ENTRY}.ts`),
]);

function normalizeId(id: string): string {
  return path.normalize(id.split("?")[0] ?? id);
}

function isServerSafeFacade(id: string | null | undefined): boolean {
  if (!id) return true;
  const normalized = normalizeId(id);
  if (SERVER_SAFE_FACADES.has(normalized)) return true;
  const tokensDir = path.join(srcDir, "tokens") + path.sep;
  return normalized.startsWith(tokensDir);
}

function sourceImportsClientRuntime(id: string | null | undefined): boolean {
  if (!id) return false;
  const file = normalizeId(id);
  if (!file.startsWith(srcDir) || !/\.(tsx|ts|jsx|js)$/.test(file)) return false;
  try {
    const code = fs.readFileSync(file, "utf8");
    return /from\s+["'](react|react-dom|react\/jsx-runtime|react\/jsx-dev-runtime|gsap|gsap\/[^"']+|react-icons(?:\/[^"']+)?)["']/.test(
      code,
    );
  } catch {
    return false;
  }
}

function useClientBanner(chunk: {
  name: string;
  fileName: string;
  facadeModuleId?: string | null;
}): string {
  if (chunk.name === STYLES_ENTRY || chunk.fileName.startsWith(`${STYLES_ENTRY}.`)) {
    return "";
  }
  if (isServerSafeFacade(chunk.facadeModuleId)) return "";
  if (!sourceImportsClientRuntime(chunk.facadeModuleId)) return "";
  return '"use client";';
}

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
          if (!entry.name.endsWith(".js") && !entry.name.endsWith(".cjs")) continue;
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
      exclude: [`src/${STYLES_ENTRY}.ts`],
    }),
    stripCssImportsFromJs(),
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
        /** Emits `ui.css`; stub JS removed in `dropStylesEntryArtifacts`. */
        [STYLES_ENTRY]: path.resolve(srcDir, `${STYLES_ENTRY}.ts`),
      },
      name: "BurneUI",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
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
        /**
         * Per-file `"use client"` for Next.js. Barrels, `cn`, tokens, and
         * `ThemeScript` stay server-safe so `import { cn }` is not a client boundary.
         */
        banner: useClientBanner,
      },
    },
  },
});
