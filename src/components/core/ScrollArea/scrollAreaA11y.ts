import type { ScrollAxis } from "./scrollAreaTypes";

export function scrollAreaScrollbarA11y({
  controls,
  axis,
  now,
  max,
}: {
  controls: string;
  axis: ScrollAxis;
  now: number;
  max: number;
}) {
  return {
    role: "scrollbar" as const,
    "aria-controls": controls,
    "aria-orientation": axis,
    "aria-valuemin": 0,
    "aria-valuemax": max,
    "aria-valuenow": now,
  };
}
