#!/usr/bin/env node
// Reading direction in component styles uses logical utilities.
// Physical left/right stays only where the prop is a viewport edge or a geometric half.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/components");

/** Placement is a physical side (drawer, toast, badge) or a geometric half / center (calendar). */
const PHYSICAL_ALLOW = new Set([
  "badgeStyles.ts",
  "calendarStyles.ts",
  "drawerStyles.ts",
  "toastStyles.ts",
]);

const TEXT_ALIGN = /\btext-(?:left|right)\b/;
const PHYSICAL =
  /(?:^|[^\w])(?:rounded-[lr]|border-[lr]|(?:left|right|ml|mr|pl|pr))-/;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file, acc);
    else if (name.endsWith("Styles.ts") || name.endsWith("GridLayout.ts")) acc.push(file);
  }
  return acc;
}

const failures = [];
for (const file of walk(root)) {
  const name = path.basename(file);
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (TEXT_ALIGN.test(line)) {
      failures.push(`${path.relative(root, file)}:${index + 1} text alignment must be text-start / text-end`);
    }
    if (!PHYSICAL_ALLOW.has(name) && PHYSICAL.test(line)) {
      failures.push(`${path.relative(root, file)}:${index + 1} physical direction utility`);
    }
  });
}

if (failures.length > 0) {
  console.error("check-logical-directions: physical direction in component styles\n");
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(
    "\nUse start/end, ms/me, ps/pe, border-s/e, rounded-s/e, text-start/end.",
  );
  console.error(
    "Physical left/right is only for a named viewport edge or a calendar cell half.",
  );
  process.exit(1);
}

console.log("check-logical-directions: OK");
