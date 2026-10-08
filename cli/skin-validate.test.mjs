import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";

import { addSkin } from "./skin-add.mjs";
import {
  contrastRatio,
  cssCustomProperties,
  KIT_SHADOW_LAYER_COUNT,
  loadSkinPackage,
  parseCssColor,
  readSkinSlots,
  shadowLayerCount,
  validateSkin,
} from "./skin-validate.mjs";

const slots = new Set(["button.root", "card.root"]);

function skin(overrides = {}) {
  return {
    name: "paper",
    tokens: {
      "--color-surface": "#ffffff",
      "--color-foreground": "#111111",
    },
    ...overrides,
  };
}

describe("shadow layers", () => {
  it("counts commas outside parentheses", () => {
    assert.equal(shadowLayerCount("1px 1px 0 0 #111"), 1);
    assert.equal(shadowLayerCount("1px 1px 0 0 #111, 2px 2px 0 0 #111"), KIT_SHADOW_LAYER_COUNT);
    assert.equal(
      shadowLayerCount(
        "0 2px 2px color-mix(in oklab, var(--color-shadow) 15%, transparent), 0 3px 4px color-mix(in oklab, black 6%, transparent)",
      ),
      2,
    );
  });
});

describe("contrast", () => {
  it("measures black on white above AA", () => {
    const ratio = contrastRatio(parseCssColor("#111111"), parseCssColor("#ffffff"));
    assert.ok(ratio >= 4.5);
  });

  it("rejects a pair below AA", () => {
    const errors = validateSkin({
      definition: skin({
        tokens: { "--color-surface": "#ffffff", "--color-foreground": "#ffff00" },
      }),
      slots,
    });
    assert.ok(errors.some((error) => error.includes("WCAG AA")));
  });

  it("asks for both colors when only one is set", () => {
    const errors = validateSkin({
      definition: skin({ tokens: { "--color-foreground": "#111111" } }),
      slots,
    });
    assert.ok(errors.some((error) => error.includes("both")));
  });
});

describe("validateSkin", () => {
  it("accepts a tier-1 skin", () => {
    assert.deepEqual(validateSkin({ definition: skin(), slots }), []);
  });

  it("requires CSS custom properties to be declared", () => {
    const errors = validateSkin({
      definition: skin(),
      css: "[data-skin=paper] { --radius: 0px; }",
      slots,
    });
    assert.ok(errors.some((error) => error.includes("--radius")));
  });

  it("rejects focus-ring tokens and forced-colors", () => {
    const errors = validateSkin({
      definition: skin({
        tokens: {
          "--color-surface": "#ffffff",
          "--color-foreground": "#111111",
          "--color-focus-ring": "#000000",
        },
      }),
      css: "@media (forced-colors: active) { [data-skin=paper] { --color-foreground: CanvasText; } }",
      slots,
    });
    assert.ok(errors.some((error) => error.includes("--color-focus-ring")));
    assert.ok(errors.some((error) => error.includes("forced-colors")));
  });

  it("rejects an unknown slot and a one-layer shadow", () => {
    const errors = validateSkin({
      definition: skin({
        targets: { "button.missing": "x" },
        tokens: {
          "--color-surface": "#ffffff",
          "--color-foreground": "#111111",
          "--shadow-base": "4px 4px 0 0 #111111",
        },
      }),
      slots,
    });
    assert.ok(errors.some((error) => error.includes("button.missing")));
    assert.ok(errors.some((error) => error.includes("--shadow-base")));
  });

  it("accepts two shadow layers and a known slot", () => {
    const errors = validateSkin({
      definition: skin({
        targets: { "button.root": "paper" },
        motion: { "button.root": { hoverIn: "paperIn" } },
        tokens: {
          "--color-surface": "#ffffff",
          "--color-foreground": "#111111",
          "--shadow-base": "4px 4px 0 0 #111111, 4px 4px 0 0 #111111",
        },
      }),
      slots,
    });
    assert.deepEqual(errors, []);
  });

  it("requires layers to forward ref", () => {
    const missing = validateSkin({
      definition: skin(),
      layersSource: "export function Panel() { return <div className=\"paper\" />; }",
      slots,
    });
    assert.ok(missing.some((error) => error.includes("ref")));
    const ok = validateSkin({
      definition: skin(),
      layersSource: "export function Panel(props) { return <div {...props} />; }",
      slots,
    });
    assert.deepEqual(ok, []);
  });
});

describe("cssCustomProperties", () => {
  it("ignores var() references and comments", () => {
    assert.deepEqual(
      cssCustomProperties("/* --nope: 1; */ a { color: var(--color-foreground); --radius: 0px; }"),
      ["--radius"],
    );
  });
});

describe("skin add", () => {
  const root = mkdtempSync(join(tmpdir(), "burne-skin-"));
  const created = join(root, "burne-ui-skin-soft-paper");

  after(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("scaffolds a package that validates", () => {
    addSkin("soft-paper", created);
    const index = readFileSync(join(created, "src/index.ts"), "utf8");
    assert.match(index, /export const softPaper/);
    const loaded = loadSkinPackage(created);
    assert.deepEqual(validateSkin({ ...loaded, slots: readSkinSlots() }), []);
  });

  it("refuses to overwrite", () => {
    assert.throws(() => addSkin("soft-paper", created), /already exists/);
  });
});

describe("published slot list", () => {
  it("includes button.root", () => {
    assert.ok(readSkinSlots().includes("button.root"));
  });
});
