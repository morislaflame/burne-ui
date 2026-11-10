import { vi } from "vitest";

type FocusOptionsWithVisible = FocusOptions & { focusVisible?: boolean };

export function installFocusSpy() {
  return vi.spyOn(HTMLElement.prototype, "focus");
}

export function openedWithVisibleFocus(
  spy: { mock: { calls: Array<[FocusOptionsWithVisible?]> } },
): boolean {
  return spy.mock.calls.some((call) => call[0]?.focusVisible === true);
}
