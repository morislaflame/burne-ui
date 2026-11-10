#!/usr/bin/env node
// Runtime exports of src/index.ts must match docs/public-api.snapshot.txt.
// A component index.ts exports the component and types. Extra runtime names
// need a line in FACADE_ALLOW. `node scripts/check-public-surface.mjs --write`
// refreshes the snapshot only.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "src/index.ts");
const internalPath = path.join(root, "src/internal.ts");
const authoringPath = path.join(root, "src/authoring.ts");
const studioPath = path.join(root, "src/studio.ts");
const snapshotPath = path.join(root, "docs/public-api.snapshot.txt");
const authoringSnapshotPath = path.join(root, "docs/authoring-api.snapshot.txt");
const studioSnapshotPath = path.join(root, "docs/studio-api.snapshot.txt");
const componentRoots = [
  path.join(root, "src/components/core"),
  path.join(root, "src/components/composite"),
];

/** Still on both entries. App code reads reduced motion from `burne-ui` (R2.8). */
const DUAL_OK = new Set(["prefersReducedMotion"]);

/** Engine pieces. They stay off `burne-ui` and off `burne-ui/authoring`. */
const AUTHORING_FORBIDDEN = [
  "attachMotionController",
  "createMotionControllerFromScope",
  "MotionControllerProvider",
  "splitMotionRootMap",
];

/**
 * Runtime names besides the folder component.
 * Sibling components and hooks an app calls. Style helpers stay in internal.
 */
const FACADE_ALLOW = {
  AlertDialog: ["useAlertDialog"],
  ButtonGroup: [
    "ButtonGroupClassNamesProvider",
    "ButtonGroupLayoutContext",
    "ButtonGroupLayoutProvider",
    "ButtonGroupSegmentContext",
    "ButtonGroupSegmentProvider",
    "useButtonGroupClassNames",
    "useInJoinedButtonGroup",
    "useOptionalButtonGroupLayout",
    "useOptionalButtonGroupSegment",
  ],
  Calendar: ["EN_LOCALE", "createCalendarLocale", "resolveCalendarLocale", "useCalendar"],
  CheckboxGroup: ["useCheckboxGroupContext", "useOptionalCheckboxGroupContext"],
  ColorPicker: ["ColorSlider", "ColorSwatch", "useColorPicker"],
  ComboBox: ["comboBoxFilteredValues"],
  Expandable: ["useExpandableContext"],
  Field: [
    "fieldErrorId",
    "fieldHintId",
    "joinFieldDescribedBy",
    "useFieldSetErrorId",
    "useFieldSetHintId",
  ],
  Form: [
    "useFormBindingContext",
    "useFormControlProps",
    "useFormField",
    "useFormFieldBinding",
    "useOptionalFormBindingContext",
  ],
  Label: ["FieldLabelContext", "useOptionalFieldLabelContext"],
  ListBox: ["useListBox", "useListBoxActiveValue"],
  Meter: ["useMeterFieldContext", "useOptionalMeterFieldContext"],
  ProgressBar: ["useOptionalProgressBarFieldContext", "useProgressBarFieldContext"],
  RadioGroup: ["useOptionalRadioGroupContext", "useRadioGroupContext"],
  Slider: ["useOptionalSliderFieldContext", "useSliderFieldContext"],
  Tabs: ["useTabsClassNames", "useTabsContext"],
  TextArea: [
    "useOptionalTextAreaFieldContext",
    "useTextAreaClassNames",
    "useTextAreaFieldContext",
  ],
  TimeField: ["useOptionalTimeFieldContext", "useTimeFieldClassNames", "useTimeFieldContext"],
  Toast: ["toast", "useToast", "useToastClassNames"],
  ToggleButton: ["useOptionalToggleButtonGroupContext"],
  ToggleButtonGroup: [
    "ToggleButtonGroupClassNamesProvider",
    "ToggleButtonGroupContext",
    "useOptionalToggleButtonGroupContext",
    "useToggleButtonGroupClassNames",
  ],
};

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function runtimeExportNames(source) {
  const text = stripComments(source);
  const names = new Set();

  for (const match of text.matchAll(/\bexport\s+const\s+([A-Za-z_]\w*)/g)) {
    names.add(match[1]);
  }
  for (const match of text.matchAll(/\bexport\s+function\s+([A-Za-z_]\w*)/g)) {
    names.add(match[1]);
  }
  for (const match of text.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    const start = match.index ?? 0;
    const ahead = text.slice(Math.max(0, start - 12), start);
    if (/\bexport\s+type\s*$/.test(ahead)) continue;
    for (const raw of match[1].split(",")) {
      let part = raw.trim().replace(/\bfrom\b[\s\S]*$/, "").trim();
      if (!part || /^\btype\b/.test(part)) continue;
      const alias = part.match(/^([A-Za-z_]\w*)\s+as\s+([A-Za-z_]\w*)$/);
      if (alias) {
        names.add(alias[2]);
        continue;
      }
      const ident = part.match(/^([A-Za-z_]\w*)$/);
      if (ident) names.add(ident[1]);
    }
  }

  return names;
}

function sorted(names) {
  return [...names].sort((a, b) => a.localeCompare(b));
}

const indexSource = await readFile(indexPath, "utf8");
const internalSource = await readFile(internalPath, "utf8");
const authoringSource = await readFile(authoringPath, "utf8");
const studioSource = await readFile(studioPath, "utf8");
const rootNames = runtimeExportNames(indexSource);
const internalNames = runtimeExportNames(internalSource);
const authoringNames = runtimeExportNames(authoringSource);
const studioNames = runtimeExportNames(studioSource);
const snapshot = `${sorted(rootNames).join("\n")}\n`;
const authoringSnapshot = `${sorted(authoringNames).join("\n")}\n`;
const studioSnapshot = `${sorted(studioNames).join("\n")}\n`;

if (process.argv.includes("--write")) {
  await writeFile(snapshotPath, snapshot);
  await writeFile(authoringSnapshotPath, authoringSnapshot);
  await writeFile(studioSnapshotPath, studioSnapshot);
  console.log(`check-public-surface: wrote ${rootNames.size} runtime export(s)`);
  console.log(`check-public-surface: wrote ${authoringNames.size} authoring export(s)`);
  console.log(`check-public-surface: wrote ${studioNames.size} studio export(s)`);
}

const errors = [];
let saved = "";
try {
  saved = await readFile(snapshotPath, "utf8");
} catch {
  errors.push("docs/public-api.snapshot.txt is missing. Run with --write.");
}

if (saved && saved !== snapshot) {
  const previous = new Set(saved.split("\n").filter(Boolean));
  const added = sorted(rootNames).filter((name) => !previous.has(name));
  const removed = sorted(previous).filter((name) => !rootNames.has(name));
  errors.push(
    [
      "src/index.ts runtime exports differ from docs/public-api.snapshot.txt.",
      added.length ? `  added: ${added.join(", ")}` : "",
      removed.length ? `  removed: ${removed.join(", ")}` : "",
      "  Refresh with: node scripts/check-public-surface.mjs --write",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

for (const name of sorted(rootNames)) {
  if (internalNames.has(name) && !DUAL_OK.has(name)) {
    errors.push(`${name} is exported from both burne-ui and burne-ui/internal`);
  }
  if (authoringNames.has(name)) {
    errors.push(`${name} is exported from both burne-ui and burne-ui/authoring`);
  }
}

for (const name of sorted(studioNames)) {
  if (rootNames.has(name)) {
    errors.push(`${name} is exported from both burne-ui and burne-ui/studio`);
  }
}

let savedStudio = "";
try {
  savedStudio = await readFile(studioSnapshotPath, "utf8");
} catch {
  errors.push("docs/studio-api.snapshot.txt is missing. Run with --write.");
}

if (savedStudio && savedStudio !== studioSnapshot) {
  const previous = new Set(savedStudio.split("\n").filter(Boolean));
  const added = sorted(studioNames).filter((name) => !previous.has(name));
  const removed = sorted(previous).filter((name) => !studioNames.has(name));
  errors.push(
    [
      "src/studio.ts runtime exports differ from docs/studio-api.snapshot.txt.",
      "burne-ui/studio is experimental in 2.x: the snapshot is the name list.",
      added.length ? `  added: ${added.join(", ")}` : "",
      removed.length ? `  removed: ${removed.join(", ")}` : "",
      "  Refresh with: node scripts/check-public-surface.mjs --write",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

for (const name of AUTHORING_FORBIDDEN) {
  if (authoringNames.has(name) || rootNames.has(name)) {
    errors.push(`${name} is a public export`);
  }
}

let savedAuthoring = "";
try {
  savedAuthoring = await readFile(authoringSnapshotPath, "utf8");
} catch {
  errors.push("docs/authoring-api.snapshot.txt is missing. Run with --write.");
}

if (savedAuthoring && savedAuthoring !== authoringSnapshot) {
  const previous = new Set(savedAuthoring.split("\n").filter(Boolean));
  const added = sorted(authoringNames).filter((name) => !previous.has(name));
  const removed = sorted(previous).filter((name) => !authoringNames.has(name));
  errors.push(
    [
      "src/authoring.ts runtime exports differ from docs/authoring-api.snapshot.txt.",
      added.length ? `  added: ${added.join(", ")}` : "",
      removed.length ? `  removed: ${removed.join(", ")}` : "",
      "  Refresh with: node scripts/check-public-surface.mjs --write",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

for (const dir of componentRoots) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    continue;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    let source;
    try {
      source = await readFile(path.join(dir, entry.name, "index.ts"), "utf8");
    } catch {
      continue;
    }
    const extras = sorted(runtimeExportNames(source)).filter((name) => name !== entry.name);
    const allowed = new Set(FACADE_ALLOW[entry.name] ?? []);
    for (const name of extras) {
      if (!allowed.has(name)) {
        errors.push(`${entry.name}/index.ts exports runtime ${name}`);
      }
    }
    for (const name of allowed) {
      if (!extras.includes(name)) {
        errors.push(`${entry.name} allowlist names ${name}, which the index does not export`);
      }
    }
  }
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
for (const [key, value] of Object.entries(packageJson.exports ?? {})) {
  if (!key.startsWith("./") || key === "./package.json") continue;
  const target = typeof value === "string" ? value : value?.import;
  if (typeof target !== "string" || !target.includes("/components/")) continue;
  const srcIndex = path.join(root, target.replace(/^\.\/dist\//, "src/").replace(/\.js$/, ".ts"));
  let source;
  try {
    source = await readFile(srcIndex, "utf8");
  } catch {
    errors.push(`subpath ${key} has no source index at ${path.relative(root, srcIndex)}`);
    continue;
  }
  const folder = path.basename(path.dirname(srcIndex));
  const allowed = new Set([folder, ...(FACADE_ALLOW[folder] ?? [])]);
  for (const name of sorted(runtimeExportNames(source))) {
    if (!rootNames.has(name) && !allowed.has(name)) {
      errors.push(`subpath ${key} exports runtime ${name}, which burne-ui does not`);
    }
  }
}

if (errors.length > 0) {
  console.error(`check-public-surface:\n${errors.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}

console.log(
  `check-public-surface: OK — ${rootNames.size} runtime export(s), facade allowlist matches`,
);
