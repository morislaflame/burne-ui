// Shared XxxClassNames / XxxMotion key parser (docs parity + slot-contract tests).
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/** Shared shape. Public names are the aliases (RadioGroup / CheckboxGroup). */
export const SKIP_TYPES = new Set(["OptionGroupClassNames"]);

export const SITE_SLUG_OVERRIDES = {
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

export function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

export function extractObjectBody(source, name) {
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

export function extractSlotKeys(body) {
  const keys = [];
  for (const match of body.matchAll(/^\s*([A-Za-z_]\w*)\??\s*:/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

export function walkSync(dir, acc = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      walkSync(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

export function componentName(typeName) {
  return typeName.replace(/ClassNames$/, "");
}

export function siteSlug(typeName) {
  const name = componentName(typeName);
  if (SITE_SLUG_OVERRIDES[name]) return SITE_SLUG_OVERRIDES[name];
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * @param {string} srcRoot
 * @param {{ skip?: Set<string> }} [options]
 * @returns {{ types: Map<string, string[]>, aliases: Map<string, string> }}
 */
export function loadClassNamesTypes(srcRoot, options = {}) {
  const skip = options.skip ?? SKIP_TYPES;
  const files = walkSync(srcRoot);
  /** @type {Map<string, string[]>} */
  const types = new Map();
  /** @type {Map<string, string>} */
  const aliases = new Map();

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const text = stripComments(source);
    for (const match of text.matchAll(/\bexport\s+type\s+(\w+ClassNames)\s*=/g)) {
      const name = match[1];
      if (name.startsWith("Resolved") || skip.has(name)) continue;
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

  return { types, aliases };
}

/**
 * Public slot maps (`AlertMotion`), not `*PartMotion` / lifecycle fragments.
 * @param {string} srcRoot
 * @returns {Map<string, string[]>}
 */
export function loadMotionSlotKeys(srcRoot) {
  const files = walkSync(srcRoot);
  /** @type {Map<string, string[]>} */
  const types = new Map();
  /** @type {Map<string, string>} */
  const aliases = new Map();

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const text = stripComments(source);
    for (const match of text.matchAll(/\bexport\s+type\s+(\w+Motion)\s*=/g)) {
      const name = match[1];
      if (
        name.startsWith("Resolved") ||
        /(?:Part|Lifecycle|Pointer|Check|Summary|TriggerLift|TitleLift)Motion$/.test(name)
      ) {
        continue;
      }
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

  return types;
}
