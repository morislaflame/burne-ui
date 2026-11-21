import { RIPPLE_COLOR, type RippleColor } from "./rippleTokens";
 
export function resolveRipplePaint(input?: string): string {
  if (input == null || input === "") return RIPPLE_COLOR.neutral;
  if (input in RIPPLE_COLOR) return RIPPLE_COLOR[input as RippleColor];
  return input;
}
 
const RIPPLE_DISABLED_SELECTOR = ":disabled, [aria-disabled='true'], [data-disabled]";

export function resolveRippleEventTarget(layer: HTMLElement): HTMLElement | null {
  const interactive = layer.closest(
    "button,a[href],[role='button']",
  ) as HTMLElement | null;
  return interactive ?? layer.parentElement;
}

export function isRippleTargetDisabled(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true;
  if (target.matches(RIPPLE_DISABLED_SELECTOR)) return true;
  return target.closest(RIPPLE_DISABLED_SELECTOR) !== null;
}
 