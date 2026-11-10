import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "styles.css"), "utf8");

describe("forced-colors", () => {
  it("ships a Windows HCM fallback block", () => {
    expect(css).toContain("@media (forced-colors: active)");
    expect(css).toContain(".focus-ring-inset:focus-visible");
    expect(css).toContain("outline-color: Highlight");
    expect(css).toContain("forced-color-adjust: none");
    expect(css).toContain('[data-selection-fill][data-pressed="true"]');
    expect(css).toContain("[data-selection-mark]");
    expect(css).toContain('[role="switch"][aria-checked="true"] + *');
  });
});
