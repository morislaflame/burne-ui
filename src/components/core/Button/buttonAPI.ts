import type {
  ButtonAsyncLayerKind,
  ButtonAsyncState,
  ButtonStatus,
  ButtonVariant,
} from "./buttonTypes";

export function resolveButtonVariant(variant: ButtonVariant | undefined): ButtonVariant {
  return variant ?? "default";
}

export function resolveButtonStatus(status: ButtonStatus | undefined): ButtonStatus {
  return status ?? "default";
}

export function resolveButtonAsyncState(
  asyncState: ButtonAsyncState | undefined,
): ButtonAsyncState {
  return asyncState ?? "idle";
}

export function isButtonBlocked(
  disabled: boolean | undefined,
  asyncState: ButtonAsyncState,
): boolean {
  return Boolean(disabled) || asyncState === "loading";
}

export function maxDistanceToCorners(px: number, py: number, w: number, h: number) {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  return Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - px, cy - py)));
}

export function centerCoverDiameter(w: number, h: number) {
  return 2 * maxDistanceToCorners(w / 2, h / 2, w, h);
}

export function isButtonAsyncLayerActive(
  state: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
): boolean {
  switch (layer) {
    case "label":
      return state === "idle";
    case "loader":
      return state === "loading";
    case "success":
      return state === "success";
    case "error":
      return state === "error";
  }
}


