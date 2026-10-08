import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../src/skins");
const skip = new Set([
  "skinTypes.ts",
  "skinContract.test.ts",
  "skinProvider.test.tsx",
  "skinPublicApi.test.tsx",
]);
const forbidden = [
  "--color-focus-ring",
  "--color-focus-ring-danger",
  "--color-focus-ring-success",
  "--color-focus-ring-info",
  "--color-focus-ring-warning",
  "--focus-ring-width",
  "--focus-ring-offset",
];

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else if (name.endsWith(".ts") || name.endsWith(".tsx")) files.push(path);
  }
  return files;
}

let failed = false;
for (const file of walk(root)) {
  if (skip.has(file.slice(root.length + 1))) continue;
  const text = readFileSync(file, "utf8");
  for (const token of forbidden) {
    if (text.includes(`"${token}":`) || text.includes(`'${token}':`)) {
      console.error(`${file} sets forbidden skin token ${token}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("kit skins do not set focus-ring tokens");
