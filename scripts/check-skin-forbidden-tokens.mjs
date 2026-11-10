import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const kitRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(kitRoot, "..");
const forbidden = ["--focus-ring-width", "--focus-ring-offset"];
const token = forbidden.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
const assignment = new RegExp(`(?:["'](?:${token})["']\\s*:|--(?:focus-ring-width|focus-ring-offset)\\s*:)`);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === "coverage") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path, acc);
      continue;
    }
    if (/\.(test|stories)\./.test(name)) continue;
    if (/\.(tsx?|css|json|mjs)$/.test(name)) acc.push(path);
  }
  return acc;
}

const roots = [
  join(kitRoot, "src/skins"),
  join(kitRoot, "cli/templates"),
  join(repoRoot, "burne-ui-skin-gloss/src"),
  join(repoRoot, "burne-ui-skin-cybercore/src"),
  join(repoRoot, "burne-ui-skin-neobrutalism/src"),
];

let failed = false;
for (const root of roots) {
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    if (!assignment.test(text)) continue;
    console.error(`${relative(repoRoot, file)} sets focus-ring width or offset`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("skin sources do not set focus-ring width or offset");
