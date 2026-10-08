#!/usr/bin/env node
// Э2: every form control publishes aria-invalid from invalid / error, not from status.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Assignment must mention invalid (isInvalid, ariaInvalid, invalid), never status. */
const ASSIGNMENT = /aria-invalid=\{[^}\n]*[Ii]nvalid[^}\n]*\}/;
const FROM_STATUS = /aria-invalid=\{[^}\n]*status/;

const LEAVES = [
  ["Input", "src/components/core/Input/inputControlParts.tsx"],
  ["TextArea", "src/components/core/TextArea/textAreaParts.tsx"],
  ["Select", "src/components/core/Select/selectTriggerParts.tsx"],
  ["DatePicker", "src/components/core/DatePicker/datePickerParts.tsx"],
  ["NumberInput", "src/components/core/NumberInput/numberInputParts.tsx"],
  ["PinInput", "src/components/core/PinInput/pinInputParts.tsx"],
  ["ComboBox", "src/components/core/ComboBox/comboBoxParts.tsx"],
  ["SearchInput", "src/components/core/SearchInput/searchInputParts.tsx"],
  ["Checkbox", "src/components/core/Checkbox/checkboxParts.tsx"],
  ["Radio", "src/components/core/Radio/radioParts.tsx"],
  ["Switch", "src/components/core/Switch/switchControlParts.tsx"],
  ["Slider", "src/components/core/Slider/sliderThumbParts.tsx"],
  ["ColorPicker", "src/components/core/ColorPicker/colorPickerParts.tsx"],
  ["TimeField", "src/components/core/TimeField/timeFieldParts.tsx"],
];

const GROUPS = [
  ["RadioGroup", "src/components/composite/RadioGroup/RadioGroup.tsx", "src/components/composite/RadioGroup/radioGroupTypes.ts"],
  ["CheckboxGroup", "src/components/composite/CheckboxGroup/CheckboxGroup.tsx", "src/components/composite/CheckboxGroup/checkboxGroupTypes.ts"],
];

const errors = [];

for (const [name, rel] of LEAVES) {
  const text = await readFile(path.join(root, rel), "utf8");
  if (!ASSIGNMENT.test(text)) {
    errors.push(`${name}: ${rel} must set aria-invalid from invalid`);
  }
  if (FROM_STATUS.test(text)) {
    errors.push(`${name}: ${rel} sets aria-invalid from status`);
  }
}

const field = await readFile(path.join(root, "src/components/core/Field/fieldParts.tsx"), "utf8");
if (!field.includes("resolveFieldInvalid(")) {
  errors.push("Field: fieldParts.tsx must resolve invalid");
}
if (!/aria-invalid=\{isInvalid/.test(field)) {
  errors.push("Field.Set: fieldset must set aria-invalid={isInvalid");
}
if (FROM_STATUS.test(field)) {
  errors.push("Field: aria-invalid comes from status");
}

for (const [name, componentRel, typesRel] of GROUPS) {
  const component = await readFile(path.join(root, componentRel), "utf8");
  const types = await readFile(path.join(root, typesRel), "utf8");
  if (!/invalid\?:\s*boolean/.test(types)) {
    errors.push(`${name}: missing invalid?: boolean`);
  }
  if (!component.includes("<OptionGroupFieldset") || !component.includes("{...props}")) {
    errors.push(`${name}: invalid must reach OptionGroupFieldset via props`);
  }
}

if (errors.length > 0) {
  console.error(`check-aria-invalid-coverage:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("check-aria-invalid-coverage: OK — 16 form controls publish aria-invalid from invalid.");
