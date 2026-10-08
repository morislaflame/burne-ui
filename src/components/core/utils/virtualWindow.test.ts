import { describe, expect, it } from "vitest";

import { scrollToRevealIndex, virtualRange } from "./virtualWindow";

describe("virtualRange", () => {
  it("returns an empty window for an empty list", () => {
    expect(virtualRange({ count: 0, itemSize: 36, scrollOffset: 0, viewport: 200 })).toEqual({
      start: 0,
      end: 0,
      offset: 0,
      total: 0,
      scroll: 0,
    });
  });

  it("mounts a slice around the viewport plus overscan", () => {
    const range = virtualRange({
      count: 200,
      itemSize: 40,
      scrollOffset: 800,
      viewport: 200,
      overscan: 2,
    });
    expect(range.start).toBe(18);
    expect(range.end).toBe(27);
    expect(range.offset).toBe(720);
    expect(range.total).toBe(8000);
    expect(range.end - range.start).toBeLessThan(200);
  });

  it("shifts the scroll offset so a pinned index stays in view", () => {
    const scroll = scrollToRevealIndex({
      count: 200,
      itemSize: 40,
      scrollOffset: 0,
      viewport: 200,
      pinIndex: 40,
    });
    const range = virtualRange({
      count: 200,
      itemSize: 40,
      scrollOffset: scroll,
      viewport: 200,
      overscan: 0,
    });
    expect(range.start).toBeLessThanOrEqual(40);
    expect(range.end).toBeGreaterThan(40);
    expect(range.end - range.start).toBeLessThan(20);
  });
});
