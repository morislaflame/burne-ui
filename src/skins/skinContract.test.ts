import { describe, expect, it } from "vitest";

import { isForbiddenSkinToken, SKIN_SLOTS, type SkinDefinition } from "./skinTypes";

describe("skin contract", () => {
  it("lists className slots as component.slot", () => {
    expect(SKIN_SLOTS).toContain("button.root");
    expect(SKIN_SLOTS).toContain("button.icon");
    expect(SKIN_SLOTS).toContain("card.root");
    expect(SKIN_SLOTS).toContain("fieldSet.stack");
    expect(new Set(SKIN_SLOTS).size).toBe(SKIN_SLOTS.length);
  });

  it("rejects focus-ring tokens and keeps the rest", () => {
    expect(isForbiddenSkinToken("--color-focus-ring")).toBe(true);
    expect(isForbiddenSkinToken("--color-focus-ring-danger")).toBe(true);
    expect(isForbiddenSkinToken("--focus-ring-width")).toBe(true);
    expect(isForbiddenSkinToken("--focus-ring-offset")).toBe(true);
    expect(isForbiddenSkinToken("--color-primary")).toBe(false);
    expect(isForbiddenSkinToken("--shadow-large")).toBe(false);
  });

  it("accepts a tier-1 definition", () => {
    const skin = {
      name: "neobrutalism",
      baseVariant: "outline",
      tokens: { "--radius": "0px", "--shadow-large": "4px 4px 0 0 var(--color-foreground)" },
      targets: { "button.root": "border-2" },
    } satisfies SkinDefinition;
    expect(skin.name).toBe("neobrutalism");
  });
});
