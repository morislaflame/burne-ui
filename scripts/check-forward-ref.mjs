#!/usr/bin/env node
// Public DOM parts must be forwardRef. React 18 drops ref on a function
// component. React 19 puts ref into props, and `{...rest}` then overwrites
// the internal motion ref.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src", "components");

const required = [
  "AccordionHeading",
  "AccordionMessage",
  "AlertDialogHeadingBlock",
  "CheckboxError",
  "CheckboxHint",
  "CheckboxIndicator",
  "CheckboxLabel",
  "ComboBoxRoot",
  "DatePickerRoot",
  "DialogHeadingBlock",
  "DrawerHandleInner",
  "DrawerHeadingBlock",
  "DrawerOverlayInner",
  "DropdownItemHint",
  "DropdownItemIcon",
  "DropdownItemIndicator",
  "DropdownItemLabel",
  "DropdownSeparator",
  "FieldLegendHeader",
  "FieldRoot",
  "FieldRootShell",
  "InputRoot",
  "KbdText",
  "LabelSlot",
  "ListBoxEmpty",
  "ListBoxHeader",
  "ListBoxHint",
  "ListBoxIcon",
  "ListBoxItem",
  "ListBoxItemIndicator",
  "ListBoxLabel",
  "ListBoxRoot",
  "ListBoxRootShell",
  "ListBoxSection",
  "ListBoxSeparator",
  "MeterRoot",
  "NumberInputRoot",
  "PaginationPages",
  "PinInputRoot",
  "ProgressBarRoot",
  "RadioError",
  "RadioHint",
  "RadioIndicator",
  "RadioLabel",
  "SelectRoot",
  "SliderFill",
  "SliderHeader",
  "SliderRail",
  "SliderRoot",
  "SliderValue",
  "SwitchError",
  "SwitchFill",
  "SwitchHint",
  "SwitchIcon",
  "SwitchLabel",
  "SwitchThumb",
  "SwitchTrack",
  "TagsInputRoot",
  "TextAreaRoot",
  "TimeFieldRoot",
  "TooltipMessage",
  "TooltipPanel",
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".tsx") && !/\.(stories|test)\.tsx$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function isForwardRef(source, name) {
  const direct = new RegExp(
    `(?:export\\s+)?const\\s+${name}\\s*=\\s*(?:memo\\(\\s*)?forwardRef\\b`,
  );
  if (direct.test(source)) return true;
  const alias = new RegExp(`(?:export\\s+)?const\\s+${name}\\s*=\\s*memo\\(\\s*([A-Za-z0-9_]+)\\s*\\)`);
  const match = source.match(alias);
  if (!match) return false;
  return isForwardRef(source, match[1]);
}

const files = await walk(src);
const texts = await Promise.all(files.map((file) => readFile(file, "utf8")));
const bundled = texts.join("\n");
const missing = required.filter((name) => !isForwardRef(bundled, name));

if (missing.length > 0) {
  console.error("check-forward-ref: these DOM parts are not forwardRef:");
  for (const name of missing) console.error(`  ${name}`);
  process.exit(1);
}

console.log(`check-forward-ref: ${required.length} DOM parts use forwardRef`);
