import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** English aria / placeholder copy must live in burneLabels, not in components. */
const FORBIDDEN = [
  "Select a value",
  "Select a date",
  "Select a range",
  "Select file",
  "Search…",
  "Loading…",
  '"Increase"',
  '"Decrease"',
  "'Increase'",
  "'Decrease'",
];

const root = new URL("../src/components", import.meta.url).pathname;
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;
    if (/\.(test|stories)\.(ts|tsx)$/.test(name)) continue;
    const text = readFileSync(path, "utf8");
    for (const needle of FORBIDDEN) {
      if (text.includes(needle)) {
        hits.push(`${relative(process.cwd(), path)}: ${needle}`);
      }
    }
  }
}

walk(root);

if (hits.length > 0) {
  console.error("English aria/placeholder literals outside burneLabels:\n" + hits.join("\n"));
  process.exit(1);
}

console.log("burne label literals ok");
