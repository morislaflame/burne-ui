#!/usr/bin/env node
// gsap.to / from / fromTo / set / timeline / quickTo / quickSetter / killTweensOf
// stay in recipes, slotMotion, and gsapMotion.
// Any other file that imports gsap (including `gsap as alias` from gsapMotion)
// needs an allowlist entry with a reason.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "..");

/** Path from the burne-ui package → why the gsap call cannot be a public phase recipe. */
const ALLOW = [
  [
    "src/components/core/utils/useChevronRotation.ts",
    "Rotation engine for chevronRotate, plus the no-scope hook. The recipe file importing this hook would cycle.",
  ],
  [
    "src/components/core/utils/hoverInteractiveLift.ts",
    "Hover-lift and press-squeeze engine. Recipes and imperative press (Dropdown, Switch, overlay open) call it.",
  ],
  [
    "src/components/core/utils/shadowFade.ts",
    "Cross-fades shadow layers. Called from the lift engine and ctx.shadowFade.",
  ],
  [
    "src/components/core/utils/useCollapsibleHeight.ts",
    "Height engine for collapsibleHeight. Measures layout; public MotionVars do not tween height.",
  ],
  [
    "src/components/core/utils/pressRipple.tsx",
    "Ripple grows from the pointer. Not a slot phase.",
  ],
  [
    "src/components/core/utils/searchInputExpandMotion.ts",
    "searchExpand layout exception: shell width and borderRadius. The recipe delegates here.",
  ],
  [
    "src/components/core/utils/modalSurfaceMotion.ts",
    "Modal and portal enter/leave engine. Recipes call it; importing the registry from here would cycle.",
  ],
  [
    "src/components/core/Pagination/paginationAnimations.ts",
    "FLIP of page-list children. Those nodes are not a public slot.",
  ],
  [
    "src/components/core/Drawer/useDrawerHandleDrag.ts",
    "Pointer drag of the drawer. Follows the pointer, not a phase recipe.",
  ],
  [
    "src/components/core/Disclosure/useDisclosureContentDrag.ts",
    "Pointer drag of disclosure height and chevron. Not a phase recipe.",
  ],
  [
    "../burne-ui-skin-gloss/src/motion.ts",
    "Gloss interactive engine (lift, squeeze, decor). A skin package, not a kit phase recipe.",
  ],
];

const METHODS = "to|from|fromTo|set|timeline|quickTo|quickSetter|killTweensOf";

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function skipped(file) {
  if (file.includes(`${path.sep}slotMotion${path.sep}`)) return true;
  if (path.basename(file) === "gsapMotion.ts") return true;
  if (/\.(stories|test)\.tsx?$/.test(file)) return true;
  return false;
}

function isGsapModule(spec) {
  return spec === "gsap" || spec.endsWith("/gsap") || spec.endsWith("/gsapMotion") || spec === "gsapMotion";
}

function bindingsFromClause(clause) {
  const names = [];
  const cleaned = clause.replace(/\s+/g, " ").trim();
  const namespace = cleaned.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
  if (namespace) return [namespace[1]];

  let rest = cleaned;
  if (!rest.startsWith("{") && !rest.startsWith("*")) {
    const def = rest.match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?\s*(?:,\s*)?/);
    if (def) {
      names.push(def[2] || def[1]);
      rest = rest.slice(def[0].length);
    }
  }

  const named = rest.match(/\{([^}]*)\}/);
  if (named) {
    for (const part of named[1].split(",")) {
      const bit = part.trim();
      if (!bit) continue;
      const match = bit.match(/^(?:type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
      if (!match || match[1] !== "gsap") continue;
      names.push(match[2] || match[1]);
    }
  }
  return names;
}

function gsapBindings(source) {
  const names = new Set();
  const importRe = /import\s+([\s\S]*?)\s+from\s+["']([^"']+)["']/g;
  let match;
  while ((match = importRe.exec(source))) {
    if (!isGsapModule(match[2])) continue;
    for (const name of bindingsFromClause(match[1])) names.add(name);
  }
  return [...names];
}

function hasGsapCall(source, binding) {
  const escaped = binding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\.(?:${METHODS})\\s*\\(`).test(source);
}

function scanRoots() {
  const roots = [
    path.join(root, "src", "components"),
    path.join(root, "src", "theme"),
    path.join(root, "src", "skins"),
  ];
  for (const name of ["burne-ui-skin-gloss", "burne-ui-skin-cybercore", "burne-ui-skin-neobrutalism"]) {
    const src = path.join(repoRoot, name, "src");
    if (existsSync(src)) roots.push(src);
  }
  return roots;
}

function relKey(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

const allowReason = new Map();
for (const [file, reason] of ALLOW) {
  if (typeof reason !== "string" || reason.trim() === "") {
    console.error(`check-raw-gsap: ${file} has no reason`);
    process.exit(1);
  }
  allowReason.set(file, reason);
}

const errors = [];
for (const dir of scanRoots()) {
  for (const file of await walk(dir)) {
    if (skipped(file)) continue;
    const key = relKey(file);
    if (allowReason.has(key)) continue;
    const source = stripComments(await readFile(file, "utf8"));
    const bindings = gsapBindings(source);
    if (bindings.length === 0) continue;
    if (bindings.some((binding) => hasGsapCall(source, binding))) errors.push(key);
  }
}

if (errors.length > 0) {
  console.error(
    "check-raw-gsap: raw gsap outside recipes/slotMotion:\n" +
      errors.map((line) => `- ${line}`).join("\n"),
  );
  process.exit(1);
}

console.log(`check-raw-gsap: OK (${allowReason.size} allowed)`);
