import { describe, expect, it } from "vitest";

import { createDefaultThemeState, exportThemeCss } from "@/theme/themeDefaults";
import { themeTokenStateToConfig } from "@/theme/themeConfig";

import {
  parseDesignDocument,
  renderDesignCss,
  THEME_TOKEN_SCHEMA,
  validateDesign,
} from "../studio";

describe("design document", () => {
  it("lists every color key and the motion limits", () => {
    const focus = THEME_TOKEN_SCHEMA.find((entry) => entry.key === "focusRingWidth");
    expect(focus?.min).toBe(0.5);
    expect(focus?.label.ru).toBe("Толщина кольца");
    expect(THEME_TOKEN_SCHEMA.some((entry) => entry.key === "shadow" && entry.type === "color")).toBe(true);
    expect(THEME_TOKEN_SCHEMA.some((entry) => entry.key === "regular")).toBe(false);
  });

  it("accepts the kit palette at WCAG AA", () => {
    const parsed = parseDesignDocument({ version: 1, name: "kit", theme: {} });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const result = validateDesign(parsed.design);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("parses a kebab-case design and rejects a bad name", () => {
    const parsed = parseDesignDocument({ version: 1, name: "aurora", theme: {} });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.warnings.some((warning) => warning.includes("filled from the kit"))).toBe(true);
    expect(parseDesignDocument({ version: 1, name: "Aurora", theme: {} }).ok).toBe(false);
  });

  it("renders both palettes and a slot rule class", () => {
    const parsed = parseDesignDocument({
      version: 1,
      name: "aurora",
      theme: {
        space: 0.75,
        colors: {
          dark: { foreground: "#f4f5f7" },
          light: { foreground: "#102030" },
        },
      },
      skin: {
        name: "aurora",
        rules: { "button.root": { style: { "clip-path": "inset(0)" } } },
      },
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const css = renderDesignCss(parsed.design);
    expect(css).toContain("--space: 0.75rem;");
    expect(css).not.toContain("clamp(");
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain(".skin-aurora-button-root");
    expect(css).toContain("clip-path: inset(0);");
    const check = validateDesign(parsed.design);
    expect(check.errors.some((error) => error.includes("focusRingWidth"))).toBe(false);
  });
});

describe("theme export", () => {
  it("writes fixed rem and both palettes, and a config of differences", () => {
    const state = createDefaultThemeState("dark");
    state.space = 0.75;
    state.modePalettes.light = { ...state.modePalettes.light, foreground: "#111111" };
    const css = exportThemeCss(state);
    expect(css).toContain("--space: 0.75rem;");
    expect(css).not.toContain("clamp(");
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain("--color-foreground: #111111;");
    const config = themeTokenStateToConfig(state);
    expect(config.toast).toBeUndefined();
    expect(config.tokens).toEqual({ space: 0.75 });
    expect(config.colors?.light).toEqual({ foreground: "#111111" });
    expect(config.colors?.dark).toBeUndefined();
    expect(config.motion).toBeUndefined();
  });

  it("omits kit defaults from the starter config", () => {
    const config = themeTokenStateToConfig(createDefaultThemeState("dark"));
    expect(config).toEqual({ theme: "dark" });
  });

  it("paints a dark override on the dark page and on an island, and leaves the light page on its own palette", () => {
    const state = createDefaultThemeState("dark");
    state.colors = { ...state.colors, primary: "#0000aa" };
    state.modePalettes = {
      dark: { ...state.modePalettes.dark, primary: "#0000aa" },
      light: { ...state.modePalettes.light, primary: "#cc0000" },
    };
    const user = exportThemeCss(state);
    const lightAt = user.indexOf('[data-theme="light"]');
    const darkAt = user.indexOf(':root:not([data-theme="light"])');
    expect(lightAt).toBeGreaterThan(-1);
    expect(darkAt).toBeGreaterThan(lightAt);
    expect(user).toContain('[data-theme="dark"]');
    const kit = [
      ':root,',
      '[data-theme="dark"] {',
      "  --color-primary: #111111;",
      "}",
      "",
      '[data-theme="light"] {',
      "  --color-primary: #eeeeee;",
      "}",
    ].join("\n");
    const css = `${kit}\n${user}`;
    expect(winningColor(css, { root: true, theme: "light" })).toBe("#cc0000");
    expect(winningColor(css, { root: true, theme: null })).toBe("#0000aa");
    expect(winningColor(css, { root: false, theme: "dark" })).toBe("#0000aa");

    const darkOnly = createDefaultThemeState("dark");
    darkOnly.colors = { ...darkOnly.colors, primary: "#0000aa" };
    darkOnly.modePalettes = {
      ...darkOnly.modePalettes,
      dark: { ...darkOnly.modePalettes.dark, primary: "#0000aa" },
    };
    const darkCss = `${kit}\n${exportThemeCss(darkOnly)}`;
    expect(winningColor(darkCss, { root: true, theme: "light" })).toBe("#eeeeee");
    expect(winningColor(darkCss, { root: true, theme: null })).toBe("#0000aa");
    expect(winningColor(darkCss, { root: false, theme: "dark" })).toBe("#0000aa");
  });
});

function selectorMatches(selector: string, node: { root: boolean; theme: string | null }): boolean {
  if (selector === ":root") return node.root;
  if (selector === '[data-theme="light"]') return node.theme === "light";
  if (selector === '[data-theme="dark"]') return node.theme === "dark";
  if (selector === ':root:not([data-theme="light"])') return node.root && node.theme !== "light";
  return false;
}

function selectorSpecificity(selector: string): number {
  if (selector === ':root:not([data-theme="light"])') return 2;
  if (selector === ":root" || selector.startsWith("[data-theme=")) return 1;
  return 0;
}

/** Later rule wins at equal specificity. Models the kit sheet followed by `exportThemeCss`. */
function winningColor(css: string, node: { root: boolean; theme: string | null }): string | null {
  let value: string | null = null;
  let best = -1;
  let order = 0;
  for (const block of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decl = /--color-primary\s*:\s*([^;]+);/.exec(block[2] ?? "");
    const selectors = (block[1] ?? "").split(",").map((part) => part.trim()).filter(Boolean);
    for (const selector of selectors) {
      if (!decl || !selectorMatches(selector, node)) continue;
      const rank = selectorSpecificity(selector) * 1000 + order;
      if (rank >= best) {
        best = rank;
        value = decl[1]?.trim() ?? null;
      }
    }
    order += 1;
  }
  return value;
}
