import { describe, expect, it } from "vitest";

import {
  pinInputChar,
  pinInputDelete,
  pinInputInsert,
  pinInputKeyAction,
  pinInputLength,
  pinInputPaste,
} from "./pinInputAPI";

describe("pinInput", () => {
  it("clamps length", () => {
    expect(pinInputLength(undefined)).toBe(6);
    expect(pinInputLength(0)).toBe(1);
    expect(pinInputLength(20)).toBe(12);
  });

  it("keeps digits and drops the rest", () => {
    expect(pinInputChar("4", "number")).toBe("4");
    expect(pinInputChar("a", "number")).toBe("");
    expect(pinInputChar("Z", "text")).toBe("Z");
  });

  it("replaces a cell and appends at the end", () => {
    expect(pinInputInsert("1234", 0, "9", 6)).toBe("9234");
    expect(pinInputInsert("12", 2, "3", 6)).toBe("123");
    expect(pinInputInsert("12", 5, "3", 6)).toBe("123");
  });

  it("deletes the current cell or the last one", () => {
    expect(pinInputDelete("1234", 1)).toEqual({ value: "134", focus: 1 });
    expect(pinInputDelete("1234", 4)).toEqual({ value: "123", focus: 3 });
  });

  it("pastes from the focused cell", () => {
    expect(pinInputPaste("", 0, "12ab56", "number", 6)).toEqual({ value: "1256", focus: 4 });
  });

  it("maps arrows and backspace", () => {
    expect(pinInputKeyAction("ArrowLeft", 2, 6, "123")).toEqual({ type: "move", index: 1 });
    expect(pinInputKeyAction("End", 0, 6, "123")).toEqual({ type: "move", index: 3 });
    expect(pinInputKeyAction("Backspace", 1, 6, "12")).toEqual({ type: "delete" });
  });
});
