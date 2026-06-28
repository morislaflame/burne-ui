import type { ComponentSize } from "./componentSize";

const CONTROL_HEIGHT_VAR: Record<ComponentSize, string> = {
  small: "--control-height-small",
  base: "--control-height-base",
  mid: "--control-height-mid",
  large: "--control-height-large",
};

/** SSR-fallback: множитель root rem, если DOM-измерение недоступно. */
const CONTROL_HEIGHT_SCALE: Record<ComponentSize, number> = {
  small: 1.75,
  base: 2.2,
  mid: 2.5,
  large: 3,
};

const controlHeightPxCache = new Map<ComponentSize, number>();

function measureControlHeightPx(size: ComponentSize): number | null {
  if (typeof document === "undefined") return null;

  const cached = controlHeightPxCache.get(size);
  if (cached != null) return cached;

  try {
    const dummy = document.createElement("div");
    dummy.style.position = "absolute";
    dummy.style.visibility = "hidden";
    dummy.style.height = `var(${CONTROL_HEIGHT_VAR[size]})`;
    document.body.appendChild(dummy);
    const computedHeight = dummy.getBoundingClientRect().height;
    document.body.removeChild(dummy);
    if (computedHeight > 0) {
      controlHeightPxCache.set(size, computedHeight);
      return computedHeight;
    }
  } catch {
  }

  return null;
}

/** Высота контрола в px — читает `--control-height-*` с `:root`. */
export function readControlHeightPx(size: ComponentSize, rootPx = 16): number {
  return measureControlHeightPx(size) ?? rootPx * CONTROL_HEIGHT_SCALE[size];
}
