#!/usr/bin/env node
// browserslist in package.json must match the floor table in README, SETUP, and the site browsers pages.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(kitRoot, "..");

const docs = [
  path.join(kitRoot, "README.md"),
  path.join(kitRoot, "docs/SETUP.md"),
  path.join(repoRoot, "burne-ui-site/content/docs/browsers/ru.md"),
  path.join(repoRoot, "burne-ui-site/content/docs/browsers/en.md"),
];

const expected = {
  chrome: "111",
  safari: "16.4",
  firefox: "128",
};

function versionsFromTable(source) {
  const found = {};
  for (const line of source.split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim());
    if (cells.length < 4) continue;
    const name = cells[1].toLowerCase();
    const version = cells[2];
    if (!/^\d+(?:\.\d+)?$/.test(version)) continue;
    if (name.includes("chrome")) found.chrome = version;
    else if (name.includes("safari")) found.safari = version;
    else if (name.includes("firefox")) found.firefox = version;
  }
  return found;
}

function browserslistFor(versions) {
  return [
    `chrome >= ${versions.chrome}`,
    `and_chr >= ${versions.chrome}`,
    `edge >= ${versions.chrome}`,
    `firefox >= ${versions.firefox}`,
    `and_ff >= ${versions.firefox}`,
    `safari >= ${versions.safari}`,
    `ios_saf >= ${versions.safari}`,
  ];
}

const errors = [];

for (const file of docs) {
  const found = versionsFromTable(readFileSync(file, "utf8"));
  const label = path.relative(repoRoot, file);
  for (const key of Object.keys(expected)) {
    if (found[key] !== expected[key]) {
      errors.push(`${label}: ${key} is ${found[key] ?? "missing"}, expected ${expected[key]}`);
    }
  }
}

const pkg = JSON.parse(readFileSync(path.join(kitRoot, "package.json"), "utf8"));
const actual = pkg.browserslist ?? [];
const wanted = browserslistFor(expected);
if (actual.join("\n") !== wanted.join("\n")) {
  errors.push(
    `package.json browserslist:\n  ${actual.join("\n  ") || "(empty)"}\nexpected:\n  ${wanted.join("\n  ")}`,
  );
}

if (errors.length > 0) {
  console.error("check-browser-floor:\n" + errors.map((line) => `- ${line}`).join("\n"));
  process.exit(1);
}

console.log("check-browser-floor: OK");
