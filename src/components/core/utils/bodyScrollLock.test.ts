import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getBodyScrollLockCountForTests,
  lockBodyScroll,
  resetBodyScrollLockForTests,
  unlockBodyScroll,
} from "./bodyScrollLock";

function styleBag() {
  return {
    overflow: "",
    position: "",
    top: "",
    left: "",
    right: "",
    width: "",
    paddingRight: "",
    overscrollBehavior: "",
  };
}

function installDom({
  scrollY = 0,
  innerWidth = 1024,
  clientWidth = 1024,
  paddingRight = "0px",
  bodyOverflow = "",
}: {
  scrollY?: number;
  innerWidth?: number;
  clientWidth?: number;
  paddingRight?: string;
  bodyOverflow?: string;
} = {}) {
  const bodyStyle = styleBag();
  bodyStyle.overflow = bodyOverflow;
  const htmlStyle = styleBag();
  const scrollTo = vi.fn();

  vi.stubGlobal("document", {
    body: { style: bodyStyle },
    documentElement: { style: htmlStyle, clientWidth },
  });
  vi.stubGlobal("window", {
    scrollY,
    pageYOffset: scrollY,
    innerWidth,
    scrollTo,
    getComputedStyle: () => ({ paddingRight }),
  });

  return { bodyStyle, htmlStyle, scrollTo };
}

afterEach(() => {
  resetBodyScrollLockForTests();
  vi.unstubAllGlobals();
});

describe("lockBodyScroll", () => {
  it("is a no-op without a document (SSR)", () => {
    lockBodyScroll();
    expect(getBodyScrollLockCountForTests()).toBe(0);
  });

  it("pins the body with position:fixed and top:-scrollY", () => {
    const { bodyStyle, htmlStyle } = installDom({ scrollY: 240 });
    lockBodyScroll();
    expect(bodyStyle.position).toBe("fixed");
    expect(bodyStyle.top).toBe("-240px");
    expect(bodyStyle.left).toBe("0");
    expect(bodyStyle.right).toBe("0");
    expect(bodyStyle.width).toBe("100%");
    expect(bodyStyle.overflow).toBe("hidden");
    expect(bodyStyle.overscrollBehavior).toBe("none");
    expect(htmlStyle.overflow).toBe("hidden");
    expect(htmlStyle.overscrollBehavior).toBe("none");
    expect(getBodyScrollLockCountForTests()).toBe(1);
  });

  it("compensates the scrollbar gap on the first lock", () => {
    const { bodyStyle } = installDom({
      innerWidth: 1024,
      clientWidth: 1008,
    });
    lockBodyScroll();
    expect(bodyStyle.paddingRight).toBe("16px");
  });

  it("keeps the lock until the last nested overlay unlocks", () => {
    const { bodyStyle } = installDom({ scrollY: 80, bodyOverflow: "scroll" });
    lockBodyScroll();
    lockBodyScroll();
    expect(getBodyScrollLockCountForTests()).toBe(2);
    expect(bodyStyle.position).toBe("fixed");

    unlockBodyScroll();
    expect(getBodyScrollLockCountForTests()).toBe(1);
    expect(bodyStyle.position).toBe("fixed");
    expect(bodyStyle.overflow).toBe("hidden");

    unlockBodyScroll();
    expect(getBodyScrollLockCountForTests()).toBe(0);
    expect(bodyStyle.position).toBe("");
    expect(bodyStyle.overflow).toBe("scroll");
    expect(bodyStyle.top).toBe("");
  });

  it("restores scrollY after the last unlock", () => {
    const { scrollTo } = installDom({ scrollY: 180 });
    lockBodyScroll();
    unlockBodyScroll();
    expect(scrollTo).toHaveBeenCalledWith(0, 180);
  });

  it("ignores unlock without a matching lock", () => {
    installDom();
    unlockBodyScroll();
    expect(getBodyScrollLockCountForTests()).toBe(0);
  });
});
