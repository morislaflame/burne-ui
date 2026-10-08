import { afterEach, describe, expect, it } from "vitest";

import {
  getSkin,
  hasSkin,
  listSkins,
  registerSkin,
  SkinProvider,
  unregisterSkin,
  useSkin,
  type SkinDefinition,
} from "@/index";
import {
  applySkinVars,
  isForbiddenSkinToken,
  releaseSkinVars,
  resolveSkinTokens,
  SKIN_FORBIDDEN_TOKENS,
  SKIN_SLOTS,
} from "@/internal";
import { clearSkinsForTests } from "@/skins/skinRegistry";

const skin: SkinDefinition = {
  name: "public-api",
  tokens: { "--radius": "0px", "--color-focus-ring": "red" },
};

describe("skin public API", () => {
  afterEach(() => {
    clearSkinsForTests();
  });

  it("registers a skin through the burne-ui barrel", () => {
    registerSkin(skin);
    expect(hasSkin("public-api")).toBe(true);
    expect(listSkins()).toContain("public-api");
    expect(getSkin("public-api")?.tokens?.["--radius"]).toBe("0px");
    expect(unregisterSkin("public-api")).toBe(true);
    expect(hasSkin("public-api")).toBe(false);
  });

  it("exports the provider and the scope hook", () => {
    expect(typeof SkinProvider).toBe("function");
    expect(typeof useSkin).toBe("function");
  });

  it("resolves tokens from burne-ui/internal and drops the focus ring", () => {
    const tokens = resolveSkinTokens(skin);
    expect(tokens["--radius"]).toBe("0px");
    expect(tokens["--color-focus-ring"]).toBeUndefined();
    expect(isForbiddenSkinToken(SKIN_FORBIDDEN_TOKENS[0]!)).toBe(true);
    expect(SKIN_SLOTS).toContain("button.root");

    const el = document.createElement("div");
    applySkinVars(el, tokens, skin.name);
    expect(el.style.getPropertyValue("--radius")).toBe("0px");
    expect(el.dataset.skin).toBe("public-api");
    releaseSkinVars(el);
    expect(el.style.getPropertyValue("--radius")).toBe("");
    expect(el.dataset.skin).toBeUndefined();
  });
});
