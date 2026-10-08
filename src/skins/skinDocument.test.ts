import { describe, expect, it } from "vitest";

import {
  parseSkinDocument,
  renderSkinPackage,
  renderSkinStylesheet,
  SKIN_DOCUMENT_SCHEMA,
  SKIN_EDITOR_EXAMPLE,
  skinExportName,
  skinToJson,
} from "./skinDocument";

describe("parseSkinDocument", () => {
  it("round-trips the editor example", () => {
    const parsed = parseSkinDocument(JSON.parse(skinToJson(SKIN_EDITOR_EXAMPLE)));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.skin).toEqual(SKIN_EDITOR_EXAMPLE);
  });

  it("rejects a forbidden token, an unknown slot, and a one-layer shadow", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: {
        "--color-surface": "#ffffff",
        "--color-foreground": "#111111",
        "--color-focus-ring": "#000000",
        "--shadow-base": "4px 4px 0 0 #111",
      },
      targets: { "button.missing": "x" },
      layers: {},
    });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((error) => error.includes("--color-focus-ring"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("button.missing"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("--shadow-base"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("unknown field layers"))).toBe(true);
  });

  it("rejects contrast below AA", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: { "--color-surface": "#ffffff", "--color-foreground": "#ffff00" },
    });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((error) => error.includes("WCAG AA"))).toBe(true);
  });

  it("keeps schema properties aligned with the parser", () => {
    expect(SKIN_DOCUMENT_SCHEMA.required).toEqual(["name"]);
    expect(SKIN_DOCUMENT_SCHEMA.properties).toHaveProperty("layersDeclarative");
    expect(SKIN_DOCUMENT_SCHEMA.properties).not.toHaveProperty("layers");
  });
});

describe("renderSkinPackage", () => {
  it("writes css for every token and a camelCase export", () => {
    const css = renderSkinStylesheet(SKIN_EDITOR_EXAMPLE);
    expect(css).toContain('[data-skin="paper"]');
    expect(css).toContain("--color-foreground: #111111;");
    expect(css).toContain("--color-foreground: initial;");
    expect(skinExportName("soft-paper")).toBe("softPaper");
    expect(renderSkinPackage(SKIN_EDITOR_EXAMPLE)).toContain("export const paper");
    expect(renderSkinPackage(SKIN_EDITOR_EXAMPLE)).toContain('"burne-ui": "^1.8.8"');
  });
});
