import { RIPPLE_COLOR, type RippleColor } from "./rippleTokens";

export function resolveRipplePaint(input?: string): string {
  if (input == null || input === "") return RIPPLE_COLOR.neutral;
  if (input in RIPPLE_COLOR) return RIPPLE_COLOR[input as RippleColor];
  return input;
}

export function resolveRippleEventTarget(layer: HTMLElement): HTMLElement | null {
  const interactive = layer.closest(
    "button,a[href],[role='button']",
  ) as HTMLElement | null;
  return interactive ?? layer.parentElement;
}
