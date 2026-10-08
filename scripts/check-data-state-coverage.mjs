#!/usr/bin/env node
// Э3.1: stateful hosts publish data-state from the kit vocabulary.
// Ad-hoc data-search-expanded / data-allows-sorting stay deleted.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsRoot = path.join(root, "src/components");

const HOSTS = [
  "src/components/core/Button",
  "src/components/core/Checkbox",
  "src/components/core/ComboBox",
  "src/components/core/Dialog",
  "src/components/core/Disclosure",
  "src/components/core/SearchInput",
  "src/components/core/Select",
  "src/components/core/DatePicker",
  "src/components/core/Switch",
  "src/components/core/Tabs",
  "src/components/core/Radio",
  "src/components/core/ToggleButton",
  "src/components/core/Pagination",
  "src/components/core/Table",
  "src/components/core/ListBox",
  "src/components/core/Expandable",
  "src/components/composite/Accordion",
  "src/components/core/Drawer",
  "src/components/composite/AlertDialog",
  "src/components/core/Popover",
  "src/components/core/Tooltip",
  "src/components/core/Dropdown",
  "src/components/core/ContextMenu",
  "src/components/core/Stepper",
  "src/components/core/Toast",
];

const VOCAB = new Set([
  "open",
  "closed",
  "checked",
  "unchecked",
  "indeterminate",
  "active",
  "inactive",
  "selected",
  "expanded",
  "collapsed",
  "on",
  "off",
  "loading",
  "idle",
  "success",
  "error",
]);

const FORBIDDEN = ["data-search-expanded", "data-search-expand", "data-allows-sorting"];

const KIT_DATA_ATTR = /\bdata-(?:state|side|align|selected|invalid|size|variant|status)\s*=/g;

function isSource(file) {
  return (
    (file.endsWith(".ts") || file.endsWith(".tsx")) &&
    !file.endsWith(".test.ts") &&
    !file.endsWith(".test.tsx") &&
    !file.endsWith(".stories.tsx")
  );
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (isSource(full)) files.push(full);
  }
  return files;
}

function kitAttrsBeforeSpread(source) {
  const hits = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] !== "<" || !/[A-Za-z]/.test(source[i + 1] ?? "")) {
      i += 1;
      continue;
    }
    let j = i + 1;
    let depth = 0;
    let quote = null;
    let end = -1;
    for (; j < source.length; j++) {
      const ch = source[j];
      if (quote) {
        if (ch === "\\" && quote !== "`") {
          j += 1;
          continue;
        }
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        continue;
      }
      if (ch === "{") depth += 1;
      else if (ch === "}") depth = Math.max(0, depth - 1);
      else if (ch === ">" && depth === 0) {
        end = j;
        break;
      }
    }
    if (end === -1) break;
    const tag = source.slice(i, end);
    const spreads = [];
    const spreadRe = /\{\s*\.\.\./g;
    let match;
    while ((match = spreadRe.exec(tag))) spreads.push(match.index);
    if (spreads.length > 0) {
      const lastSpread = Math.max(...spreads);
      KIT_DATA_ATTR.lastIndex = 0;
      while ((match = KIT_DATA_ATTR.exec(tag))) {
        if (match.index < lastSpread) {
          const line = source.slice(0, i).split("\n").length;
          hits.push(`line ${line}: ${match[0].trim()} is before the last {...} spread`);
        }
      }
    }
    i = end + 1;
  }
  return hits;
}

function expressions(source) {
  const found = [];
  const re = /data-state(?:=\{|"\s*:)/g;
  let match;
  while ((match = re.exec(source))) {
    if (match[0].endsWith("{")) {
      const brace = match.index + match[0].length - 1;
      let depth = 0;
      for (let i = brace; i < source.length; i++) {
        const ch = source[i];
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) {
            found.push(source.slice(brace + 1, i));
            break;
          }
        }
      }
      continue;
    }
    const colon = source.indexOf(":", match.index);
    let depth = 0;
    let expr = "";
    for (let i = colon + 1; i < source.length; i++) {
      const ch = source[i];
      if (ch === "(" || ch === "{" || ch === "[") depth++;
      else if (ch === ")" || ch === "}" || ch === "]") {
        if (depth === 0) break;
        depth--;
      } else if ((ch === "," || ch === "\n") && depth === 0) break;
      expr += ch;
    }
    found.push(expr);
  }
  return found;
}

const errors = [];
const files = await walk(componentsRoot);

for (const rel of HOSTS) {
  const dir = path.join(root, rel);
  const hostFiles = (await walk(dir)).filter((file) => !file.endsWith(`${path.sep}dataContract.ts`));
  const hit = [];
  for (const file of hostFiles) {
    const text = await readFile(file, "utf8");
    if (text.includes("data-state")) hit.push(file);
  }
  if (hit.length === 0) errors.push(`${rel} does not publish data-state`);
}

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const name of FORBIDDEN) {
    if (text.includes(name)) errors.push(`${path.relative(root, file)} still uses ${name}`);
  }
  for (const hit of kitAttrsBeforeSpread(text)) {
    errors.push(`${path.relative(root, file)} ${hit}`);
  }
  for (const expr of expressions(text)) {
    const literals = expr.match(/"([a-z]+)"|'([a-z]+)'/g) ?? [];
    for (const literal of literals) {
      const value = literal.slice(1, -1);
      if (!VOCAB.has(value)) {
        errors.push(
          `${path.relative(root, file)} data-state "${value}" is outside the kit vocabulary`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`check-data-state-coverage:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("check-data-state-coverage: OK — stateful hosts publish data-state from the kit vocabulary.");
