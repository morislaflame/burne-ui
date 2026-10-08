/**
 * `burne-ui skin add <name> [--dir <path>]`
 *
 * Copies `cli/templates/skin` and replaces `__SKIN_NAME__`, `__SKIN_TITLE__`, `__SKIN_IDENT__`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const templateRoot = join(dirname(fileURLToPath(import.meta.url)), "templates/skin");

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

export function addSkin(name, dest) {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Skin name must be kebab-case, received ${name}`);
  }
  if (existsSync(dest)) throw new Error(`${dest} already exists`);
  copyTemplate(templateRoot, dest, name);
  return dest;
}

export function runSkinAdd(argv) {
  let dir;
  const rest = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--dir") {
      dir = argv[index + 1];
      index += 1;
      continue;
    }
    rest.push(argv[index]);
  }
  const name = rest[0];
  if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
    console.error("Usage: burne-ui skin add <name> [--dir <path>]\nName is kebab-case, for example paper.");
    process.exit(1);
  }
  const dest = dir ?? join(process.cwd(), `burne-ui-skin-${name}`);
  try {
    addSkin(name, dest);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
  console.log(`Created ${dest}\nNext: npx burne-ui skin validate ${dest}`);
}
