import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parseDesignDocument, validateDesign } from "../dist/studio/designDocument.js";
import { parseSkinDocument } from "../dist/skins/skinDocument.js";
import { addSkin } from "./skin-add.mjs";
import { buildSkin } from "./skin-build.mjs";
import { checkFocusRingContrast, contrastRatio, parseCssColor } from "./skin-color.mjs";
import {
  cssCustomProperties,
  KIT_SHADOW_LAYER_COUNT,
  loadSkinPackage,
  registerSkinSlots,
  readSkinLiveSlots,
  readSkinSlots,
  resetRegisteredSkinSlots,
  shadowLayerCount,
  validateSkin,
} from "./skin-validate.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const referencePackages = ["burne-ui-skin-gloss", "burne-ui-skin-neobrutalism", "burne-ui-skin-cybercore"];
const hasReferenceSkins = referencePackages.every((name) => existsSync(join(repoRoot, name, "src")));
const neoTokensFile = join(repoRoot, "burne-ui-skin-neobrutalism/src/tokens.mjs");
const hasNeoTokens = existsSync(neoTokensFile);
const hasCyberCss = existsSync(join(repoRoot, "burne-ui-skin-cybercore/src/skin.css"));
const neoTokens = hasNeoTokens ? await import(pathToFileURL(neoTokensFile).href) : null;

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
  it("measures oklch", () => {
    const white = parseCssColor("oklch(1 0 0)");
    const black = parseCssColor("oklch(0 0 0)");
    assert.ok(white);
    assert.ok(black);
    assert.ok(contrastRatio(black, white) > 20);
    const onePercent = parseCssColor("oklch(1% 0 0)");
    assert.ok(onePercent);
    assert.ok(onePercent[0] < 20);
    const opaqueHex = parseCssColor("#ffffffFF");
    assert.deepEqual(opaqueHex, [255, 255, 255]);
    assert.equal(parseCssColor("#ffffff80"), null);
    const hsl = parseCssColor("hsl(0 0% 100%)");
    assert.deepEqual(hsl, [255, 255, 255]);
    const oklab = parseCssColor("oklab(1 0 0)");
    assert.ok(oklab && oklab[0] > 250);
    const srgb = parseCssColor("color(srgb 1 1 1)");
    assert.deepEqual(srgb, [255, 255, 255]);
    assert.equal(parseCssColor("color(srgb 1 1 1 / 0.5)"), null);
    const errors = validateSkin({
      definition: skin({
        tokens: {
          "--color-surface": "oklch(1 0 0)",
          "--color-foreground": "oklch(0.2 0 0)",
        },
      }),
      slots,
    });
    assert.deepEqual(errors, []);
  });

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

  it("requires a custom property that is not a kit token or a skin prefix", () => {
    const errors = validateSkin({
      definition: skin(),
      css: "[data-skin=paper] { --brand-ink: red; }",
      slots,
    });
    assert.ok(errors.some((error) => error.includes("--brand-ink")));
    const owned = validateSkin({
      definition: skin(),
      css: "[data-skin=paper] { --paper-tilt: 2deg; --border-width: 0px; --_ink: red; }",
      slots,
    });
    assert.deepEqual(owned, []);
  });

  it("accepts a focus ring at 3:1 and rejects a pale one and width", () => {
    const ok = validateSkin({
      definition: skin({
        tokens: {
          "--color-surface": "#ffffff",
          "--color-background": "#ffffff",
          "--color-foreground": "#111111",
          "--color-focus-ring": "#000000",
        },
      }),
      slots,
    });
    assert.deepEqual(ok, []);
    const errors = validateSkin({
      definition: skin({
        tokens: {
          "--color-surface": "#ffffff",
          "--color-background": "#ffffff",
          "--color-foreground": "#111111",
          "--color-focus-ring": "#ffff00",
          "--focus-ring-width": "0px",
        },
      }),
      css: "@media (forced-colors: active) { [data-skin=paper] { --color-foreground: CanvasText; } }",
      slots,
    });
    assert.ok(errors.some((error) => error.includes("--color-focus-ring") && error.includes("3:1")));
    assert.ok(errors.some((error) => error.includes("forbidden token --focus-ring-width")));
    assert.equal(errors.some((error) => error.includes("forced-colors")), false);
  });

  it("allows forced-colors that leave the focus ring alone", () => {
    const ok = validateSkin({
      definition: skin(),
      css: "@media (forced-colors: active) { .paper { forced-color-adjust: none; } }",
      slots,
    });
    assert.deepEqual(ok, []);
    const ring = validateSkin({
      definition: skin(),
      css: "@media (forced-colors: active) { [data-skin=paper] { --color-focus-ring: Highlight; } }",
      slots,
    });
    assert.ok(ring.some((error) => error.includes("focus ring")));
  });

  it("rejects an unknown slot and accepts a one-layer shadow", () => {
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
    assert.equal(errors.some((error) => error.includes("--shadow-base")), false);
  });

  it("accepts two shadow layers and a known slot", () => {
    const errors = validateSkin({
      definition: skin({
        targets: { "button.root": "paper" },
        motion: { "button.root": { hoverIn: "paper:hover" } },
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
    const pkg = JSON.parse(readFileSync(join(created, "package.json"), "utf8"));
    assert.equal(pkg.license, "MIT");
    assert.equal(pkg.exports["./skin.json"], "./dist/skin.json");
    assert.equal(existsSync(join(created, "LICENSE")), true);
    const loaded = loadSkinPackage(created);
    assert.deepEqual(validateSkin({ ...loaded, slots: readSkinSlots() }), []);
  });

  it("refuses to overwrite", () => {
    assert.throws(() => addSkin("soft-paper", created), /already exists/);
  });
});

describe("reference focus rings", () => {
  const cyberDark = {
    "--color-background": "#070b12",
    "--color-surface": "#070b12",
    "--color-foreground": "#d7fbff",
  };
  const cyberLight = {
    "--color-background": "#e7f6fb",
    "--color-surface": "#f4fcff",
    "--color-foreground": "#07141c",
  };
  const kitDark = {
    "--color-background": "#0c0d10",
    "--color-surface": "#171717",
    "--color-foreground": "#f4f5f7",
  };
  const kitLight = {
    "--color-background": "#f5f5f5",
    "--color-surface": "#ffffff",
    "--color-foreground": "#18181b",
  };

  it("keeps every reference palette at 3:1 when the ring is foreground", () => {
    const primaryOnPaper = contrastRatio(parseCssColor("#ffe14a"), parseCssColor("#fffdf5"));
    assert.ok(primaryOnPaper < 3);
    const rows = [
      ["cyber-dark", cyberDark],
      ["cyber-light", cyberLight],
      ["gloss-dark", kitDark],
      ["gloss-light", kitLight],
    ];
    if (neoTokens) {
      rows.unshift(
        ["neo-light", neoTokens.NEOBRUTALISM_TOKENS],
        ["neo-dark", { ...neoTokens.NEOBRUTALISM_TOKENS, ...neoTokens.NEOBRUTALISM_TOKENS_DARK }],
      );
    }
    for (const [label, map] of rows) {
      assert.deepEqual(checkFocusRingContrast(label, map), [], label);
    }
  });

  it("cuts cybercore corners on the inner layer", { skip: hasCyberCss ? false : "burne-ui-skin-cybercore is not in this checkout" }, () => {
    const cyber = readFileSync(new URL("../../burne-ui-skin-cybercore/src/skin.css", import.meta.url), "utf8");
    const host = cyber.slice(cyber.indexOf(".cybercore-surface {"), cyber.indexOf(".cybercore-surface::before"));
    assert.equal(host.includes("clip-path"), false);
    assert.match(cyber, /\.cybercore-surface::before[\s\S]*clip-path:\s*polygon/);
    assert.match(cyber, /@layer ui-kit/);
  });

  it("borders skinned nodes in forced-colors", () => {
    const kit = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    const forced = kit.slice(kit.indexOf("@media (forced-colors: active)"));
    assert.match(forced, /\[data-skin\][\s\S]*border-color:\s*ButtonText/);
    assert.match(forced, /border-width:\s*max\(1px, var\(--border-width, 1px\)\)/);
  });
});

describe("published slot list", () => {
  it("includes button.root", () => {
    assert.ok(readSkinSlots().includes("button.root"));
    assert.ok(readSkinLiveSlots().targets.includes("button.root"));
  });

  it("rejects a dead classNames slot", () => {
    const errors = validateSkin({
      definition: skin({ targets: { "button.icon": "x" } }),
      slots: readSkinSlots(),
      live: readSkinLiveSlots(),
    });
    assert.ok(errors.some((error) => error.includes("button.icon is dead")));
  });
});

describe("reference skins and tier 3", () => {
  const live = readSkinLiveSlots();
  const catalog = readSkinSlots();

  it("validates gloss, neobrutalism, and cybercore", {
    skip: hasReferenceSkins && neoTokens ? false : "reference skin packages are not in this checkout",
  }, () => {
    const neo = JSON.parse(readFileSync(join(repoRoot, "burne-ui-skin-neobrutalism/src/skin.json"), "utf8"));
    assert.deepEqual(neo.tokens, neoTokens.NEOBRUTALISM_TOKENS);
    assert.deepEqual(neo.tokensDark, neoTokens.NEOBRUTALISM_TOKENS_DARK);
    for (const name of referencePackages) {
      const loaded = loadSkinPackage(join(repoRoot, name));
      assert.deepEqual(validateSkin({ ...loaded, slots: catalog, live }), [], name);
    }
  });

  it("scaffolds a tier 3 package that validates and passes the slot smoke test", () => {
    const root = mkdtempSync(join(tmpdir(), "burne-skin-tier3-"));
    const created = join(root, "burne-ui-skin-aurora");
    try {
      addSkin("aurora", created, 3);
      const pkg = JSON.parse(readFileSync(join(created, "package.json"), "utf8"));
      assert.equal(pkg.license, "MIT");
      assert.equal(pkg.exports["./skin.json"], "./dist/skin.json");
      assert.equal(existsSync(join(created, "LICENSE")), true);
      const loaded = loadSkinPackage(created);
      assert.deepEqual(validateSkin({ ...loaded, slots: catalog, live }), []);
      const smoke = spawnSync(process.execPath, ["--test", "test/smoke.mjs"], {
        cwd: created,
        env: { ...process.env, BURNE_UI_LIVE_SLOTS: join(dirname(fileURLToPath(import.meta.url)), "skin-live-slots.json") },
        encoding: "utf8",
      });
      assert.equal(smoke.status, 0, smoke.stderr || smoke.stdout);
      const built = buildSkin(created);
      assert.equal(existsSync(built), true);
      const css = readFileSync(built, "utf8");
      assert.match(css, /\[data-skin="aurora"\]/);
      assert.match(css, /--aurora-tilt/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("open skin slots", () => {
  after(() => {
    resetRegisteredSkinSlots();
  });

  it("accepts a slot after registerSkinSlots and rejects a typo", () => {
    resetRegisteredSkinSlots();
    registerSkinSlots(["pricing.root"]);
    const ok = validateSkin({
      definition: skin({ targets: { "pricing.root": "price" } }),
      slots: readSkinSlots(),
      live: readSkinLiveSlots(),
    });
    assert.deepEqual(ok, []);
    const typo = validateSkin({
      definition: skin({ targets: { "pricing.rot": "price" } }),
      slots: readSkinSlots(),
      live: readSkinLiveSlots(),
    });
    assert.ok(typo.some((error) => error.includes("pricing.rot")));
    assert.equal(typo.some((error) => error.includes("pricing.root")), false);
  });
});

describe("same documents through the parser and skin validate", () => {
  function designSkinErrors(definition) {
    const design = parseDesignDocument({ version: 1, name: "paper", theme: {}, skin: definition });
    if (!design.ok) {
      return design.errors.filter((error) => error.startsWith("skin: ")).map((error) => error.slice("skin: ".length));
    }
    return validateDesign(design.design).errors
      .filter((error) => error.startsWith("skin: "))
      .map((error) => error.slice("skin: ".length));
  }

  const documents = [
    skin(),
    skin({ name: "Soft Paper" }),
    skin({ extends: "Paper" }),
    skin({ fonts: [{ src: "url(./a.woff2)" }] }),
    skin({ motion: { config: ["fast"] } }),
    skin({
      tokens: {
        "--color-surface": "#ffffff",
        "--color-background": "#ffffff",
        "--color-foreground": "#111111",
        "--color-focus-ring": "color-mix(in oklab, #111111 60%, transparent)",
      },
    }),
    skin({
      rules: { "button.root": { style: { "--ink": "#111111" } } },
      properties: {
        "--tilt": { syntax: "<angle>", inherits: false, initialValue: "0deg" },
      },
    }),
  ];

  it("reports the parser errors from validateSkin and from validateDesign", () => {
    for (const definition of documents) {
      const parsed = parseSkinDocument(definition);
      const parserErrors = parsed.ok ? [] : parsed.errors;
      assert.deepEqual(validateSkin({ definition, slots }), parserErrors, definition.name);
      assert.deepEqual(designSkinErrors(definition), parserErrors, definition.name);
    }
  });

  it("accepts a custom property declared on a rule or a property", () => {
    const definition = skin({
      rules: { "button.root": { style: { "--ink": "#111111" } } },
      properties: {
        "--tilt": { syntax: "<angle>", inherits: false, initialValue: "0deg" },
      },
    });
    const errors = validateSkin({
      definition,
      css: ".skin-paper-button-root { --ink: #111111; --tilt: 2deg; }",
      slots,
    });
    assert.deepEqual(errors, []);
  });
});
