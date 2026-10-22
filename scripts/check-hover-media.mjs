#!/usr/bin/env node
// `hover:` utilities must keep Tailwind's `@media (hover: hover)` wrap.
// A bare `:hover` sticks on touch after a tap. `data-force-state` stays outside that query.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "dist/ui.css");
const css = readFileSync(file, "utf8");

function stripHoverMedia(source) {
  const re = /@media\s*\(\s*hover\s*:\s*hover\s*\)\s*\{/g;
  let out = "";
  let last = 0;
  for (const match of source.matchAll(re)) {
    out += source.slice(last, match.index);
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < source.length && depth > 0) {
      if (source[index] === "{") depth += 1;
      else if (source[index] === "}") depth -= 1;
      index += 1;
    }
    last = index;
  }
  return out + source.slice(last);
}

const hoverPseudo = /\.hover\\:[^{}]*:hover/;
const outside = stripHoverMedia(css);

if (!/@media\s*\(\s*hover\s*:\s*hover\s*\)/.test(css)) {
  console.error("check-hover-media: dist/ui.css has no @media (hover: hover)");
  process.exit(1);
}

if (!css.includes('[data-force-state~="hover"]')) {
  console.error("check-hover-media: dist/ui.css lost the data-force-state hover match");
  process.exit(1);
}

if (!hoverPseudo.test(css)) {
  console.error("check-hover-media: dist/ui.css has no hover: utility");
  process.exit(1);
}

if (hoverPseudo.test(outside)) {
  console.error("check-hover-media: a hover: :hover rule sits outside @media (hover: hover)");
  const sample = outside.match(/\.hover\\:[^{]{0,120}:hover/)?.[0];
  if (sample) console.error(`  ${sample}`);
  process.exit(1);
}

console.log("check-hover-media: OK — hover: :hover rules are inside @media (hover: hover)");
