import { describe, expect, it, vi } from "vitest";

import { render } from "@/__tests__/helpers";

import { Kbd } from ".";

describe("Kbd Phase 2E fixes", () => {
  it("cascades Kbd.Group classNames to child Kbd and runs root enter slot motion", () => {
    const enterSpy = vi.fn();
    const { container } = render(
      <Kbd.Group classNames={{ root: "grp-key", text: "grp-txt", separator: "grp-sep" }}>
        <Kbd motion={{ root: { enter: enterSpy } }}>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>,
    );

    const keys = container.querySelectorAll("kbd");
    expect(keys[0]?.className).toContain("grp-key");
    expect(keys[0]?.querySelector("span")?.className).toContain("grp-txt");
    expect(enterSpy).toHaveBeenCalledTimes(1);
  });
});
