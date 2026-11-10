/**
 * Token stylesheet for `skin build` and the editor export.
 * Dark is the base `[data-skin]` block. Light is the override under `data-theme="light"`.
 * A later `[data-theme="dark"]` block repeats the dark tokens so a light ancestor
 * does not keep painting a dark island.
 */

function cssBlock(selector, tokens) {
  if (!tokens || Object.keys(tokens).length === 0) return "";
  const body = Object.entries(tokens).map(([key, value]) => `  ${key}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}\n`;
}

function mergedSkinTokens(base, overlay) {
  return { ...(base ?? {}), ...(overlay ?? {}) };
}

function sameTokenRecord(a, b) {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

export function renderSkinStylesheet(skin) {
  const name = String(skin.name).replace(/"/g, "");
  const dark = mergedSkinTokens(skin.tokens, skin.tokensDark);
  const light = mergedSkinTokens(skin.tokens, skin.tokensLight);
  const lightBlock = { ...light };
  for (const key of Object.keys(skin.tokensDark ?? {})) {
    if (light[key] === undefined) lightBlock[key] = "unset";
  }
  const lightSelector = `[data-theme="light"] [data-skin="${name}"], [data-theme="light"][data-skin="${name}"]`;
  const darkSelector = `[data-theme="dark"] [data-skin="${name}"], [data-theme="dark"][data-skin="${name}"]`;
  const lightDiffers = !sameTokenRecord(dark, lightBlock);
  return [
    `/* ${name} */`,
    cssBlock(`[data-skin="${name}"]`, dark).trimEnd(),
    lightDiffers ? cssBlock(lightSelector, lightBlock).trimEnd() : "",
    lightDiffers ? cssBlock(darkSelector, dark).trimEnd() : "",
    renderSkinFonts(skin),
    renderSkinProperties(skin),
    renderSkinRules(skin),
    "",
  ]
    .filter((part) => part !== "")
    .join("\n\n");
}

function ruleClass(name, slot) {
  return `skin-${name}-${String(slot).replaceAll(".", "-")}`;
}

function declarationBlock(selector, style) {
  if (!style || typeof style !== "object") return "";
  const entries = Object.entries(style).filter(([, value]) => typeof value === "string");
  if (entries.length === 0) return "";
  const body = entries.map(([key, value]) => `  ${key}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}`;
}

function renderSkinRules(skin) {
  const rules = skin.rules;
  if (!rules || typeof rules !== "object") return "";
  const blocks = [];
  for (const [slot, spec] of Object.entries(rules)) {
    if (!spec || typeof spec !== "object") continue;
    const selector = `.${ruleClass(skin.name, slot)}`;
    // Theme branches before :hover. `:where` keeps the dark page rule at class
    // specificity, so a later `:hover` of the same class still wins.
    // `<html>` in the dark theme has no attribute, so the page matches `:root:not([data-theme="light"])`.
    const darkSelector = `:where(:root:not([data-theme="light"])) ${selector}, [data-theme="dark"] ${selector}`;
    blocks.push(declarationBlock(selector, spec.style));
    blocks.push(declarationBlock(darkSelector, spec.dark));
    blocks.push(declarationBlock(`[data-theme="light"] ${selector}`, spec.light));
    blocks.push(declarationBlock(`${selector}:hover`, spec.hover));
    blocks.push(declarationBlock(`${selector}:focus-visible`, spec["focus-visible"]));
    blocks.push(declarationBlock(`${selector}::before`, spec["::before"]));
    blocks.push(declarationBlock(`${selector}::after`, spec["::after"]));
    for (const [flag, style] of Object.entries(spec.state ?? {})) {
      blocks.push(declarationBlock(`${selector}[data-state="${flag}"]`, style));
    }
    for (const [flag, style] of Object.entries(spec.status ?? {})) {
      blocks.push(declarationBlock(`${selector}[data-status="${flag}"]`, style));
    }
  }
  return blocks.filter(Boolean).join("\n\n");
}

function renderSkinProperties(skin) {
  const properties = skin.properties;
  if (!properties || typeof properties !== "object") return "";
  return Object.entries(properties)
    .map(([name, spec]) => {
      if (!spec || typeof spec !== "object") return "";
      return `@property ${name} {\n  syntax: ${JSON.stringify(spec.syntax)};\n  inherits: ${spec.inherits ? "true" : "false"};\n  initial-value: ${spec.initialValue};\n}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

function renderSkinFonts(skin) {
  if (!Array.isArray(skin.fonts)) return "";
  return skin.fonts
    .map((font) => {
      if (!font || typeof font !== "object") return "";
      if (typeof font.href === "string" && font.src == null) return `@import url(${JSON.stringify(font.href)});`;
      const lines = [`  font-family: ${JSON.stringify(font.family)};`];
      if (typeof font.src === "string") lines.push(`  src: ${font.src};`);
      if (typeof font.weight === "string") lines.push(`  font-weight: ${font.weight};`);
      if (typeof font.style === "string") lines.push(`  font-style: ${font.style};`);
      return `@font-face {\n${lines.join("\n")}\n}`;
    })
    .filter(Boolean)
    .join("\n\n");
}
