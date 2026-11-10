import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { calendarRootClass } from "@/components/core/Calendar/calendarStyles";
import { CARD_PRESSABLE_CONTENT_CLASS, cardRootClass } from "@/components/core/Card/cardStyles";
import { disclosureGroupClass, disclosureRootClass } from "@/components/core/Disclosure/disclosureStyles";
import { expandableRootClass } from "@/components/core/Expandable/expandableStyles";
import { dialogNativeClass } from "@/components/core/Dialog/dialogStyles";
import { COLOR_PICKER_AREA_THUMB_CLASS } from "@/components/core/ColorPicker/colorPickerStyles";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { TEXT_SCALE_BASES } from "@/tokens/textScale";
import { cn } from "@/utils/cn";

import { render } from "./helpers";

function readSrc(relativePath: string) {
  return readFileSync(resolve(relativePath), "utf8");
}

describe("Э3.4 frame", () => {
  it("keeps expandable and disclosure card flat until hover", () => {
    expect(calendarRootClass("default", "base")).not.toContain("shadow-token");
    expect(cardRootClass("default", true, "animate-shadow", "base")).not.toContain("overflow-hidden");
    expect(cardRootClass("default", false, "", "base")).toContain("overflow-hidden");
    expect(CARD_PRESSABLE_CONTENT_CLASS).toContain("overflow-hidden");
    expect(expandableRootClass({ variant: "default" })).not.toContain("shadow-token");
    expect(disclosureRootClass({ variant: "card", groupedCardShell: false })).not.toContain("shadow-token");
    expect(disclosureGroupClass({ separated: false, variant: "card" })).not.toContain("shadow-token");
  });

  it("sizes the color picker thumb from the scale token", () => {
    expect(COLOR_PICKER_AREA_THUMB_CLASS).toContain("size-[length:var(--size-scale-small)]");
    const parts = readSrc("src/components/core/ColorPicker/colorPickerParts.tsx");
    expect(parts).not.toContain('width: "14px"');
    expect(parts).not.toContain('height: "14px"');
  });

  it("drops h-control utilities and keeps focus-ring in the utilities layer", () => {
    const css = readSrc("src/styles.css");
    expect(css).not.toContain("@utility h-" + "control-");
    expect(css).toContain("@utility focus-ring {");
    expect(css).toContain("@layer theme, base, ui-kit, components, utilities;");
    expect(css).toContain("@layer ui-kit {");
    expect(css).toContain(".portal-contained.z-dialog");
    expect(css).toContain("var(--z-overlay-nested-step)");
    const styles = [
      "src/components/core/Button/buttonStyles.ts",
      "src/components/composite/ButtonGroup/buttonGroupStyles.ts",
      "src/components/core/CloseButton/closeButtonStyles.ts",
      "src/components/core/Calendar/calendarStyles.ts",
      "src/components/core/SearchInput/searchInputStyles.ts",
      "src/components/core/Skeleton/skeletonStyles.ts",
    ]
      .map(readSrc)
      .join("\n");
    expect(styles).not.toMatch(/(^|[^\w-])h-control-/);
    expect(styles).toContain("min-h-control-base");
  });

  it("lets a later kit class win in cn()", () => {
    expect(cn("avatar-size-base", "avatar-size-large")).toBe("avatar-size-large");
    expect(cn("border-token", "border-2")).toBe("border-2");
    expect(cn("shadow-token-base", "shadow-none")).toBe("shadow-none");
    expect(cn("z-dialog", "z-tooltip")).toBe("z-tooltip");
    expect(cn("focus-ring", "focus-ring-inset")).toBe("focus-ring-inset");
    expect(cn("min-h-control-base", "min-h-0")).toBe("min-h-0");
  });

  it("adds the nested z step only on a contained dialog host", () => {
    expect(dialogNativeClass(true)).toContain("portal-contained");
    expect(dialogNativeClass(true)).toContain("z-dialog");
    expect(dialogNativeClass(false)).not.toContain("portal-contained");
    expect(dialogNativeClass(false)).toContain("z-dialog");
  });

  it("keeps the type scale on whole pixels", () => {
    expect(TEXT_SCALE_BASES.large).toEqual({ size: 1.125, line: 1.75 });
    for (const step of Object.values(TEXT_SCALE_BASES)) {
      expect(step.size * 16).toBe(Math.round(step.size * 16));
      expect(step.line * 16).toBe(Math.round(step.line * 16));
    }
    const css = readSrc("src/tokens/styles.css");
    expect(css).toContain("--text-scale-large: 1.125rem;");
    expect(css).toContain("calc(1.75rem / 1.125rem)");

    const space = 0.5;
    const border = 1 / 16;
    const heights = {
      xsmall: TEXT_SCALE_BASES.xsmall.line + space * 0.5 * 2 + border * 2,
      small: TEXT_SCALE_BASES.small.line + space * 0.5 * 2 + border * 2,
      base: TEXT_SCALE_BASES.base.line + space * 0.75 * 2 + border * 2,
      mid: TEXT_SCALE_BASES.mid.line + space * 2 + border * 2,
      large: TEXT_SCALE_BASES.mid.line + space * 1.5 * 2 + border * 2,
    };
    expect(heights.xsmall * 16).toBe(24);
    expect(heights.small * 16).toBe(26);
    expect(heights.base * 16).toBe(34);
    expect(heights.mid * 16).toBe(42);
    expect(heights.large * 16).toBe(50);
  });

  it("renders SelectionIndicator and SelectionThumb as spans", () => {
    const { container } = render(
      <>
        <SelectionIndicator selected={false} />
        <SelectionThumb />
      </>);
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThan(0);
    expect(Array.from(spans).some((node) => node.tagName === "SPAN")).toBe(true);
  });
});
