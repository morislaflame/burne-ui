#!/usr/bin/env node
// Fail if the published ESM graph still pulls the whole kit for `import { cn }`.
import * as esbuild from "esbuild";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndex = path.join(root, "dist/index.js");

const MAX_CN_BYTES = 40 * 1024;
const FORBIDDEN = ["hoverLiftSecondLevel", "from \"gsap\"", "from 'gsap'"];

const result = await esbuild.build({
  stdin: {
    contents: 'import { cn } from "burne-ui"; console.log(cn("a"));\n',
    resolveDir: root,
    sourcefile: "check-tree-shaking-cn.js",
  },
  bundle: true,
  write: false,
  format: "esm",
  treeShaking: true,
  alias: { "burne-ui": distIndex },
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "gsap",
    "gsap/CustomEase",
    "react-icons/io5",
    "clsx",
    "tailwind-merge",
  ],
  logLevel: "silent",
});

const out = result.outputFiles[0]?.text ?? "";
const bytes = Buffer.byteLength(out);
const gzip = gzipSync(out).length;
const hits = FORBIDDEN.filter((marker) => out.includes(marker));

if (bytes > MAX_CN_BYTES || hits.length > 0) {
  console.error(
    `check-tree-shaking: import { cn } is ${(bytes / 1024).toFixed(1)} kB gzip ${(gzip / 1024).toFixed(1)} kB`,
  );
  if (bytes > MAX_CN_BYTES) {
    console.error(`  exceeds ${MAX_CN_BYTES / 1024} kB uncompressed`);
  }
  if (hits.length > 0) {
    console.error(`  forbidden markers: ${hits.join(", ")}`);
  }
  process.exit(1);
}

console.log(
  `check-tree-shaking: OK — import { cn } is ${(bytes / 1024).toFixed(1)} kB gzip ${(gzip / 1024).toFixed(1)} kB`,
);

const button = await esbuild.build({
  stdin: {
    contents: 'import { Button } from "burne-ui/Button"; console.log(Button);\n',
    resolveDir: root,
    sourcefile: "check-tree-shaking-button.js",
  },
  bundle: true,
  write: false,
  format: "esm",
  treeShaking: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "gsap",
    "gsap/CustomEase",
    "react-icons/io5",
    "clsx",
    "tailwind-merge",
  ],
  logLevel: "silent",
});

const buttonOut = button.outputFiles[0]?.text ?? "";
const buttonForbidden = ["TagsInput", "DatePicker", "HoverCard"].filter((marker) => buttonOut.includes(marker));
if (buttonForbidden.length > 0 || !buttonOut.includes("Button")) {
  console.error("check-tree-shaking: burne-ui/Button pulled another component");
  if (buttonForbidden.length > 0) console.error(`  markers: ${buttonForbidden.join(", ")}`);
  process.exit(1);
}

console.log(
  `check-tree-shaking: OK — burne-ui/Button is ${(Buffer.byteLength(buttonOut) / 1024).toFixed(1)} kB gzip ${(gzipSync(buttonOut).length / 1024).toFixed(1)} kB`,
);
