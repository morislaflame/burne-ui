/**
 * Walks the live slot catalog and checks this template only uses skinnable slots.
 * The kit test sets BURNE_UI_LIVE_SLOTS to cli/skin-live-slots.json.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skin = JSON.parse(readFileSync(join(root, "src/skin.json"), "utf8"));
const manifestPath = process.env.BURNE_UI_LIVE_SLOTS;

if (!manifestPath) {
  console.error("BURNE_UI_LIVE_SLOTS must point at skin-live-slots.json");
  process.exit(1);
}

const live = JSON.parse(readFileSync(manifestPath, "utf8"));
const channels = [
  ["targets", skin.targets, live.targets],
  ["motion", skin.motion, live.motion],
  ["layersDeclarative", skin.layersDeclarative, live.layers],
];

for (const key of ["targets", "motion", "layers"]) {
  if (!Array.isArray(live[key]) || live[key].length === 0) {
    throw new Error(`live ${key} catalog is empty`);
  }
  for (const slot of live[key]) {
    if (typeof slot !== "string" || !slot.includes(".")) {
      throw new Error(`live slot ${String(slot)} is not a slot id`);
    }
  }
}

for (const [label, map, catalog] of channels) {
  const allowed = new Set(catalog);
  for (const slot of Object.keys(map ?? {})) {
    if (label === "motion" && slot === "config") continue;
    if (!allowed.has(slot)) throw new Error(`${label} ${slot} is not skinnable`);
  }
}

for (const [slot, phases] of Object.entries(skin.motion ?? {})) {
  if (slot === "config" || !phases || typeof phases !== "object") continue;
  for (const [phase, recipe] of Object.entries(phases)) {
    if (!String(recipe).startsWith(`${skin.name}:`)) {
      throw new Error(`${slot}.${phase} recipe ${recipe} needs the ${skin.name}: prefix`);
    }
  }
}

const css = readFileSync(join(root, "src/skin.css"), "utf8");
if (!css.includes(`--${skin.name}-`)) {
  throw new Error(`src/skin.css needs a --${skin.name}- variable`);
}

console.log(
  `smoke ok (${live.targets.length} target slots, ${live.motion.length} motion slots, ${live.layers.length} layer slots)`,
);
