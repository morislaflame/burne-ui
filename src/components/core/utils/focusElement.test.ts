import { describe, expect, it, vi } from "vitest";

import { focusOnOpen, focusPanelOnOpen } from "./focusElement";

function mockEl(matchesFocusVisible = false): HTMLElement {
  return {
    focus: vi.fn(),
    matches: (sel: string) => sel === ":focus-visible" && matchesFocusVisible,
    hasAttribute: (name: string) => name === "tabindex",
    querySelectorAll: () => [] as unknown as NodeListOf<HTMLElement>,
  } as unknown as HTMLElement;
}

describe("focusOnOpen", () => {
  it("forces focusVisible when the opener is :focus-visible", () => {
    const target = mockEl();
    const from = mockEl(true);
    focusOnOpen(target, { from });
    expect(target.focus).toHaveBeenCalledWith({
      preventScroll: true,
      focusVisible: true,
    });
  });

  it("forces focusVisible off when the opener was pointer-focused", () => {
    const target = mockEl();
    const from = mockEl(false);
    focusOnOpen(target, { from });
    expect(target.focus).toHaveBeenCalledWith({
      preventScroll: true,
      focusVisible: false,
    });
  });

  it("lets an explicit focusVisible win over from", () => {
    const target = mockEl();
    const from = mockEl(false);
    focusOnOpen(target, { from, focusVisible: true });
    expect(target.focus).toHaveBeenCalledWith({
      preventScroll: true,
      focusVisible: true,
    });
  });
});

describe("focusPanelOnOpen", () => {
  it("forwards keyboard intent onto the panel when nothing inside is Tab-reachable", () => {
    const panel = mockEl();
    const from = mockEl(true);
    focusPanelOnOpen(panel, { from });
    expect(panel.focus).toHaveBeenCalledWith({
      preventScroll: true,
      focusVisible: true,
    });
  });
});
