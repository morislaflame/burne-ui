#!/usr/bin/env node
// Initial graph of `import { Button }` / `import { Dialog }`, production,
// without React and GSAP. Async kit-recipe chunks are not part of the entry.
import * as esbuild from "esbuild";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

const EXTERNAL = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "gsap",
  "gsap/CustomEase",
  "react-icons/io5",
  "clsx",
  "tailwind-merge",
];

/** gzip ceilings for the entry chunk */
const LIMITS = {
  Button: 37 * 1024,
  Dialog: 52 * 1024,
};

function exportFile(spec) {
  const key = spec.replace(/^burne-ui/, ".");
  const target = pkg.exports?.[key];
  const rel = typeof target === "string" ? target : target?.import;
  if (!rel) throw new Error(`check-bundle-budget: no exports[${key}]`);
  return path.resolve(root, rel);
}

async function entryGzip(symbol) {
  const spec = `burne-ui/${symbol}`;
  const outdir = mkdtempSync(path.join(tmpdir(), "burne-budget-"));
  try {
    await esbuild.build({
      stdin: {
        contents: `import { ${symbol} } from ${JSON.stringify(spec)}; console.log(${symbol});\n`,
        resolveDir: root,
        sourcefile: `budget-${symbol}.js`,
      },
      bundle: true,
      splitting: true,
      format: "esm",
      outdir,
      entryNames: "entry",
      treeShaking: true,
      alias: { [spec]: exportFile(spec) },
      external: EXTERNAL,
      define: { "process.env.NODE_ENV": '"production"' },
      logLevel: "silent",
    });
    const entry = readFileSync(path.join(outdir, "entry.js"));
    return gzipSync(entry).length;
  } finally {
    rmSync(outdir, { recursive: true, force: true });
  }
}

let failed = false;
for (const [symbol, limit] of Object.entries(LIMITS)) {
  const bytes = await entryGzip(symbol);
  const kb = (bytes / 1024).toFixed(1);
  const cap = (limit / 1024).toFixed(0);
  if (bytes > limit) {
    console.error(`check-bundle-budget: ${symbol} entry is ${kb} kB gzip (limit ${cap})`);
    failed = true;
  } else {
    console.log(`check-bundle-budget: OK — ${symbol} entry ${kb} kB gzip (limit ${cap})`);
  }
}
if (failed) process.exit(1);
