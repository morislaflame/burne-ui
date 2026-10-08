import { describe, expect, it } from "vitest";

import {
  clampNumberInput,
  formatNumberInput,
  numberInputCanStep,
  snapNumberInput,
  stepNumberInput,
} from "./numberInputAPI";

describe("numberInputAPI", () => {
  it("starts an empty field at min or zero", () => {
    expect(stepNumberInput(null, 1, 1)).toBe(0);
    expect(stepNumberInput(null, 1, 1, 5, 10)).toBe(5);
    expect(stepNumberInput(null, -1, 1, 0, 8)).toBe(8);
  });

  it("steps and snaps decimals", () => {
    expect(stepNumberInput(1, 1, 0.1)).toBe(1.1);
    expect(stepNumberInput(0.2, 1, 0.1)).toBe(0.3);
    expect(snapNumberInput(1.26, 0.1)).toBe(1.3);
    expect(snapNumberInput(1.2, 0.5)).toBe(1);
  });

  it("clamps to min and max", () => {
    expect(clampNumberInput(15, 0, 10)).toBe(10);
    expect(clampNumberInput(-2, 0, 10)).toBe(0);
    expect(stepNumberInput(10, 1, 1, 0, 10)).toBe(10);
    expect(numberInputCanStep(10, 1, 0, 10)).toBe(false);
    expect(numberInputCanStep(0, -1, 0, 10)).toBe(false);
    expect(numberInputCanStep(null, 1, 0, 10)).toBe(true);
  });

  it("formats finite numbers and hides empty", () => {
    expect(formatNumberInput(null)).toBe("");
    expect(formatNumberInput(12)).toBe("12");
  });
});