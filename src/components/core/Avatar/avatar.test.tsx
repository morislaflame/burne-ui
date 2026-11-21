import { describe, expect, it } from "vitest";

import { render } from "@/__tests__/helpers";

import { Avatar } from ".";

describe("Avatar Phase 2E fixes", () => {
  it("detects cached complete images on mount and resets cleanly when src clears", () => {
    const completeSpy = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "complete");
    const widthSpy = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "naturalWidth");
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      configurable: true,
      get: () => 64,
    });

    const { container, rerender } = render(
      <Avatar label="Ada Lovelace" src="/cached-avatar.png" alt={undefined} />,
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img.className).not.toContain("opacity-0");

    rerender(<Avatar label="Ada Lovelace" src={undefined} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("A");

    if (completeSpy) Object.defineProperty(HTMLImageElement.prototype, "complete", completeSpy);
    if (widthSpy) Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", widthSpy);
  });
});
