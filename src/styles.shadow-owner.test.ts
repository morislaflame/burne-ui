import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "styles.css"), "utf8");

function stripComments(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("Э1.3 box-shadow single owner", () => {
  it("does not put box-shadow inside any transition", () => {
    const stripped = stripComments(css);
    const hits: string[] = [];
    const re = /transition\s*:/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(stripped))) {
      const start = match.index + match[0].length;
      const end = stripped.indexOf(";", start);
      if (end === -1) continue;
      const value = stripped.slice(start, end);
      if (/(^|)\s*box-shadow\b/i.test(value)) hits.push(value.trim());
    }
    expect(hits).toEqual([]);
  });

  it("paints focus-ring-inset with inward outline, not box-shadow", () => {
    const at = css.indexOf("@utility focus-ring-inset");
    expect(at).toBeGreaterThan(-1);
    const open = css.indexOf("{", at);
    const close = css.indexOf("\n}", open);
    const body = css.slice(open, close);
    expect(body).toMatch(/outline-offset:\s*calc\(\s*-1\s*\*\s*var\(--focus-ring-width/);
    expect(body).not.toMatch(/box-shadow\s*:/);
  });
});
