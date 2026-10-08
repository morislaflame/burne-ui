import { describe, expect, it } from "vitest";

import { shouldHandleContainedEscape } from "./containedEscape";

function mockDialog({
  open = true,
  containsTarget = true,
  topModal = null as Element | null,
} = {}) {
  const inside = {} as Node;
  return {
    dialog: {
      open,
      contains: (node: Node) => containsTarget && node === inside,
      ownerDocument: {
        querySelector: (sel: string) =>
          sel === "dialog:modal" ? topModal : null,
      },
    } as unknown as HTMLDialogElement,
    inside,
  };
}

describe("shouldHandleContainedEscape", () => {
  it("handles Escape when focus is inside this contained dialog", () => {
    const { dialog, inside } = mockDialog();
    expect(
      shouldHandleContainedEscape(
        { key: "Escape", defaultPrevented: false, target: inside },
        dialog)).toBe(true);
  });

  it("ignores Escape aimed at another overlay (e.g. a showModal dialog)", () => {
    const { dialog } = mockDialog({ containsTarget: false });
    const outside = {} as Node;
    expect(
      shouldHandleContainedEscape(
        { key: "Escape", defaultPrevented: false, target: outside },
        dialog)).toBe(false);
  });

  it("does not steal Escape from a top-layer modal dialog", () => {
    const topModal = { id: "modal" } as unknown as HTMLDialogElement;
    const { dialog, inside } = mockDialog({ topModal });
    expect(
      shouldHandleContainedEscape(
        { key: "Escape", defaultPrevented: false, target: inside },
        dialog)).toBe(false);
  });

  it("respects defaultPrevented (Select / Dropdown inside the panel)", () => {
    const { dialog, inside } = mockDialog();
    expect(
      shouldHandleContainedEscape(
        { key: "Escape", defaultPrevented: true, target: inside },
        dialog)).toBe(false);
  });
});
