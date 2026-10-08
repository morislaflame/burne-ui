import type {
  HTMLAttributes,
  PointerEventHandler,
  ReactNode,
  Ref,
} from "react";

import type { MotionPhaseName } from "@/components/core/utils/slotMotion";

import type { SkinSlot } from "./skinSlots.generated";

export type { SkinSlot } from "./skinSlots.generated";
export { SKIN_SLOTS } from "./skinSlots.generated";

/**
 * Tokens a skin must not set. Forced-colors maps the focus ring onto `Highlight`;
 * overriding these drops the ring in Windows HCM.
 */
export const SKIN_FORBIDDEN_TOKENS = [
  "--color-focus-ring",
  "--color-focus-ring-danger",
  "--color-focus-ring-success",
  "--color-focus-ring-info",
  "--color-focus-ring-warning",
  "--focus-ring-width",
  "--focus-ring-offset",
] as const;

export type SkinForbiddenToken = (typeof SKIN_FORBIDDEN_TOKENS)[number];

export function isForbiddenSkinToken(name: string): boolean {
  if (name.startsWith("--color-focus-ring")) return true;
  return name === "--focus-ring-width" || name === "--focus-ring-offset";
}

export type SkinMeta = {
  title?: string;
  author?: string;
  version?: string;
  description?: string;
};

/** One declarative node. `style` is a CSS variable / inline map, same shape as `before`. */
export type SkinDeclarativeNode = {
  className?: string;
  style?: Record<string, string>;
};

/**
 * Declarative Ярус 3 layers. Serializable. `layers` (render functions) are not.
 * `before` and `after` may repeat the same `className`; `SkinShell` keys them by index.
 */
export type SkinDeclarativeLayers = {
  before?: SkinDeclarativeNode[];
  after?: SkinDeclarativeNode[];
  content?: SkinDeclarativeNode;
  wrapper?: SkinDeclarativeNode;
};

/**
 * Ярус 3 decorator. Must forward `ref`, pointer handlers, and the rest of the props
 * onto the node that `useMotionPart` registers. Do not wrap that node in a way that
 * drops the ref.
 */
export type SkinLayerProps = {
  ref?: Ref<HTMLElement>;
  className?: string;
  children?: ReactNode;
  onPointerOver?: PointerEventHandler<HTMLElement>;
  onPointerOut?: PointerEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
} & Omit<
  HTMLAttributes<HTMLElement>,
  | "className"
  | "children"
  | "onPointerOver"
  | "onPointerOut"
  | "onPointerDown"
  | "onPointerUp"
>;

export type SkinLayerRenderer = (props: SkinLayerProps) => ReactNode;

/**
 * Skin data. Ярус 1 is `tokens*`. Ярус 2 is `targets` / `motion`. Ярус 3 is `layers`
 * plus serializable `layersDeclarative`.
 *
 * `SkinProvider` reads tokens. Styles and animations read `targets` / `motion`
 * through `resolveVariantVisual`. `SkinShell` reads `layers` / `layersDeclarative`.
 * A code `layers` renderer wins over `layersDeclarative` for the same slot.
 */
export type SkinDefinition = {
  /** Unique name. Lands on `data-skin` and on `variant`. */
  name: string;
  meta?: SkinMeta;
  /**
   * Ярус 1 CSS variables. The key set is the only reset source:
   * turning the skin off writes each key back to `initial`.
   */
  tokens?: Record<string, string>;
  tokensLight?: Record<string, string>;
  tokensDark?: Record<string, string>;
  /** Ярус 2 classes. Keys are `"component.slot"` from `XxxClassNames`. */
  targets?: Partial<Record<SkinSlot, string>>;
  /**
   * Ярус 2 recipe swap per slot and phase.
   * A flat `phase → recipe` map is not enough: slots do not share phases.
   */
  motion?: Partial<Record<SkinSlot, Partial<Record<MotionPhaseName, string>>>>;
  /** Ярус 3 React decorators. Not serializable. */
  layers?: Partial<Record<SkinSlot, SkinLayerRenderer>>;
  /** Ярус 3 for the editor. Serializable. */
  layersDeclarative?: Partial<Record<SkinSlot, SkinDeclarativeLayers>>;
  /**
   * Kit variant used when `variant="<skin name>"` has no `targets` entry for that slot.
   * Without it, an unknown variant breaks closed style maps.
   */
  baseVariant?: "default" | "outline" | "secondary";
  /** Skin stylesheet. The app imports it. `layers` without this is a dev warning. */
  styleUrl?: string;
};
