import { describe, expect, it } from "vitest";

import { formFieldClass } from "@/components/composite/Form/formStyles";
import { closeButtonRootClass } from "@/components/core/CloseButton/closeButtonStyles";
import { searchInputRootClass } from "@/components/core/SearchInput/searchInputStyles";
import { tooltipIndicatorClass } from "@/components/core/Tooltip/tooltipStyles";
import { cn } from "@/utils/cn";

const GRID = {
  hasIndicator: true,
  hasTitle: true,
  hasDescription: false,
  hasAction: false,
  hasClose: false,
} as const;

describe("R1.4 cn order: kit → slot → className", () => {
  it("keeps default width merge after extending w-control-*", () => {
    expect(cn("w-4", "w-8")).toBe("w-8");
  });

  it("CloseButton: className wins over classNames.root", () => {
    const className = closeButtonRootClass({
      variant: "default",
      size: "base",
      disabled: false,
      slotRoot: "p-1",
      className: "p-2",
    });
    expect(className).toContain("p-2");
    expect(className).not.toContain("p-1");
  });

  it("Form.Field: className wins over classNames.field", () => {
    const className = formFieldClass("bg-primary/10", { field: "bg-background/40" });
    expect(className).toContain("bg-primary/10");
    expect(className).not.toContain("bg-background/40");
  });

  it("SearchInput: collapsed width is overridable via classNames.root", () => {
    const className = searchInputRootClass({
      size: "base",
      variant: "default",
      expanded: false,
      blocked: false,
      slotRoot: "w-control-large",
    });
    expect(className).toContain("w-control-large");
    expect(className).not.toContain("w-control-base");
  });

  it("SearchInput: className wins over classNames.root for collapsed width", () => {
    const className = searchInputRootClass({
      size: "base",
      variant: "default",
      expanded: false,
      blocked: false,
      slotRoot: "w-control-large",
      className: "w-control-mid",
    });
    expect(className).toContain("w-control-mid");
    expect(className).not.toContain("w-control-large");
    expect(className).not.toContain("w-control-base");
  });

  it("Tooltip.Indicator: className wins over kit icon-slot size", () => {
    const className = tooltipIndicatorClass(
      "default",
      "base",
      GRID,
      "icon-slot-small",
      "icon-slot-large",
    );
    expect(className).toContain("icon-slot-large");
    expect(className).not.toContain("icon-slot-base");
    expect(className).not.toContain("icon-slot-small");
  });
});
