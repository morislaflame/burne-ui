import { afterEach, describe, expect, it, vi } from "vitest";

import { flushDialogOpenLayout } from "@/components/core/utils/modalSurfaceMotion";

import { scheduleNestedEnterBroadcast, invalidateEnterFrame } from "./scheduleNestedEnterBroadcast";

function installRaf() {
  let nextId = 1;
  const pending = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    const id = nextId++;
    pending.set(id, cb);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    pending.delete(id);
  });
  return {
    flush() {
      const cbs = [...pending.values()];
      pending.clear();
      for (const cb of cbs) cb(0);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("scheduleNestedEnterBroadcast", () => {
  it("plays nested enter on the next frame without reading offsetHeight", () => {
    const raf = installRaf();
    const el = {
      get offsetHeight() {
        return 80;
      },
    };
    const offset = vi.spyOn(el, "offsetHeight", "get");
    const playBroadcast = vi.fn();

    scheduleNestedEnterBroadcast({ playBroadcast }, ["overlay", "panel"]);

    expect(playBroadcast).not.toHaveBeenCalled();
    raf.flush();
    expect(playBroadcast).toHaveBeenCalledWith("enter", { exclude: ["overlay", "panel"] });
    expect(offset).not.toHaveBeenCalled();
  });

  it("skips broadcast when shouldPlay is false", () => {
    const raf = installRaf();
    const playBroadcast = vi.fn();

    scheduleNestedEnterBroadcast({ playBroadcast }, ["content"], () => false);
    raf.flush();

    expect(playBroadcast).not.toHaveBeenCalled();
  });

  it("does not play after the frame is cancelled", () => {
    const raf = installRaf();
    const playBroadcast = vi.fn();

    const id = scheduleNestedEnterBroadcast({ playBroadcast }, ["root"]);
    cancelAnimationFrame(id);
    raf.flush();

    expect(playBroadcast).not.toHaveBeenCalled();
  });

  it("invalidateEnterFrame cancels a pending nested enter and bumps generation", () => {
    const raf = installRaf();
    const playBroadcast = vi.fn();
    const frameRef = { current: 0 };
    const genRef = { current: 0 };
    const gen = ++genRef.current;
    frameRef.current = scheduleNestedEnterBroadcast({ playBroadcast }, ["overlay"], () => {
      if (gen !== genRef.current) return false;
      frameRef.current = 0;
      return true;
    });

    invalidateEnterFrame(frameRef, genRef);
    raf.flush();

    expect(playBroadcast).not.toHaveBeenCalled();
    expect(frameRef.current).toBe(0);
    expect(genRef.current).toBeGreaterThan(gen);
  });
});

describe("flushDialogOpenLayout", () => {
  it("reads layout once after native dialog open", () => {
    const el = {
      get offsetHeight() {
        return 120;
      },
    } as HTMLElement;
    const offset = vi.spyOn(el, "offsetHeight", "get");

    flushDialogOpenLayout(el);

    expect(offset).toHaveBeenCalledTimes(1);
  });
});
