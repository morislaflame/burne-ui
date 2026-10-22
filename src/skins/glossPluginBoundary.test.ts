import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function filesImportingGlossSheets(dir: string): string[] {
  const hits: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === "node_modules") continue;
      hits.push(...filesImportingGlossSheets(full));
      continue;
    }
    if (!/\.(tsx?|jsx?)$/.test(name)) continue;
    const text = readFileSync(full, "utf8");
    if (/import\s+["'][^"']*gloss(?:Interactive|Panel)\.css["']/.test(text)) hits.push(full);
  }
  return hits;
}

describe("gloss stays outside the kit", () => {
  it("does not ship a gloss definition or import gloss sheets", () => {
    const index = readFileSync(path.join(src, "index.ts"), "utf8");
    const entry = readFileSync(path.join(src, "styles.entry.ts"), "utf8");
    expect(index).not.toContain("glossSkin");
    expect(existsSync(path.join(src, "skins/glossSkin.ts"))).toBe(false);
    expect(entry).not.toContain("glossInteractive.css");
    expect(entry).not.toContain("glossPanel.css");
    expect(filesImportingGlossSheets(src)).toEqual([]);
  });
});
