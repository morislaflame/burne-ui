#!/usr/bin/env node
// Fail if the published ESM graph still pulls the whole kit for `import { cn }`.
import * as esbuild from "esbuild";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

const MAX_CN_BYTES = 40 * 1024;
const FORBIDDEN_CN = ["hoverLiftSecondLevel", "from \"gsap\"", "from 'gsap'"];
const UNRELATED = ["TagsInput", "DatePicker", "HoverCard"];
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

/** @param {string} spec `burne-ui` or `burne-ui/Button` */
function localExportFile(spec) {
  const key = spec === "burne-ui" ? "." : spec.replace(/^burne-ui/, ".");
  const target = pkg.exports?.[key];
  const rel = typeof target === "string" ? target : target?.import;
  if (!rel) {
    throw new Error(`check-tree-shaking: no exports[${JSON.stringify(key)}]`);
  }
  const file = path.resolve(root, rel);
  if (!existsSync(file)) {
    throw new Error(`check-tree-shaking: missing ${rel} (exports ${key})`);
  }
  return file;
}

/**
 * @param {{ spec: string, symbol: string, forbidden?: string[] }} options
 */
async function bundleSubpath({ spec, symbol, forbidden = UNRELATED }) {
  const result = await esbuild.build({
    stdin: {
      contents: `import { ${symbol} } from ${JSON.stringify(spec)}; console.log(${symbol});\n`,
      resolveDir: root,
      sourcefile: `check-tree-shaking-${symbol}.js`,
    },
    bundle: true,
    write: false,
    format: "esm",
    treeShaking: true,
    alias: { [spec]: localExportFile(spec) },
    external: EXTERNAL,
    logLevel: "silent",
  });
  const out = result.outputFiles[0]?.text ?? "";
  const hits = forbidden.filter((marker) => out.includes(marker));
  if (hits.length > 0 || !out.includes(symbol)) {
    console.error(`check-tree-shaking: ${spec} pulled another component or lost ${symbol}`);
    if (hits.length > 0) console.error(`  markers: ${hits.join(", ")}`);
    process.exit(1);
  }
  console.log(
    `check-tree-shaking: OK — ${spec} is ${(Buffer.byteLength(out) / 1024).toFixed(1)} kB gzip ${(gzipSync(out).length / 1024).toFixed(1)} kB`,
  );
}

const cnResult = await esbuild.build({
  stdin: {
    contents: 'import { cn } from "burne-ui"; console.log(cn("a"));\n',
    resolveDir: root,
    sourcefile: "check-tree-shaking-cn.js",
  },
  bundle: true,
  write: false,
  format: "esm",
  treeShaking: true,
  alias: { "burne-ui": localExportFile("burne-ui") },
  external: EXTERNAL,
  logLevel: "silent",
});

const cnOut = cnResult.outputFiles[0]?.text ?? "";
const cnBytes = Buffer.byteLength(cnOut);
const cnGzip = gzipSync(cnOut).length;
const cnHits = FORBIDDEN_CN.filter((marker) => cnOut.includes(marker));

if (cnBytes > MAX_CN_BYTES || cnHits.length > 0) {
  console.error(
    `check-tree-shaking: import { cn } is ${(cnBytes / 1024).toFixed(1)} kB gzip ${(cnGzip / 1024).toFixed(1)} kB`,
  );
  if (cnBytes > MAX_CN_BYTES) {
    console.error(`  exceeds ${MAX_CN_BYTES / 1024} kB uncompressed`);
  }
  if (cnHits.length > 0) {
    console.error(`  forbidden markers: ${cnHits.join(", ")}`);
  }
  process.exit(1);
}

console.log(
  `check-tree-shaking: OK — import { cn } is ${(cnBytes / 1024).toFixed(1)} kB gzip ${(cnGzip / 1024).toFixed(1)} kB`,
);

await bundleSubpath({ spec: "burne-ui/Button", symbol: "Button" });
await bundleSubpath({ spec: "burne-ui/Text", symbol: "Text" });
await bundleSubpath({ spec: "burne-ui/Accordion", symbol: "Accordion" });

const SLOT_TABLE = "selectionThumbIcon.root";
await bundleSubpath({ spec: "burne-ui/ListBox", symbol: "ListBox", forbidden: [SLOT_TABLE] });
await bundleSubpath({ spec: "burne-ui/AlertDialog", symbol: "AlertDialog", forbidden: [SLOT_TABLE] });
await bundleSubpath({ spec: "burne-ui/Disclosure", symbol: "Disclosure", forbidden: [SLOT_TABLE] });
await bundleSubpath({ spec: "burne-ui/Select", symbol: "Select", forbidden: [SLOT_TABLE] });
