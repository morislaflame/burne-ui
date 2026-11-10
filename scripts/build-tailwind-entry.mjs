#!/usr/bin/env node
// `cli/tailwind.css` = theme bridge + every `@utility` from `src/styles.css`.
// No preflight, no `@layer base`. Apps import it next to `burne-ui/styles.css`.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stylesPath = path.join(root, "src/styles.css");
const bridgePath = path.join(root, "cli/theme-bridge.css");
const outPath = path.join(root, "cli/tailwind.css");

/** @param {string} css */
export function utilityBlocks(css) {
  /** @type {string[]} */
  const blocks = [];
  const re = /@utility\s+([\w-]+)\s*\{/g;
  let match = re.exec(css);
  while (match) {
    let depth = 1;
    let i = match.index + match[0].length;
    while (i < css.length && depth > 0) {
      const ch = css[i];
      if (ch === "{") depth += 1;
      else if (ch === "}") depth -= 1;
      i += 1;
    }
    blocks.push(css.slice(match.index, i).trim());
    re.lastIndex = i;
    match = re.exec(css);
  }
  return blocks;
}

/** @param {string} css */
export function utilityNames(css) {
  return utilityBlocks(css).map((block) => {
    const name = /^@utility\s+([\w-]+)/.exec(block);
    if (!name) throw new Error("utility block has no name");
    return name[1];
  });
}

export function renderTailwindEntry() {
  const styles = readFileSync(stylesPath, "utf8");
  const bridge = readFileSync(bridgePath, "utf8").trim();
  const blocks = utilityBlocks(styles);
  if (blocks.length === 0) throw new Error("no @utility blocks in src/styles.css");
  return [
    "/*",
    " * Consumer Tailwind v4 entry.",
    " *",
    " * `@theme inline` rebinds kit tokens. `@utility` blocks are the kit utilities",
    " * (focus-ring, shadow-token-*, divide-x-token, …) so the app generates variants",
    " * such as `md:shadow-token-mid`. Preflight and component CSS stay in",
    " * `burne-ui/styles.css`.",
    " *",
    " *   @import \"burne-ui/styles.css\";",
    " *   @import \"burne-ui/tailwind.css\";",
    " */",
    bridge,
    "",
    blocks.join("\n\n"),
    "",
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(outPath, renderTailwindEntry());
  const count = utilityNames(readFileSync(stylesPath, "utf8")).length;
  console.log(`build-tailwind-entry: wrote cli/tailwind.css (${count} utilities)`);
}
