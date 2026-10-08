import type { StepperOrientation } from "./stepperTypes";

export function stepperCurrent(active: boolean): "step" | undefined {
  return active ? "step" : undefined;
}

/** Arrow delta along the track. Horizontal swaps sides when the list is RTL. */
export function stepperKeyDelta(
  key: string,
  orientation: StepperOrientation,
  rtl: boolean,
): 1 | -1 | "start" | "end" | null {
  const forward = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
  const back = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
  if (key === forward) return 1;
  if (key === back) return -1;
  if (key === "Home") return "start";
  if (key === "End") return "end";
  return null;
}
