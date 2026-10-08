#!/usr/bin/env node
// D5-10: CSS owns kit surface / text / border color (`surface-color-transition`
// and the matching lists). Component runtime must not call `tweenCssColor`.
// The stylesheet default must match `MOTION_CONFIG_DEFAULTS.surfaceTransitionDuration`,
// because `applyMotionCssTokens` drops the inline var when the value is the default.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

const configSrc = await readFile(
  path.join(root, "src/components/core/utils/motionConfig.ts"),
  "utf8",
);
const cssSrc = await readFile(path.join(root, "src/tokens/styles.css"), "utf8");
const defaultsAt = configSrc.indexOf("export const MOTION_CONFIG_DEFAULTS");
const defaults = defaultsAt === -1 ? "" : configSrc.slice(defaultsAt);
const jsDuration = defaults.match(/surfaceTransitionDuration:\s*(\d+)/);
const cssDuration = cssSrc.match(/--motion-surface-duration:\s*(\d+)ms/);
if (!jsDuration || !cssDuration || jsDuration[1] !== cssDuration[1]) {
  errors.push(
    `surfaceTransitionDuration ${jsDuration?.[1] ?? "?"} !== --motion-surface-duration ${cssDuration?.[1] ?? "?"}`,
  );
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const components = await walk(path.join(root, "src/components"));
for (const file of components) {
  if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
  if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith(".stories.tsx")) {
    continue;
  }
  if (file.endsWith(`${path.sep}gsapMotion.ts`)) continue;
  const text = await readFile(file, "utf8");
  if (text.includes("tweenCssColor")) {
    errors.push(`${path.relative(root, file)} calls tweenCssColor`);
  }
}

if (errors.length > 0) {
  console.error(`check-color-single-owner:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  "check-color-single-owner: OK — kit components leave color to CSS; surface duration matches the stylesheet.",
);
