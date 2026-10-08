#!/usr/bin/env node
// XxxClassNames keys must match every documented slot list
// (kit Component.md and burne-ui-site component-docs ru/en).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src/components");
const siteRoot = path.resolve(root, "../burne-ui-site/content/component-docs");

/** Shared shape. Public names are the aliases (RadioGroup / CheckboxGroup). */
const SKIP_TYPES = new Set(["OptionGroupClassNames"]);

const SITE_SLUG_OVERRIDES = {
  ComboBox: "combobox",
  ListBox: "listbox",
  TextArea: "textarea",
  ColorSwatch: "color-picker",
  FieldSet: "field",
  SkeletonCircle: "skeleton",
  SkeletonText: "skeleton",
  SkeletonBlock: "skeleton",
  SkeletonRegion: "skeleton",
};

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function extractObjectBody(source, name) {
  const text = stripComments(source);
  const re = new RegExp(`\\bexport\\s+type\\s+${name}\\s*=\\s*\\{`, "m");
  const match = re.exec(text);
  if (!match) return null;
  const start = match.index + match[0].length - 1;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start + 1, i);
    }
  }
  return null;
}

function extractSlotKeys(body) {
  const keys = [];
  for (const match of body.matchAll(/^\s*([A-Za-z_]\w*)\??\s*:/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      await walk(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function componentName(typeName) {
  return typeName.replace(/ClassNames$/, "");
}

function siteSlug(typeName) {
  const name = componentName(typeName);
  if (SITE_SLUG_OVERRIDES[name]) return SITE_SLUG_OVERRIDES[name];
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function headingRe(typeName) {
  return new RegExp(`^### .*?\`${typeName}\`(?: slots)?\\s*$`, "m");
}

function sections(md, typeName) {
  const re = headingRe(typeName);
  const found = [];
  let from = 0;
  while (from < md.length) {
    const match = re.exec(md.slice(from));
    if (!match) break;
    const headingAt = from + match.index;
    const bodyFrom = headingAt + match[0].length;
    const rest = md.slice(bodyFrom);
    const next = rest.search(/\n#{1,3} /);
    const body = next === -1 ? rest : rest.slice(0, next);
    found.push({ heading: match[0].trim(), body });
    from = bodyFrom + (next === -1 ? rest.length : next);
  }
  return found;
}

function keysFromFence(body, typeName) {
  const fenceRe = /```[^\n]*\n([\s\S]*?)```/g;
  let fence = fenceRe.exec(body);
  while (fence) {
    const code = fence[1];
    if (code.includes(`type ${typeName}`)) {
      const inner = code.match(/\{([\s\S]*)\}/);
      if (inner) return extractSlotKeys(inner[1]);
    }
    fence = fenceRe.exec(body);
  }
  return null;
}

function keysFromTable(body) {
  const keys = [];
  let inSlotTable = false;
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) {
      if (inSlotTable && keys.length > 0) break;
      continue;
    }
    const cells = trimmed.split("|").slice(1, -1).map((cell) => cell.trim());
    const head = cells[0] ?? "";
    if (/^[-:\s|]+$/.test(head)) continue;
    if (!inSlotTable) {
      if (/^(слот|slot)$/i.test(head.replace(/`/g, ""))) inSlotTable = true;
      continue;
    }
    if (/^(prop|свойство)$/i.test(head.replace(/`/g, ""))) break;
    for (const id of head.matchAll(/`([A-Za-z]\w*)`/g)) keys.push(id[1]);
  }
  return keys.length > 0 ? keys : null;
}

function keysFromList(body) {
  const noFence = body.replace(/```[\s\S]*?```/g, "");
  for (const line of noFence.split("\n")) {
    const trimmed = line.trim();
    if (!/^`[A-Za-z]\w*`(?:\s*,\s*`[A-Za-z]\w*`)*\.?\s*$/.test(trimmed)) continue;
    return [...trimmed.matchAll(/`([A-Za-z]\w*)`/g)].map((match) => match[1]);
  }
  return null;
}

function keysFromSection(section, typeName) {
  const fence = keysFromFence(section.body, typeName);
  if (fence) return fence;
  const table = keysFromTable(section.body);
  if (table) return table;
  return keysFromList(section.body);
}

function diff(expected, actual) {
  const exp = new Set(expected);
  const act = new Set(actual);
  return {
    missing: [...exp].filter((key) => !act.has(key)),
    extra: [...act].filter((key) => !exp.has(key)),
  };
}

const files = await walk(srcRoot);
const sources = new Map();
for (const file of files) {
  sources.set(file, await readFile(file, "utf8"));
}

/** @type {Map<string, string[]>} */
const types = new Map();
/** @type {Map<string, string>} */
const aliases = new Map();

for (const source of sources.values()) {
  const text = stripComments(source);
  for (const match of text.matchAll(/\bexport\s+type\s+(\w+ClassNames)\s*=/g)) {
    const name = match[1];
    if (name.startsWith("Resolved") || SKIP_TYPES.has(name)) continue;
    if (types.has(name) || aliases.has(name)) continue;
    const body = extractObjectBody(source, name);
    if (body != null) {
      types.set(name, extractSlotKeys(body));
      continue;
    }
    const alias = text
      .slice(match.index)
      .match(new RegExp(`^export\\s+type\\s+${name}\\s*=\\s*([A-Z]\\w*)\\s*;`, "m"));
    if (alias) aliases.set(name, alias[1]);
  }
}

for (const [name, target] of aliases) {
  const keys = types.get(target);
  if (keys) types.set(name, keys);
}

/** @type {{ file: string, md: string }[]} */
const kitDocs = [];
async function collectMd(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectMd(full);
    else if (entry.name.endsWith(".md")) {
      kitDocs.push({ file: full, md: await readFile(full, "utf8") });
    }
  }
}
await collectMd(srcRoot);

let siteDirs = [];
try {
  siteDirs = (await readdir(siteRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
} catch {
  siteDirs = [];
}

const problems = [];

function rel(file) {
  return path.relative(path.resolve(root, ".."), file);
}

for (const [name, keys] of [...types.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const kitHits = [];
  for (const doc of kitDocs) {
    for (const section of sections(doc.md, name)) {
      kitHits.push({ file: doc.file, section });
    }
  }

  if (kitHits.length === 0) {
    problems.push(`${name}: no slot list in kit docs`);
  }

  for (const hit of kitHits) {
    const documented = keysFromSection(hit.section, name);
    if (!documented) {
      problems.push(`${name}: empty slot list in ${rel(hit.file)} (${hit.section.heading})`);
      continue;
    }
    const { missing, extra } = diff(keys, documented);
    if (missing.length === 0 && extra.length === 0) continue;
    problems.push(
      `${name} in ${rel(hit.file)} (${hit.section.heading}): missing [${missing.join(", ")}] extra [${extra.join(", ")}]`,
    );
  }

  const slug = siteSlug(name);
  if (!siteDirs.includes(slug)) continue;
  for (const lang of ["ru", "en"]) {
    const file = path.join(siteRoot, slug, `${lang}.md`);
    let md;
    try {
      md = await readFile(file, "utf8");
    } catch {
      problems.push(`${name}: missing ${rel(file)}`);
      continue;
    }
    const hits = sections(md, name);
    if (hits.length === 0) {
      problems.push(`${name}: no slot list in ${rel(file)}`);
      continue;
    }
    for (const section of hits) {
      const documented = keysFromSection(section, name);
      if (!documented) {
        problems.push(`${name}: empty slot list in ${rel(file)} (${section.heading})`);
        continue;
      }
      const { missing, extra } = diff(keys, documented);
      if (missing.length === 0 && extra.length === 0) continue;
      problems.push(
        `${name} in ${rel(file)} (${section.heading}): missing [${missing.join(", ")}] extra [${extra.join(", ")}]`,
      );
    }
  }
}

if (problems.length === 0) {
  console.log(`check-classnames-docs-parity: OK (${types.size} types)`);
  process.exit(0);
}

console.error(`check-classnames-docs-parity: ${problems.length} problem(s)\n`);
for (const line of problems) console.error(`  ${line}`);
process.exit(1);
