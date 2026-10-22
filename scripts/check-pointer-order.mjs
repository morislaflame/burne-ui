#!/usr/bin/env node
// `{...rest}` / `{...props}` must come before `{...pointerHandlers}` on the same tag.
// `useMotionPart({ pointerPhases: true })` must take `onPointer*` out of `...rest`,
// otherwise the merged handlers replace the user's and motion never sees them.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src", "components");

function mask(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (line) => " ".repeat(line.length));
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(tsx|ts)$/.test(entry.name) && !/\.(stories|test)\./.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function openingTags(source) {
  const tags = [];
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] !== "<" || !/[A-Za-z]/.test(source[i + 1] ?? "")) continue;
    let brace = 0;
    let quote = null;
    for (let j = i + 1; j < source.length; j += 1) {
      const char = source[j];
      if (quote) {
        if (char === "\\") {
          j += 1;
          continue;
        }
        if (char === quote) quote = null;
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        quote = char;
        continue;
      }
      if (char === "{") brace += 1;
      else if (char === "}") brace -= 1;
      else if (char === ">" && brace === 0) {
        tags.push({ start: i, text: source.slice(i, j + 1) });
        i = j;
        break;
      }
    }
  }
  return tags;
}

function skipBack(source, index, open, close) {
  let depth = 0;
  let quote = null;
  for (let i = index; i >= 0; i -= 1) {
    const char = source[i];
    if (quote) {
      if (char === quote && source[i - 1] !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === close) depth += 1;
    else if (char === open) {
      if (depth === 0) return i;
      depth -= 1;
    }
  }
  return -1;
}

function enclosingParams(source, index) {
  const body = skipBack(source, index, "{", "}");
  if (body < 0) return "";
  let end = body - 1;
  while (end >= 0 && /\s/.test(source[end])) end -= 1;
  if (source[end] !== ")") return "";
  const open = skipBack(source, end, "(", ")");
  if (open < 0) return "";
  return source.slice(open + 1, end);
}

function restBag(params) {
  const match = params.match(/\{[\s\S]*?\.\.\.(?:rest|props)\b[\s\S]*?\}/);
  return match?.[0] ?? "";
}

function extractedBeforeRest(bag, name) {
  const restAt = bag.search(/\.\.\.(?:rest|props)\b/);
  if (restAt < 0) return false;
  return bag.slice(0, restAt).includes(name);
}

function motionPartCalls(source) {
  const calls = [];
  const re = /useMotionPart\b/g;
  for (const match of source.matchAll(re)) {
    let i = match.index + match[0].length;
    while (i < source.length && /\s/.test(source[i])) i += 1;
    if (source[i] === "<") {
      const close = source.indexOf(">(", i);
      if (close < 0) continue;
      i = close + 1;
    }
    if (source[i] !== "(") continue;
    let j = i + 1;
    while (j < source.length && /\s/.test(source[j])) j += 1;
    if (source[j] !== "{") continue;
    const end = (() => {
      let depth = 0;
      let quote = null;
      for (let k = j; k < source.length; k += 1) {
        const char = source[k];
        if (quote) {
          if (char === "\\") {
            k += 1;
            continue;
          }
          if (char === quote) quote = null;
          continue;
        }
        if (char === '"' || char === "'" || char === "`") {
          quote = char;
          continue;
        }
        if (char === "{") depth += 1;
        else if (char === "}") {
          depth -= 1;
          if (depth === 0) return k;
        }
      }
      return -1;
    })();
    if (end < 0) continue;
    calls.push({ index: match.index, object: source.slice(j, end + 1) });
  }
  return calls;
}

const errors = [];

for (const file of await walk(src)) {
  const rel = path.relative(root, file);
  const raw = await readFile(file, "utf8");
  const source = mask(raw);

  for (const tag of openingTags(source)) {
    const spreads = [...tag.text.matchAll(/\{\s*\.\.\.\s*([^}]+?)\s*\}/g)];
    const pointerAt = spreads.find((spread) => spread[1].includes("pointerHandlers"));
    const restAt = spreads.find((spread) => /^(?:rest|props)$/.test(spread[1].trim()));
    if (!pointerAt || !restAt || pointerAt.index > restAt.index) continue;
    errors.push(
      `${rel}:${lineOf(source, tag.start + pointerAt.index)} pointerHandlers spread is before {...${restAt[1].trim()}}`,
    );
  }

  for (const call of motionPartCalls(source)) {
    const hover = /pointerPhases\s*:\s*true\b/.test(call.object);
    const press = /pressPhases\s*:\s*true\b/.test(call.object);
    if (!hover && !press) continue;
    const bag = restBag(enclosingParams(source, call.index));
    if (!bag) continue;
    const missing = [];
    if (hover) {
      if (!extractedBeforeRest(bag, "onPointerOver")) missing.push("onPointerOver");
      if (!extractedBeforeRest(bag, "onPointerOut")) missing.push("onPointerOut");
    }
    if (press) {
      if (!extractedBeforeRest(bag, "onPointerDown")) missing.push("onPointerDown");
      if (!extractedBeforeRest(bag, "onPointerUp")) missing.push("onPointerUp");
    }
    if (missing.length > 0) {
      errors.push(
        `${rel}:${lineOf(source, call.index)} useMotionPart pointer phases without ${missing.join(", ")} before ...rest`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`check-pointer-order:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("check-pointer-order: ok");
