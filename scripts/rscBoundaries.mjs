/**
 * Shared RSC boundary rules for the lib build and `check-rsc-boundaries`.
 *
 * `"use client"` is decided from **emitted** JS (jsx-runtime, gsap, Object.assign
 * on an import), not from source `from "react"`. Server-safe files stay unmarked
 * even if they import React (`themeScript`).
 */

export const USE_CLIENT_DIRECTIVE = '"use client";';

const SERVER_SAFE_FILES = new Set([
  "index.js",
  "internal.js",
  "utils/cn.js",
  "utils/prettify.js",
  "theme/themeScript.js",
]);

const CLIENT_RUNTIME_SPECIFIER =
  /(?:from|require\()\s*["'](?:react|react-dom|gsap|react-icons)(?:\/[^"']*)?["']/;

/** @param {string} fileName Rollup `chunk.fileName` or path relative to `dist/` */
export function isServerSafeDistFile(fileName) {
  const rel = fileName.replace(/\\/g, "/");
  if (rel.startsWith("styles.entry.")) return true;
  if (SERVER_SAFE_FILES.has(rel)) return true;
  return rel.startsWith("tokens/");
}

/** @param {string} code */
export function hasUseClientDirective(code) {
  const start = code.replace(/^\uFEFF/, "").trimStart();
  return start.startsWith('"use client"') || start.startsWith("'use client'");
}

/** @param {string} clause */
function collectFromImportClause(clause, names) {
  const trimmed = clause.trim();
  if (!trimmed) return;

  const namespace = trimmed.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
  if (namespace) {
    names.add(namespace[1]);
    return;
  }

  const mixed = trimmed.match(/^([A-Za-z_$][\w$]*)\s*,\s*([\s\S]+)$/);
  if (mixed) {
    names.add(mixed[1]);
    collectFromImportClause(mixed[2], names);
    return;
  }

  if (trimmed.startsWith("{")) {
    const end = trimmed.lastIndexOf("}");
    const inner = end === -1 ? trimmed.slice(1) : trimmed.slice(1, end);
    for (const part of inner.split(",")) {
      const bit = part.trim();
      if (!bit || bit.startsWith("type ")) continue;
      const aliased = bit.match(/^(?:type\s+)?[A-Za-z_$][\w$]*\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (aliased) {
        names.add(aliased[1]);
        continue;
      }
      const name = bit.replace(/^type\s+/, "").trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
    return;
  }

  if (/^[A-Za-z_$][\w$]*$/.test(trimmed)) names.add(trimmed);
}

/** @param {string} code */
export function collectImportedBindings(code) {
  const names = new Set();

  const esm = /\bimport\s+(?!type\b)([\s\S]*?)\s+from\s+["'][^"']+["']/g;
  for (const match of code.matchAll(esm)) {
    collectFromImportClause(match[1], names);
  }

  const cjsDefault = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(/g;
  for (const match of code.matchAll(cjsDefault)) {
    names.add(match[1]);
  }

  const cjsNamed = /\b(?:const|let|var)\s*\{([^}]+)\}\s*=\s*require\s*\(/g;
  for (const match of code.matchAll(cjsNamed)) {
    collectFromImportClause(`{${match[1]}}`, names);
  }

  return names;
}

/** @param {string} name */
function escapeRegExp(name) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * `Object.assign(Imported, …)` / `Imported.displayName =` — Next proxy throws
 * if this runs in a server module that imported a client binding.
 *
 * @param {string} code
 */
export function mutatesImportedBinding(code) {
  const names = collectImportedBindings(code);
  for (const name of names) {
    const id = escapeRegExp(name);
    if (new RegExp(`Object\\.assign\\(\\s*${id}\\b`).test(code)) return true;
    if (new RegExp(`(?:^|[\\n;{])\\s*${id}\\.displayName\\s*=`).test(code)) return true;
  }
  return false;
}

/** @param {string} code */
export function needsUseClient(code) {
  return CLIENT_RUNTIME_SPECIFIER.test(code) || mutatesImportedBinding(code);
}

/** @param {string} code */
export function prependUseClient(code) {
  if (hasUseClientDirective(code)) return code;
  return `${USE_CLIENT_DIRECTIVE}\n${code}`;
}
