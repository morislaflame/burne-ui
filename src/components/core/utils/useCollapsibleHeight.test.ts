import { afterEach, describe, expect, it, vi } from "vitest";

import { gsap } from "./gsapMotion";
import { animateCollapsibleHeight } from "./useCollapsibleHeight";

function fakeEl(height = 0): HTMLElement {
  const store: Record<string, string> = {};
  const style = new Proxy(store, {
    get(target, prop) {
      if (prop === "removeProperty") {
        return (name: string) => {
          delete target[name];
          return "";
        };
      }
      return target[prop as string] ?? "";
    },
    set(target, prop, value) {
      target[prop as string] = String(value);
      return true;
    },
  });
  return {
    style,
    scrollHeight: height,
    getBoundingClientRect() {
      const h = store.height ? Number.parseFloat(store.height) : height;
      return { left: 0, top: 0, right: 120, bottom: h, width: 120, height: h };
    },
  } as unknown as HTMLElement;
}

function stubTween() {
  return {
    isActive: () => true,
    resetTo: vi.fn(),
    kill: vi.fn(),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("animateCollapsibleHeight", () => {
  it("passes a numeric enter height snapshotted before the tween", () => {
    const inner = fakeEl(144);
    const fromTo = vi.spyOn(gsap, "fromTo").mockReturnValue(stubTween() as unknown as gsap.core.Tween);

    animateCollapsibleHeight(fakeEl(), inner, true, {
      reduced: false,
      duration: 0.2,
      ease: "none",
    });

    expect(fromTo).toHaveBeenCalledTimes(1);
    expect(fromTo.mock.calls[0][2]?.height).toBe(144);
    expect(typeof fromTo.mock.calls[0][2]?.height).toBe("number");
  });

  it("snapshots leave height before tweening to 0", () => {
    const to = vi.spyOn(gsap, "to").mockReturnValue(stubTween() as unknown as gsap.core.Tween);
    const shell = fakeEl(80);
    shell.style.height = "80px";

    animateCollapsibleHeight(shell, fakeEl(80), false, {
      reduced: false,
      duration: 0.2,
      ease: "none",
    });

    expect(shell.style.height).toBe("80px");
    expect(to).toHaveBeenCalledTimes(1);
    expect(to.mock.calls[0][1]?.height).toBe(0);
  });

  it("retargets enter height from ResizeObserver without a per-tick layout read", () => {
    let notify: ResizeObserverCallback = () => {};
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: ResizeObserverCallback) {
          notify = cb;
        }
        observe() {}
        disconnect() {}
      },
    );

    const inner = fakeEl(100);
    const tween = stubTween();
    vi.spyOn(gsap, "fromTo").mockReturnValue(tween as unknown as gsap.core.Tween);

    animateCollapsibleHeight(fakeEl(), inner, true, {
      reduced: false,
      duration: 0.2,
      ease: "none",
    });

    Object.defineProperty(inner, "scrollHeight", { configurable: true, get: () => 180 });
    notify([] as unknown as ResizeObserverEntry[], {} as ResizeObserver);

    expect(tween.resetTo).toHaveBeenCalledWith("height", 180);
  });
});
