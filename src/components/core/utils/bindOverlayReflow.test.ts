import { afterEach, describe, expect, it, vi } from "vitest";

import { bindOverlayReflow } from "./bindOverlayReflow";

afterEach(() => {
  vi.unstubAllGlobals();
});

function installWindow({
  visualViewport,
}: {
  visualViewport?: {
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  } | null;
} = {}) {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();
  vi.stubGlobal("window", {
    addEventListener,
    removeEventListener,
    visualViewport: visualViewport === undefined ? undefined : visualViewport,
  });
  return { addEventListener, removeEventListener };
}

function optionsFor(
  addEventListener: ReturnType<typeof vi.fn>,
  type: string) {
  return addEventListener.mock.calls.find((call) => call[0] === type)?.[2];
}

describe("bindOverlayReflow", () => {
  it("is a no-op without window (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(bindOverlayReflow(() => {})).toEqual(expect.any(Function));
  });

  it("binds capture+passive window scroll and passive resize", () => {
    const { addEventListener, removeEventListener } = installWindow({
      visualViewport: null,
    });
    const onReflow = vi.fn();
    const unbind = bindOverlayReflow(onReflow);

    expect(optionsFor(addEventListener, "scroll")).toMatchObject({
      capture: true,
      passive: true,
    });
    expect(optionsFor(addEventListener, "resize")).toMatchObject({
      passive: true,
    });

    unbind();
    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      onReflow,
      expect.objectContaining({ capture: true, passive: true }));
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      onReflow,
      expect.objectContaining({ passive: true }));
  });

  it("also listens to visualViewport resize and scroll when present", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const { addEventListener: addWindow } = installWindow({
      visualViewport: { addEventListener, removeEventListener },
    });
    const onReflow = vi.fn();
    const unbind = bindOverlayReflow(onReflow);

    expect(addWindow).toHaveBeenCalledTimes(2);
    expect(optionsFor(addEventListener, "resize")).toMatchObject({
      passive: true,
    });
    expect(optionsFor(addEventListener, "scroll")).toMatchObject({
      passive: true,
    });

    unbind();
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });
});
