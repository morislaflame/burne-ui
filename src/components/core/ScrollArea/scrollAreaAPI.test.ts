import { describe, expect, it } from "vitest";

import {
  inlineScrollLeft,
  inlineScrollOffset,
  scrollAreaBarActive,
  scrollAreaKeyDelta,
  scrollAreaNextOffset,
  scrollAxisMetrics,
  scrollFromThumbOffset,
} from "./scrollAreaAPI";

describe("scrollAxisMetrics", () => {
  it("stays idle when the content fits", () => {
    expect(scrollAxisMetrics(100, 100, 0).overflowing).toBe(false);
  });

  it("sizes the thumb from the viewport ratio and parks it at the ends", () => {
    const start = scrollAxisMetrics(100, 400, 0, 100);
    expect(start.overflowing).toBe(true);
    expect(start.thumbSize).toBe(25);
    expect(start.thumbOffset).toBe(0);
    expect(start.maxScroll).toBe(300);

    const end = scrollAxisMetrics(100, 400, 300, 100);
    expect(end.thumbOffset).toBe(75);
    expect(scrollFromThumbOffset(75, end)).toBeCloseTo(300);
  });
});

describe("scrollAreaKeyDelta", () => {
  it("steps vertically and flips horizontal arrows in rtl", () => {
    expect(scrollAreaKeyDelta("ArrowDown", "vertical", 80)).toBe(48);
    expect(scrollAreaKeyDelta("PageUp", "vertical", 80)).toBe(-80);
    expect(scrollAreaKeyDelta("Home", "horizontal", 80)).toBe("start");
    expect(scrollAreaKeyDelta("ArrowLeft", "horizontal", 80, true)).toBe(48);
    expect(scrollAreaKeyDelta("ArrowRight", "horizontal", 80, true)).toBe(-48);
  });

  it("clamps the next offset", () => {
    const metrics = scrollAxisMetrics(100, 400, 0, 100);
    expect(scrollAreaNextOffset(0, metrics, "end")).toBe(300);
    expect(scrollAreaNextOffset(290, metrics, 48)).toBe(300);
  });
});

describe("inline scroll", () => {
  it("mirrors rtl scrollLeft for the negative browser mode", () => {
    expect(inlineScrollOffset(-40, 100, "rtl", "negative")).toBe(40);
    expect(inlineScrollLeft(40, 100, "rtl", "negative")).toBe(-40);
    expect(inlineScrollOffset(60, 100, "rtl", "positive-descending")).toBe(40);
    expect(inlineScrollLeft(40, 100, "ltr", "negative")).toBe(40);
  });
});

describe("scrollAreaBarActive", () => {
  it("shows always, hover, and scroll independently", () => {
    const base = { overflowing: true, hovered: false, focused: false, scrolling: false, dragging: false };
    expect(scrollAreaBarActive({ ...base, visibility: "always" })).toBe(true);
    expect(scrollAreaBarActive({ ...base, visibility: "hover" })).toBe(false);
    expect(scrollAreaBarActive({ ...base, visibility: "hover", hovered: true })).toBe(true);
    expect(scrollAreaBarActive({ ...base, visibility: "scroll", scrolling: true })).toBe(true);
    expect(scrollAreaBarActive({ ...base, overflowing: false, visibility: "always" })).toBe(false);
  });
});
