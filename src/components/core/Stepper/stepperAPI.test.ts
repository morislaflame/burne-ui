import { createElement } from "react";
import { describe, expect, it } from "vitest";

import {
  STEPPER_ITEM_NAME,
  isStepperItem,
  stepperStepSelectable,
  stepperStepState,
  stepperValues,
} from "./stepperAPI";

function Item(_props: { value?: string }) {
  return null;
}
Item.displayName = STEPPER_ITEM_NAME;

describe("stepperStepState", () => {
  it("marks earlier steps complete, the current one active, and the rest ahead", () => {
    expect(stepperStepState(0, 1)).toBe("checked");
    expect(stepperStepState(1, 1)).toBe("active");
    expect(stepperStepState(2, 1)).toBe("inactive");
  });
});

describe("stepperStepSelectable", () => {
  it("blocks steps ahead while linear", () => {
    expect(stepperStepSelectable(0, 1, true)).toBe(true);
    expect(stepperStepSelectable(1, 1, true)).toBe(true);
    expect(stepperStepSelectable(2, 1, true)).toBe(false);
  });

  it("allows every step when linear is off", () => {
    expect(stepperStepSelectable(2, 0, false)).toBe(true);
  });
});

describe("isStepperItem", () => {
  it("matches the item display name without importing the part", () => {
    const item = createElement(Item, { value: "account" });
    expect(isStepperItem(item)).toBe(true);
    expect(stepperValues(true, undefined, item)).toEqual(["account"]);
  });
});
