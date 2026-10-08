import { afterEach, describe, expect, it, vi } from "vitest";

import { badgeSurfaceClass } from "@/components/core/Badge/badgeStyles";
import { KIT_BUTTON_VARIANTS } from "@/components/core/Button/buttonTypes";
import { buttonVariantRootClass } from "@/components/core/Button/buttonStyles";
import { KIT_CARD_VARIANTS } from "@/components/core/Card/cardTypes";
import { resolveCardMotionDefaults } from "@/components/core/Card/cardAnimations";

import { clearSkinsForTests, registerSkin } from "./skinRegistry";
import {
  overlaySkinMotion,
  resetVariantVisualWarningsForTests,
  resolveVariantVisual,
  variantSlotClass,
} from "./resolveVariantVisual";

afterEach(() => {
  clearSkinsForTests();
  resetVariantVisualWarningsForTests();
  vi.restoreAllMocks();
});

describe("resolveVariantVisual", () => {
  it("keeps a kit variant on the closed map", () => {
    expect(resolveVariantVisual("outline", KIT_BUTTON_VARIANTS, "button.root").key).toBe("outline");
    expect(resolveVariantVisual("outline", KIT_BUTTON_VARIANTS, "button.root").className).toBeUndefined();
  });

  it("errors and falls back to default when the variant has no skin", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const resolved = resolveVariantVisual("cybercore", KIT_BUTTON_VARIANTS, "button.root");
    expect(resolved.key).toBe("default");
    expect(resolved.className).toBeUndefined();
    expect(error).toHaveBeenCalled();
    expect(buttonVariantRootClass("cybercore", "default")).toContain("bg-surface");
  });

  it("keeps gloss badge glass and colors only the text", () => {
    registerSkin({
      name: "gloss",
      baseVariant: "default",
      targets: { "badge.root": "gloss-panel border-0 text-foreground" },
    });
    const surface = badgeSurfaceClass("gloss", "danger");
    expect(surface).toContain("gloss-panel");
    expect(surface).toContain("text-danger");
    expect(surface).not.toContain("text-foreground");
    expect(surface).not.toContain("bg-surface-tint-danger");
  });

  it("uses the skin target, then baseVariant when the slot is missing", () => {
    registerSkin({
      name: "cybercore",
      baseVariant: "outline",
      targets: { "button.root": "cybercore-surface" },
    });
    expect(variantSlotClass("cybercore", KIT_BUTTON_VARIANTS, "button.root", () => "kit")).toBe(
      "cybercore-surface");
    expect(buttonVariantRootClass("cybercore", "default")).toBe("cybercore-surface");
    const card = resolveVariantVisual("cybercore", KIT_CARD_VARIANTS, "card.root");
    expect(card.className).toBeUndefined();
    expect(card.key).toBe("outline");
  });

  it("swaps the hover recipe for a registered skin", () => {
    registerSkin({
      name: "cybercore",
      motion: {
        "button.root": { hoverIn: "cyberGlowIn", hoverOut: "cyberGlowOut" },
        "card.root": { hoverIn: "cyberGlowIn" },
      },
    });
    const button = overlaySkinMotion(
      { root: { hoverIn: "hoverLiftFirstLevel", hoverOut: "hoverLiftFirstLevel" } },
      "cybercore",
      KIT_BUTTON_VARIANTS,
      "button");
    expect(button.root?.hoverIn).toBe("cyberGlowIn");
    expect(button.root?.hoverOut).toBe("cyberGlowOut");
    expect(
      overlaySkinMotion(
        { root: { hoverIn: "hoverLiftFirstLevel" } },
        "outline",
        KIT_BUTTON_VARIANTS,
        "button").root?.hoverIn).toBe("hoverLiftFirstLevel");
    expect(resolveCardMotionDefaults({ variant: "cybercore", pressable: true }).root?.hoverIn).toBe(
      "cyberGlowIn");
  });
});
