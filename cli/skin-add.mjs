/**
 * `burne-ui skin add <name> [--dir <path>]`
 *
 * Copies `cli/templates/skin` (or `skin-tier-2` / `skin-tier-3`) and replaces
 * `__SKIN_NAME__`, `__SKIN_TITLE__`, `__SKIN_IDENT__`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const templateDir = join(dirname(fileURLToPath(import.meta.url)), "templates");

function templateRoot(tier) {
  if (tier === 2) return join(templateDir, "skin-tier-2");
  if (tier === 3) return join(templateDir, "skin-tier-3");
  return join(templateDir, "skin");
}

const RESERVED = new Set([
  "default",
  "class",
  "function",
  "var",
  "const",
  "let",
  "import",
  "export",
  "return",
  "await",
  "enum",
  "package",
]);

export function skinIdent(name) {
  const camel = name.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
  return RESERVED.has(camel) ? `${camel}Skin` : camel;
}

export function skinTitle(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function renderTemplate(text, name) {
  return text
    .replaceAll("__SKIN_NAME__", name)
    .replaceAll("__SKIN_TITLE__", skinTitle(name))
    .replaceAll("__SKIN_IDENT__", skinIdent(name));
}

function copyTemplate(from, to, name) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) copyTemplate(src, dest, name);
    else writeFileSync(dest, renderTemplate(readFileSync(src, "utf8"), name));
  }
}

export function addSkin(name, dest, tier = 1) {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Skin name must be kebab-case, received ${name}`);
  }
  if (tier !== 1 && tier !== 2 && tier !== 3) {
    throw new Error(`Skin tier must be 1, 2, or 3, received ${tier}`);
  }
  if (existsSync(dest)) throw new Error(`${dest} already exists`);
  copyTemplate(templateRoot(tier), dest, name);
  return dest;
}

export function runSkinAdd(argv) {
  let dir;
  let tier = 1;
  const rest = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--dir") {
      dir = argv[index + 1];
      index += 1;
      continue;
    }
    if (argv[index] === "--tier") {
      tier = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    rest.push(argv[index]);
  }
  const name = rest[0];
  if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    console.error("Usage: burne-ui skin add <name> [--tier 1|2|3] [--dir <path>]\nName is kebab-case, for example paper.");
    process.exit(1);
  }
  if (tier !== 1 && tier !== 2 && tier !== 3) {
    console.error("Skin tier must be 1, 2, or 3.");
    process.exit(1);
  }
  const dest = dir ?? join(process.cwd(), `burne-ui-skin-${name}`);
  try {
    addSkin(name, dest, tier);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
  console.log(`Created ${dest}\nNext: npx burne-ui skin validate ${dest}`);
}
