#!/usr/bin/env node
// F30: XxxMotion public slots ↔ package Component.md; site en/ru when present;
// master motion docs phases; wired vs not-wired overlap; host/embedder notes.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentRoots = [
  path.join(root, "src/components/core"),
  path.join(root, "src/components/composite"),
];
const siteRoot = path.resolve(root, "../burne-ui-site");
const MOTION_PHASE_NAMES = [
  "hoverIn",
  "hoverOut",
  "pressIn",
  "pressOut",
  "enter",
  "leave",
  "check",
  "uncheck",
  "change",
];

const SITE_SLUG_OVERRIDES = {
  ComboBox: "combobox",
  ListBox: "listbox",
  TextArea: "textarea",
  ColorSlider: "color-picker",
  ColorSwatch: "color-picker",
  FieldSet: "field",
};

const PORTAL_HOSTS = new Set([
  "Dialog",
  "Tooltip",
  "Popover",
  "Drawer",
  "AlertDialog",
  "Toast",
  "ColorPicker",
]);

const EMBEDDERS = new Set(["Checkbox", "Radio", "Accordion", "Dropdown"]);

const SKIP_MAP_SUFFIX =
  /(Part|Lifecycle|Pointer|Check|TriggerLift|TitleLift|Root)Motion$/;

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function isPublicSlotMap(name) {
  if (name === "FieldSetMotion") return true;
  if (name === "DropdownPopoverMotion") return false;
  if (!/^[A-Z][A-Za-z0-9]*Motion$/.test(name)) return false;
  return !SKIP_MAP_SUFFIX.test(name);
}

function mapComponentName(typeName) {
  return typeName.replace(/Motion$/, "");
}

function toKebab(name) {
  if (SITE_SLUG_OVERRIDES[name]) return SITE_SLUG_OVERRIDES[name];
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function extractObjectBody(source, name) {
  const text = stripComments(source);
  const re = new RegExp(
    `\\bexport\\s+type\\s+${name}\\s*=\\s*\\{`,
    "m",
  );
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

function extractAliasTarget(source, name) {
  const text = stripComments(source);
  const re = new RegExp(
    `\\bexport\\s+type\\s+${name}\\s*=\\s*([A-Z][A-Za-z0-9]*)\\s*;`,
    "m",
  );
  const match = re.exec(text);
  return match?.[1] ?? null;
}

function extractSlotKeys(body) {
  const keys = [];
  for (const match of body.matchAll(/^\s*([A-Za-z_]\w*)\??\s*:/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

function backtickHas(md, slot) {
  const re = new RegExp(`\`${slot}\``);
  return re.test(md);
}

function hasAnimationsHeading(md) {
  return /^## (Анимации|Animations)\s*$/m.test(md) || /### Slot motion/i.test(md);
}

function hasSlotMotionHeading(md) {
  return /^### Slot motion\b/m.test(md);
}

function parseWiredTable(md, headingRe) {
  const heading = md.search(headingRe);
  if (heading < 0) return null;
  const rest = md.slice(heading);
  const next = rest.search(/\n## /);
  const section = next >= 0 ? rest.slice(0, next) : rest;
  const names = [];
  for (const line of section.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const name = cells[0];
    if (/^(Компонент|Component)$/i.test(name)) continue;
    names.push(name);
  }
  return names;
}

function parseNotWiredSection(md) {
  const heading = md.search(/^## (Не подключено|Not wired)\s*$/m);
  if (heading < 0) return [];
  const rest = md.slice(heading);
  const next = rest.search(/\n## /);
  const section = next >= 0 ? rest.slice(0, next) : rest;
  return parseWiredTable(`## x\n${section}`, /^## /) ?? [];
}

async function listTypesFiles() {
  const files = [];
  for (const dir of componentRoots) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const folder = path.join(dir, entry.name);
      const children = await readdir(folder);
      for (const child of children) {
        if (!child.endsWith("Types.ts")) continue;
        files.push({
          folderName: entry.name,
          folder,
          path: path.join(folder, child),
        });
      }
    }
  }
  return files;
}

async function siteExists() {
  try {
    const entries = await readdir(siteRoot);
    return entries.includes("content");
  } catch {
    return false;
  }
}

async function main() {
  const errors = [];
  const maps = new Map();
  const aliases = new Map();
  const fileChange = new Map();

  for (const file of await listTypesFiles()) {
    const source = await readFile(file.path, "utf8");
    const text = stripComments(source);
    fileChange.set(file.path, /\bchange\s*\??\s*:/.test(text));
    for (const match of text.matchAll(
      /\bexport\s+type\s+([A-Z][A-Za-z0-9]*Motion)\b/g,
    )) {
      const name = match[1];
      if (!isPublicSlotMap(name)) continue;
      const body = extractObjectBody(source, name);
      if (body != null) {
        maps.set(name, {
          slots: extractSlotKeys(body),
          folder: file.folder,
          folderName: file.folderName,
          file: file.path,
          hasChange: fileChange.get(file.path),
        });
        continue;
      }
      const target = extractAliasTarget(source, name);
      if (target) {
        aliases.set(name, {
          target,
          folder: file.folder,
          folderName: file.folderName,
          file: file.path,
        });
      }
    }
  }

  for (const [name, alias] of aliases) {
    const resolved = maps.get(alias.target);
    if (!resolved) {
      errors.push(
        `${alias.folderName}: alias ${name} → ${alias.target} not found`,
      );
      continue;
    }
    maps.set(name, {
      slots: resolved.slots,
      folder: alias.folder,
      folderName: alias.folderName,
      file: alias.file,
      hasChange: resolved.hasChange,
    });
  }

  const byPackageMd = new Map();
  for (const [typeName, info] of maps) {
    const mdPath = path.join(info.folder, `${info.folderName}.md`);
    if (!byPackageMd.has(mdPath)) {
      byPackageMd.set(mdPath, {
        folderName: info.folderName,
        maps: [],
      });
    }
    byPackageMd.get(mdPath).maps.push({ typeName, ...info });
  }

  for (const [mdPath, group] of byPackageMd) {
    let md;
    try {
      md = await readFile(mdPath, "utf8");
    } catch {
      errors.push(`${group.folderName}: missing package ${group.folderName}.md`);
      continue;
    }

    const slots = new Set();
    let hasChange = false;
    for (const item of group.maps) {
      hasChange = hasChange || item.hasChange;
      for (const slot of item.slots) slots.add(slot);
    }

    const missingSlots = [...slots].filter((slot) => !backtickHas(md, slot));
    if (missingSlots.length > 0) {
      errors.push(
        `${group.folderName}.md: missing slot(s) ${missingSlots.map((s) => `\`${s}\``).join(", ")}`,
      );
    }

    if (hasChange && !backtickHas(md, "change")) {
      errors.push(`${group.folderName}.md: types have \`change\` but docs do not mention it`);
    }

    if (PORTAL_HOSTS.has(group.folderName)) {
      if (!/хост|host|портал|portal/i.test(md)) {
        errors.push(
          `${group.folderName}.md: portal-host must mention host/portal role`,
        );
      }
    }

    if (EMBEDDERS.has(group.folderName)) {
      if (!/embedder|прокид/i.test(md)) {
        errors.push(
          `${group.folderName}.md: embedder must mention embedder/прокидка`,
        );
      }
    }
  }

  const hasSite = await siteExists();
  if (hasSite) {
    for (const locale of ["en", "ru"]) {
      const motionPath = path.join(
        siteRoot,
        "content/docs/motion",
        `${locale}.md`,
      );
      let motionMd;
      try {
        motionMd = await readFile(motionPath, "utf8");
      } catch {
        errors.push(`site motion/${locale}.md missing`);
        continue;
      }

      const missingPhases = MOTION_PHASE_NAMES.filter(
        (phase) => !backtickHas(motionMd, phase),
      );
      if (missingPhases.length > 0) {
        errors.push(
          `motion/${locale}.md: missing phase(s) ${missingPhases.map((p) => `\`${p}\``).join(", ")}`,
        );
      }
      if (!/`change`/.test(motionMd) || !/MOTION_PHASE_NAMES/.test(motionMd)) {
        errors.push(
          `motion/${locale}.md: must document \`change\` and MOTION_PHASE_NAMES`,
        );
      }

      const wired = parseWiredTable(
        motionMd,
        locale === "ru" ? /^## Сейчас подключено\s*$/m : /^## Wired today\s*$/m,
      );
      if (!wired || wired.length === 0) {
        errors.push(`motion/${locale}.md: wired table is empty or missing`);
      }
      const notWired = parseNotWiredSection(motionMd);
      if (wired && notWired.length > 0) {
        const overlap = wired.filter((name) => notWired.includes(name));
        if (overlap.length > 0) {
          errors.push(
            `motion/${locale}.md: in both wired and not-wired: ${overlap.join(", ")}`,
          );
        }
      }
    }

    let wiredEn;
    let wiredRu;
    try {
      const en = await readFile(
        path.join(siteRoot, "content/docs/motion/en.md"),
        "utf8",
      );
      const ru = await readFile(
        path.join(siteRoot, "content/docs/motion/ru.md"),
        "utf8",
      );
      wiredEn = parseWiredTable(en, /^## Wired today\s*$/m) ?? [];
      wiredRu = parseWiredTable(ru, /^## Сейчас подключено\s*$/m) ?? [];
      const enSet = new Set(wiredEn);
      const ruSet = new Set(wiredRu);
      const onlyEn = wiredEn.filter((n) => !ruSet.has(n));
      const onlyRu = wiredRu.filter((n) => !enSet.has(n));
      if (onlyEn.length || onlyRu.length) {
        errors.push(
          `motion en/ru wired rows differ: en-only [${onlyEn.join(", ")}] ru-only [${onlyRu.join(", ")}]`,
        );
      }
    } catch {
      // already reported missing files
    }

    const checkedSite = new Set();
    for (const [, group] of byPackageMd) {
      const slug = toKebab(group.folderName);
      if (checkedSite.has(slug)) continue;
      checkedSite.add(slug);
      const dir = path.join(siteRoot, "content/component-docs", slug);
      let en;
      let ru;
      try {
        en = await readFile(path.join(dir, "en.md"), "utf8");
      } catch {
        en = null;
      }
      try {
        ru = await readFile(path.join(dir, "ru.md"), "utf8");
      } catch {
        ru = null;
      }
      if (!en && !ru) continue;
      if (!en || !ru) {
        errors.push(
          `component-docs/${slug}: en/ru pair incomplete (en=${Boolean(en)}, ru=${Boolean(ru)})`,
        );
        continue;
      }

      const slots = new Set();
      for (const item of group.maps) {
        for (const slot of item.slots) slots.add(slot);
      }
      for (const locale of [
        ["en", en],
        ["ru", ru],
      ]) {
        const [label, md] = locale;
        const missing = [...slots].filter((slot) => !backtickHas(md, slot));
        if (missing.length > 0) {
          errors.push(
            `component-docs/${slug}/${label}.md: missing slot(s) ${missing.map((s) => `\`${s}\``).join(", ")}`,
          );
        }
        if (!hasAnimationsHeading(md)) {
          errors.push(
            `component-docs/${slug}/${label}.md: missing Animations / Slot motion section`,
          );
        }
        const hasChange = group.maps.some((item) => item.hasChange);
        if (hasChange && !backtickHas(md, "change")) {
          errors.push(
            `component-docs/${slug}/${label}.md: types have \`change\` but docs do not mention it`,
          );
        }
      }
      if (hasSlotMotionHeading(en) !== hasSlotMotionHeading(ru)) {
        errors.push(
          `component-docs/${slug}: en/ru ### Slot motion heading mismatch`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error(
      `check-motion-docs-parity: ${errors.length} issue(s):\n`,
    );
    for (const line of errors) {
      console.error(`  - ${line}`);
    }
    process.exit(1);
  }

  console.log(
    `check-motion-docs-parity: OK — ${maps.size} motion map(s), ${byPackageMd.size} package doc(s)${hasSite ? ", site docs checked" : " (site not present, skipped)"}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
