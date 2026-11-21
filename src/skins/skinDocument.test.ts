import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  parseSkinDocument,
  renderSkinPackage,
  renderSkinStylesheet,
  type SkinDocument,
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

  it("accepts a color-mix focus ring", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: {
        "--color-surface": "#ffffff",
        "--color-background": "#ffffff",
        "--color-foreground": "#111111",
        "--color-focus-ring": "color-mix(in oklab, #111111 60%, transparent)",
      },
    });
    expect(parsed.ok).toBe(true);
  });

  it("rejects a pale focus ring, ring geometry, and an unknown slot", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: {
        "--color-surface": "#ffffff",
        "--color-background": "#ffffff",
        "--color-foreground": "#111111",
        "--color-focus-ring": "#ffff00",
        "--focus-ring-width": "0px",
        "--shadow-base": "4px 4px 0 0 #111",
      },
      targets: { "button.missing": "x" },
      layers: {},
    });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((error) => error.includes("--color-focus-ring") && error.includes("3:1"))).toBe(
      true,
    );
    expect(parsed.errors.some((error) => error.includes("forbidden token --focus-ring-width"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("button.missing"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("--shadow-base"))).toBe(false);
    expect(parsed.errors.some((error) => error.includes("unknown field layers"))).toBe(true);
  });

  it("rejects a classNames key that no component reads", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: { "--color-surface": "#ffffff", "--color-foreground": "#111111" },
      targets: { "button.icon": "x" },
      motion: { "tooltip.message": { enter: "portalSurfaceEnter" } },
    });
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.errors.some((error) => error.includes("targets slot button.icon is dead"))).toBe(true);
    expect(parsed.errors.some((error) => error.includes("motion slot tooltip.message is dead"))).toBe(true);
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

  it("measures oklch contrast", () => {
    const parsed = parseSkinDocument({
      name: "paper",
      tokens: {
        "--color-surface": "oklch(1 0 0)",
        "--color-foreground": "oklch(0.2 0 0)",
        "--color-primary": "oklch(0.6 0.2 250)",
        "--color-primary-foreground": "oklch(0.15 0 0)",
      },
    });
    expect(parsed.ok).toBe(true);
  });

  it("keeps schema properties aligned with the parser", () => {
    expect(SKIN_DOCUMENT_SCHEMA.required).toEqual(["name"]);
    expect(SKIN_DOCUMENT_SCHEMA.properties).toHaveProperty("layersDeclarative");
    expect(SKIN_DOCUMENT_SCHEMA.properties).toHaveProperty("rules");
    expect(SKIN_DOCUMENT_SCHEMA.properties).toHaveProperty("extends");
    expect(SKIN_DOCUMENT_SCHEMA.properties.layersDeclarative.properties).toHaveProperty("card.root");
    expect(SKIN_DOCUMENT_SCHEMA.properties).not.toHaveProperty("layers");
  });

  it("accepts motion vars and rejects a name that is not kebab-case", () => {
    const parsed = parseSkinDocument({
      name: "soft-paper",
      extends: "paper",
      motion: {
        "button.root": { hoverIn: { y: -4, recipe: "hoverLiftFirstLevel" } },
        config: { pressSqueezeScale: [1, 0.96, 1], interactiveDuration: 180 },
      },
      rules: { "button.root": { hover: { "clip-path": "inset(0)" } } },
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.skin.motion?.config?.pressSqueezeScale).toEqual([1, 0.96, 1]);
    expect(parseSkinDocument({ name: "Soft Paper" }).ok).toBe(false);
  });
});

describe("renderSkinPackage", () => {
  it("writes css for every token and a camelCase export", () => {
    const css = renderSkinStylesheet(SKIN_EDITOR_EXAMPLE);
    expect(css).toContain('[data-skin="paper"]');
    expect(css).toContain("--color-foreground: #111111;");
    expect(css).not.toContain("initial");
    expect(skinExportName("soft-paper")).toBe("softPaper");
    const rendered = renderSkinPackage(SKIN_EDITOR_EXAMPLE);
    expect(rendered["src/index.ts"]).toContain("export const paper");
    expect(rendered["package.json"]).toContain('"license": "MIT"');
    expect(rendered["package.json"]).toContain('"burne-ui": "^2.0.0"');
    expect(rendered["package.json"]).toContain('"./dist/index.js"');
    expect(rendered["package.json"]).toContain('"default": "./dist/index.js"');
    expect(rendered["package.json"]).toContain('"./styles.css": "./dist/styles.css"');
    expect(rendered["package.json"]).toContain('"./skin.json": "./dist/skin.json"');
    expect(rendered["package.json"]).toContain('"files"');
    expect(rendered["package.json"]).toContain('"scripts"');
    expect(rendered.LICENSE).toContain("MIT License");
    expect(rendered.LICENSE).toContain("<author>");
    expect(rendered.LICENSE).not.toContain("morislaflame");
    expect(rendered["package.json"]).toContain('"typescript": "^5.8.3"');
    expect(rendered["package.json"]).toContain("tsc -p tsconfig.build.json && cp src/skin.css dist/styles.css && cp src/skin.json dist/skin.json");
    expect(rendered["tsconfig.json"]).toContain('"resolveJsonModule": true');
    expect(rendered["tsconfig.json"]).not.toContain("react-jsx");
    expect(rendered["tsconfig.json"]).toContain('"strict": true');
    expect(rendered["README.md"]).toContain("burne-ui-skin-paper");
    expect(rendered["src/index.ts"]).toContain('from "burne-ui/skin"');
    expect(rendered["src/index.ts"]).toContain("export const paper = defineSkin(skinJson as SkinDefinition)");
  });

  it("paints dark tokens on the skin and light tokens under data-theme=light", () => {
    const css = renderSkinStylesheet({
      name: "dual",
      tokens: { "--color-primary": "red", "--radius": "0px" },
      tokensDark: { "--color-primary": "maroon", "--shadow-base": "0 0 0 1px black" },
      tokensLight: { "--color-primary": "pink" },
    });
    expect(css).toContain('[data-skin="dual"]');
    expect(css).toContain("--color-primary: maroon;");
    expect(css).toContain("--shadow-base: 0 0 0 1px black;");
    expect(css).toContain('[data-theme="light"] [data-skin="dual"]');
    expect(css).toContain('[data-theme="light"][data-skin="dual"]');
    expect(css).toContain("--color-primary: pink;");
    expect(css).toContain("--shadow-base: unset;");
    expect(css).toContain('[data-theme="dark"] [data-skin="dual"]');
    expect(css).toContain('[data-theme="dark"][data-skin="dual"]');
    expect(css.indexOf('[data-theme="dark"]')).toBeGreaterThan(css.indexOf('[data-theme="light"]'));
    expect(css).not.toContain("initial");
  });

  it("paints rules.dark on a page without data-theme and keeps hover after the theme branches", () => {
    const skin: SkinDocument = {
      name: "paper",
      rules: {
        "button.root": {
          style: { color: "black" },
          dark: { color: "white" },
          light: { color: "navy" },
          hover: { color: "red" },
        },
      },
    };
    const css = renderSkinStylesheet(skin);
    const selector = ".skin-paper-button-root";
    expect(css).toContain(`:where(:root:not([data-theme="light"])) ${selector}`);
    expect(css).toContain(`[data-theme="dark"] ${selector}`);
    expect(css).toContain(`[data-theme="light"] ${selector}`);
    const hoverAt = css.indexOf(`${selector}:hover`);
    expect(hoverAt).toBeGreaterThan(css.indexOf(':root:not([data-theme="light"])'));
    expect(hoverAt).toBeGreaterThan(css.indexOf(`[data-theme="light"] ${selector}`));
  });

  it("builds the generated package against a packed kit", () => {
    const root = mkdtempSync(path.join(tmpdir(), "burne-skin-pkg-"));
    const packDir = mkdtempSync(path.join(tmpdir(), "burne-skin-pack-"));
    try {
      const tarball = execFileSync("npm", ["pack", "--pack-destination", packDir, "--silent"], {
        cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
        encoding: "utf8",
      }).trim().split("\n").at(-1);
      const kit = path.join(packDir, tarball ?? "");
      const rendered = renderSkinPackage({
        ...SKIN_EDITOR_EXAMPLE,
        meta: { author: "Ada Lovelace" },
      });
      expect(rendered.LICENSE).toContain("Ada Lovelace");
      for (const [name, body] of Object.entries(rendered)) {
        const file = path.join(root, name);
        mkdirSync(path.dirname(file), { recursive: true });
        writeFileSync(file, body);
      }
      execFileSync("npm", ["install", "--silent", kit], { cwd: root, stdio: "inherit" });
      execFileSync("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
      expect(readFileSync(path.join(root, "dist/index.js"), "utf8")).toContain("defineSkin");
      expect(readFileSync(path.join(root, "dist/styles.css"), "utf8").length).toBeGreaterThan(0);
      expect(readFileSync(path.join(root, "dist/skin.json"), "utf8")).toContain("paper");
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(packDir, { recursive: true, force: true });
    }
  }, 180_000);
});
