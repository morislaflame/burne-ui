#!/usr/bin/env node
// F30 + 8.6 + W3.1: XxxMotion public slots ↔ package Component.md and DOM registrations;
// site en/ru when present; master motion docs phases + recipe metadata + MotionController;
// wired vs not-wired overlap; host/embedder notes.
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
  "mount",
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

/** Height-recipe target — not a public XxxMotion slot. */
const INTERNAL_MOTION_SLOTS = new Set(["panelInner"]);

/**
 * Public motion keys that configure a nested scope (not registered on this host).
 * ColorPicker `hueSlider` / `alphaSlider` → ColorSlider.Track `motion`.
 */
const PASS_THROUGH_MOTION_SLOTS = {
  ColorPicker: new Set(["hueSlider", "alphaSlider", "trigger"]),
  /** Dropdown (and similar) register repeated `item` / chrome on the Popover portal scope. */
  Popover: new Set(["item", "itemLabel", "itemHint", "itemIcon", "label", "subTrigger", "separator"]),
  /** Card chrome is Popover's portal scope. HoverCard registers `trigger` itself. */
  HoverCard: new Set(["content", "header", "title", "description", "body", "arrow"]),
};

const SLOT_REGISTER_RES = [
  /registerTarget\(\s*["']([A-Za-z]\w*)["']/g,
  /\bslot:\s*["']([A-Za-z]\w*)["']/g,
  /\bslot=["']([A-Za-z]\w*)["']/g,
  /use[A-Za-z]+SlotMotion(?:<[^>]*>)?\(\s*["']([A-Za-z]\w*)["']/g,
  /use[A-Za-z]+PartMotion(?:<[^>]*>)?\(\s*["']([A-Za-z]\w*)["']/g,
  /use[A-Za-z]+ChromeSlot(?:<[^>]*>)?\(\s*["']([A-Za-z]\w*)["']/g,
];

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

async function collectRegisteredSlots(folder, typeSlots) {
  const slots = new Set();
  let entries;
  try {
    entries = await readdir(folder);
  } catch {
    return slots;
  }
  for (const child of entries) {
    if (!/\.(ts|tsx)$/.test(child)) continue;
    if (/\.stories\.|\.test\.|\.spec\./.test(child)) continue;
    if (child === "index.ts") continue;
    const source = await readFile(path.join(folder, child), "utf8");
    const text = stripComments(source);
    for (const re of SLOT_REGISTER_RES) {
      re.lastIndex = 0;
      for (const match of text.matchAll(re)) {
        slots.add(match[1]);
      }
    }
    for (const match of text.matchAll(
      /\?\s*["']([A-Za-z]\w*)["']\s*:\s*["']([A-Za-z]\w*)["']/g,
    )) {
      if (typeSlots.has(match[1])) slots.add(match[1]);
      if (typeSlots.has(match[2])) slots.add(match[2]);
    }
    if (/\bslot:\s*side\b/.test(text)) {
      if (typeSlots.has("prefix")) slots.add("prefix");
      if (typeSlots.has("suffix")) slots.add("suffix");
    }
  }
  return slots;
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

    const typeSlots = new Set();
    for (const item of group.maps) {
      for (const slot of item.slots) typeSlots.add(slot);
    }
    if (typeSlots.has("icon") && (typeSlots.has("iconStart") || typeSlots.has("iconEnd"))) {
      errors.push(
        `${group.folderName}: XxxMotion has both \`icon\` and \`iconStart\`/\`iconEnd\` — use iconStart/iconEnd only`,
      );
    }
    if (!EMBEDDERS.has(group.folderName)) {
      const passThrough = PASS_THROUGH_MOTION_SLOTS[group.folderName] ?? new Set();
      const registered = await collectRegisteredSlots(
        group.maps[0].folder,
        typeSlots,
      );
      const missingDom = [...typeSlots].filter(
        (slot) => !registered.has(slot) && !passThrough.has(slot),
      );
      if (missingDom.length > 0) {
        errors.push(
          `${group.folderName}: XxxMotion slot(s) not registered in DOM: ${missingDom.map((s) => `\`${s}\``).join(", ")}`,
        );
      }
      const extraDom = [...registered].filter(
        (slot) => !typeSlots.has(slot) && !INTERNAL_MOTION_SLOTS.has(slot),
      );
      if (extraDom.length > 0) {
        errors.push(
          `${group.folderName}: DOM registration(s) missing from XxxMotion: ${extraDom.map((s) => `\`${s}\``).join(", ")}`,
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

      const level1Forbidden = [
        "MotionController",
        "MotionGroup",
        "createMotionEvents",
        "createMotionStates",
        "motionState",
        "MotionMapWithEvents",
      ].filter((token) => motionMd.includes(token));
      if (level1Forbidden.length > 0) {
        errors.push(
          `motion/${locale}.md: level 1 must not mention ${level1Forbidden.join(", ")}`,
        );
      }
      if (
        !/ThemeProvider/.test(motionMd) ||
        !/MotionConfigProvider/.test(motionMd) ||
        !/useMotionConfig/.test(motionMd) ||
        !/Precedence/.test(motionMd) ||
        !/configureMotion/.test(motionMd) ||
        !/pressSqueeze/.test(motionMd) ||
        !/enableAnimations/.test(motionMd)
      ) {
        errors.push(
          `motion/${locale}.md: must document ThemeProvider, MotionConfigProvider, useMotionConfig, Precedence, configureMotion, pressSqueeze, and enableAnimations`,
        );
      }

      const pages = {
        "motion-recipes": null,
        "motion-controller": null,
        "motion-events": null,
        "motion-group": null,
        "motion-async": null,
        "motion-authoring": null,
      };
      let missingPage = false;
      for (const slug of Object.keys(pages)) {
        try {
          pages[slug] = await readFile(
            path.join(siteRoot, "content/docs", slug, `${locale}.md`),
            "utf8",
          );
        } catch {
          errors.push(`site ${slug}/${locale}.md missing`);
          missingPage = true;
        }
      }
      if (missingPage) continue;

      const recipesMd = pages["motion-recipes"];
      const missingPhases = MOTION_PHASE_NAMES.filter(
        (phase) => !backtickHas(recipesMd, phase),
      );
      if (missingPhases.length > 0) {
        errors.push(
          `motion-recipes/${locale}.md: missing phase(s) ${missingPhases.map((p) => `\`${p}\``).join(", ")}`,
        );
      }
      if (!/`change`/.test(recipesMd) || !/MOTION_PHASE_NAMES/.test(recipesMd)) {
        errors.push(
          `motion-recipes/${locale}.md: must document \`change\` and MOTION_PHASE_NAMES`,
        );
      }
      if (!/MotionRecipeMetadata/.test(recipesMd) || !/`hidesFirstPaint`/.test(recipesMd)) {
        errors.push(
          `motion-recipes/${locale}.md: must document MotionRecipeMetadata and hidesFirstPaint`,
        );
      }
      if (!/`iconStart`/.test(recipesMd) || !/`iconEnd`/.test(recipesMd)) {
        errors.push(
          `motion-recipes/${locale}.md: must document iconStart/iconEnd slot names`,
        );
      }

      const controllerMd = pages["motion-controller"];
      if (
        !/MotionController/.test(controllerMd) ||
        !/`createMotionController`/.test(controllerMd) ||
        !/`motionController`/.test(controllerMd) ||
        !/`MotionPlayEvent`/.test(controllerMd)
      ) {
        errors.push(
          `motion-controller/${locale}.md: must document MotionController, createMotionController, motionController, and MotionPlayEvent`,
        );
      }

      const eventsMd = pages["motion-events"];
      if (
        !/`createMotionEvents`/.test(eventsMd) ||
        !/`events`/.test(eventsMd) ||
        !/MotionMapWithEvents/.test(eventsMd)
      ) {
        errors.push(
          `motion-events/${locale}.md: must document createMotionEvents, events, and MotionMapWithEvents`,
        );
      }
      if (
        !/`motionState`/.test(eventsMd) ||
        !/motion\.states/.test(eventsMd) ||
        !/`createMotionStates`/.test(eventsMd)
      ) {
        errors.push(
          `motion-events/${locale}.md: must document motionState, states, and createMotionStates`,
        );
      }
      if (!/`fromRest`/.test(eventsMd) || !/`replay`/.test(eventsMd)) {
        errors.push(
          `motion-events/${locale}.md: must document fromRest and replay`,
        );
      }

      const groupMd = pages["motion-group"];
      if (!/MotionGroup/.test(groupMd) || !/`createMotionGroup`/.test(groupMd)) {
        errors.push(
          `motion-group/${locale}.md: must document MotionGroup and createMotionGroup`,
        );
      }

      const asyncMd = pages["motion-async"];
      if (
        !/ctx\.wait/.test(asyncMd) ||
        !/sequence/.test(asyncMd) ||
        !/parallel/.test(asyncMd) ||
        !/`onInterrupt`/.test(asyncMd) ||
        !/`onError`/.test(asyncMd) ||
        !/`registerMotionPlugins`/.test(asyncMd)
      ) {
        errors.push(
          `motion-async/${locale}.md: must document ctx.wait, sequence/parallel, onInterrupt/onError, and registerMotionPlugins`,
        );
      }

      const authorMd = pages["motion-authoring"];
      if (!/useMotionPart/.test(authorMd) || !/\*Animations\.ts/.test(authorMd)) {
        errors.push(
          `motion-authoring/${locale}.md: must document useMotionPart and *Animations.ts`,
        );
      }

      const wired = parseWiredTable(
        recipesMd,
        locale === "ru" ? /^## Сейчас подключено\s*$/m : /^## Wired today\s*$/m,
      );
      if (!wired || wired.length === 0) {
        errors.push(`motion-recipes/${locale}.md: wired table is empty or missing`);
      }
      const notWired = parseNotWiredSection(recipesMd);
      if (wired && notWired.length > 0) {
        const overlap = wired.filter((name) => notWired.includes(name));
        if (overlap.length > 0) {
          errors.push(
            `motion-recipes/${locale}.md: in both wired and not-wired: ${overlap.join(", ")}`,
          );
        }
      }
    }

    let wiredEn;
    let wiredRu;
    try {
      const en = await readFile(
        path.join(siteRoot, "content/docs/motion-recipes/en.md"),
        "utf8",
      );
      const ru = await readFile(
        path.join(siteRoot, "content/docs/motion-recipes/ru.md"),
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
          `motion-recipes en/ru wired rows differ: en-only [${onlyEn.join(", ")}] ru-only [${onlyRu.join(", ")}]`,
        );
      }
    } catch {
      // already reported missing files
    }

    for (const locale of ["en", "ru"]) {
      const statePath = path.join(siteRoot, `content/docs/motion-state/${locale}.md`);
      try {
        const stateMd = await readFile(statePath, "utf8");
        if (
          !/`motionState`/.test(stateMd) ||
          !/`createMotionStates`/.test(stateMd) ||
          !/Zustand/.test(stateMd) ||
          !/Redux/.test(stateMd) ||
          !/TanStack/.test(stateMd)
        ) {
          errors.push(
            `motion-state/${locale}.md: must document motionState, createMotionStates, Zustand, Redux, and TanStack`,
          );
        }
      } catch {
        errors.push(`motion-state/${locale}.md is missing`);
      }
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
