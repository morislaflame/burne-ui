#!/usr/bin/env node
// Skin packages and app templates must peer the kit major: ^2.0.0 while version is 2.x.y.
// Sibling repos are checked when they sit next to the kit and skipped when this checkout is the kit alone.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(kitRoot, "..");

const kitFiles = [
  "cli/templates/skin/package.json",
  "cli/templates/skin-tier-2/package.json",
  "cli/templates/skin-tier-3/package.json",
];

const siblingFiles = [
  "create-burne-app/templates/skin/package.json",
  "create-burne-app/templates/vite/package.json",
  "create-burne-app/templates/next/package.json",
  "burne-ui-skin-gloss/package.json",
  "burne-ui-skin-neobrutalism/package.json",
  "burne-ui-skin-cybercore/package.json",
];

function peerFor(version) {
  const major = String(version).split(".")[0];
  if (!/^\d+$/.test(major)) return null;
  return `^${major}.0.0`;
}

function readPeer(file) {
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  return pkg.peerDependencies?.["burne-ui"] ?? pkg.dependencies?.["burne-ui"];
}

const kitPkg = JSON.parse(readFileSync(path.join(kitRoot, "package.json"), "utf8"));
const expected = peerFor(kitPkg.version);
const errors = [];

if (expected == null) {
  errors.push(`package.json version ${kitPkg.version} has no numeric major`);
}

const skinDocument = readFileSync(path.join(kitRoot, "src/skins/skinDocument.ts"), "utf8");
if (expected != null && !skinDocument.includes(`export const SKIN_PACKAGE_PEER = "${expected}"`)) {
  errors.push(`src/skins/skinDocument.ts: SKIN_PACKAGE_PEER must be ${expected}`);
}

if (expected != null) {
  for (const relative of kitFiles) {
    const file = path.join(kitRoot, relative);
    const peer = readPeer(file);
    if (peer !== expected) {
      errors.push(`${relative}: burne-ui is ${peer ?? "missing"}, expected ${expected}`);
    }
  }

  for (const relative of siblingFiles) {
    const file = path.join(repoRoot, relative);
    if (!existsSync(file)) continue;
    const peer = readPeer(file);
    if (peer !== expected) {
      errors.push(`${relative}: burne-ui is ${peer ?? "missing"}, expected ${expected}`);
    }
  }
}

if (errors.length > 0) {
  console.error("check-release-peer:\n" + errors.map((line) => `- ${line}`).join("\n"));
  process.exit(1);
}

const skipped = siblingFiles.filter((relative) => !existsSync(path.join(repoRoot, relative))).length;
console.log(
  `check-release-peer: OK (${expected}${skipped > 0 ? `, ${skipped} sibling file(s) not in this checkout` : ""})`,
);
