/** Единая шкала размеров для интерактивных и selection-компонентов. */
export type ComponentSize = "small" | "base" | "mid" | "large";

export const COMPONENT_SIZES = ["small", "base", "mid", "large"] as const satisfies readonly ComponentSize[];
