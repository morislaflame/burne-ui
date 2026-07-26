/** Unified size scale for interactive and selection components. */
export type ComponentSize = "small" | "base" | "mid" | "large";

export const COMPONENT_SIZES = ["small", "base", "mid", "large"] as const satisfies readonly ComponentSize[];

export function resolveComponentSize(size?: ComponentSize): ComponentSize {
  return size ?? "base";
}
