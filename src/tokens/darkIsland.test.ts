import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "styles.css"), "utf8");

function ruleBody(source: string, selector: RegExp): string {
  const start = source.search(selector);
  expect(start).toBeGreaterThan(-1);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error(`unclosed rule ${selector}`);
}

function keys(body: string): string[] {
  return [...body.matchAll(/(^|\n)\s*(--[\w-]+)\s*:/g)].map((match) => match[2]!);
}

describe("dark theme island", () => {
  const geometry = ruleBody(css, /^:root \{/m);
  const dark = ruleBody(css, /:root,\s*\[data-theme="dark"\] \{/);
  const light = ruleBody(css, /\n\[data-theme="light"\] \{/);

  it("repeats only the light block's keys on the dark island", () => {
    const darkKeys = keys(dark).sort();
    const lightKeys = keys(light).sort();
    expect(darkKeys).toEqual(lightKeys);
    const geometryKeys = new Set(keys(geometry));
    expect(darkKeys.filter((key) => geometryKeys.has(key))).toEqual([]);
  });

  it("keeps scale, type, motion and shadow knobs on :root", () => {
    const geometryKeys = keys(geometry);
    expect(geometryKeys).toContain("--radius-base");
    expect(geometryKeys).toContain("--space-base");
    expect(geometryKeys).toContain("--font-family-sans");
    expect(geometryKeys).toContain("--motion-surface-duration");
    expect(geometryKeys).toContain("--focus-ring-width");
    expect(geometryKeys).toContain("--shadow-opacity");
    expect(geometryKeys).not.toContain("--color-background");
  });

  it("paints dark colors on :root and on data-theme=dark, light colors on data-theme=light", () => {
    expect(dark).toContain("--color-foreground: #f4f5f7;");
    expect(dark).toContain("--color-background: #0c0d10;");
    expect(light).toContain("--color-foreground: #18181b;");
    expect(light).toContain("--color-background: #f5f5f5;");
  });
});
