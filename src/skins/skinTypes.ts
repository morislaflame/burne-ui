import type {
  HTMLAttributes,
  PointerEventHandler,
  ReactNode,
  Ref,
} from "react";

import type { MotionConfig } from "@/components/core/utils/motionConfig";
import type { MotionPhaseName, MotionVars } from "@/components/core/utils/slotMotion";

import type { SkinSlotRegistry } from "@/skin";
import type {
  SkinLayerSlot as KitSkinLayerSlot,
  SkinMotionSlot as KitSkinMotionSlot,
  SkinTargetSlot as KitSkinTargetSlot,
} from "./skinLiveSlots.generated";

export type { SkinSlot } from "./skinSlots.generated";
export { SKIN_SLOTS } from "./skinSlots.generated";
export { SKIN_LAYER_SLOTS, SKIN_MOTION_SLOTS, SKIN_TARGET_SLOTS } from "./skinLiveSlots.generated";

/** Kit slot, or a name added through `declare module "burne-ui/skin"`. */
type AuthorSkinSlot = keyof SkinSlotRegistry & string;

export type SkinTargetSlot = KitSkinTargetSlot | AuthorSkinSlot;
export type SkinMotionSlot = KitSkinMotionSlot | AuthorSkinSlot;
export type SkinLayerSlot = KitSkinLayerSlot | AuthorSkinSlot;

/**
 * Geometry of the focus ring. Color tokens are allowed: the validator requires
 * ≥3:1 against `background` and `surface`. Forced-colors still paints `Highlight`
 * on the outline itself.
 */
export const SKIN_FORBIDDEN_TOKENS = ["--focus-ring-width", "--focus-ring-offset"] as const;

export type SkinForbiddenToken = (typeof SKIN_FORBIDDEN_TOKENS)[number];

export function isFocusRingColorToken(name: string): boolean {
  return name.startsWith("--color-focus-ring");
}

export function isForbiddenSkinToken(name: string): boolean {
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
 * Who paints elevation.
 * `kit` keeps kit shadows and hover-lift. `skin` (the default) leaves elevation
 * to the skin. `none` is flat: the kit does not paint its layers.
 * Modals and menus do not grow on hover for every value.
 */
export type SkinElevation = "kit" | "skin" | "none";

/**
 * A string replaces the kit class (an empty string clears the fill).
 * `{ extend }` appends classes after the kit class. `{ replace }` is the same as a string.
 */
export type SkinTargetSpec = string | { replace: string } | { extend: string };

export type SkinMotionParams = Record<string, string | number | boolean>;

/** A recipe name, declarative `MotionVars`, or `{ recipe, params }`. */
export type SkinMotionPhaseValue =
  | string
  | (MotionVars & { recipe?: string; params?: SkinMotionParams });

export type SkinRuleDeclarations = Record<string, string>;

/** CSS for one slot. Selectors are generated; the author does not write Tailwind. */
export type SkinSlotRules = {
  style?: SkinRuleDeclarations;
  light?: SkinRuleDeclarations;
  dark?: SkinRuleDeclarations;
  hover?: SkinRuleDeclarations;
  "focus-visible"?: SkinRuleDeclarations;
  "::before"?: SkinRuleDeclarations;
  "::after"?: SkinRuleDeclarations;
  state?: Record<string, SkinRuleDeclarations>;
  status?: Record<string, SkinRuleDeclarations>;
};

/** `@property` for a custom variable the skin animates. */
export type SkinPropertyDefinition = {
  syntax: string;
  inherits: boolean;
  initialValue: string;
};

/** `@font-face`, or a stylesheet `href` when `src` is omitted. */
export type SkinFontFace = {
  family: string;
  src?: string;
  weight?: string;
  style?: string;
  href?: string;
};

/** Scalar motion overlay, or a list (eases, stops) the studio keeps on the document. */
export type SkinMotionConfigValue =
  | string
  | number
  | boolean
  | readonly (string | number | boolean)[];

export type SkinMotionMap = Partial<
  Record<SkinMotionSlot, Partial<Record<MotionPhaseName, SkinMotionPhaseValue>>>
> & {
  /**
   * GSAP overlay. `SkinProvider` passes scalar keys to `MotionConfigProvider`.
   * Arrays stay on the document for export.
   */
  config?: Partial<MotionConfig> & Record<string, SkinMotionConfigValue | undefined>;
};

/**
 * Skin data. Ярус 1 is `tokens*`. Ярус 2 is `targets` / `motion`. Ярус 3 is `layers`
 * plus serializable `layersDeclarative`.
 *
 * `SkinProvider` reads tokens. Styles and animations read `targets` / `motion`
 * through `resolveVariantVisual`. `SkinShell` reads `layers` / `layersDeclarative`.
 * A code `layers` renderer wins over `layersDeclarative` for the same slot.
 */
export type SkinDefinition = {
  /** Unique name. Lands on `data-skin` and on `variant`. Kebab-case. */
  name: string;
  /** Another registered skin. Tokens, targets, rules, layers, and motion merge under this skin. */
  extends?: string;
  meta?: SkinMeta;
  /**
   * Ярус 1 CSS variables. The key set is the reset source:
   * turning the skin off writes each key back to the kit snapshot from the
   * theme root, refreshed when the theme mode changes. Not `initial`.
   */
  tokens?: Record<string, string>;
  tokensLight?: Record<string, string>;
  tokensDark?: Record<string, string>;
  /** Ярус 2 classes. Only slots `resolveVariantVisual` actually reads. */
  targets?: Partial<Record<SkinTargetSlot, SkinTargetSpec>>;
  /**
   * Ярус 2 CSS properties. Export writes a class `.skin-{name}-{slot}` and appends
   * it to `targets`, so the rule works without Tailwind.
   */
  rules?: Partial<Record<SkinTargetSlot, SkinSlotRules>>;
  /** `@property` declarations for variables this skin animates. */
  properties?: Record<string, SkinPropertyDefinition>;
  /** Fonts loaded with the skin stylesheet. */
  fonts?: SkinFontFace[];
  /**
   * Ярус 2 recipe swap per slot and phase.
   * A flat `phase → recipe` map is not enough: slots do not share phases.
   * Keys are slots `overlaySkinMotion` can reach. `config` is the GSAP overlay.
   */
  motion?: SkinMotionMap;
  /**
   * Kit elevation for this skin. Omitted means `skin`: the kit does not draw
   * its shadow layers. `kit` keeps them. `none` stays flat.
   */
  elevation?: SkinElevation;
  /** Ярус 3 React decorators. Not serializable. Hosts are `SkinShell` parts. */
  layers?: Partial<Record<SkinLayerSlot, SkinLayerRenderer>>;
  /** Ярус 3 for the editor. Serializable. */
  layersDeclarative?: Partial<Record<SkinLayerSlot, SkinDeclarativeLayers>>;
  /**
   * Kit variant used when `variant="<skin name>"` has no `targets` entry for that slot.
   * Without it, an unknown variant breaks closed style maps.
   */
  baseVariant?: "default" | "outline" | "secondary";
  /** Skin stylesheet. The app imports it. `layers` without this is a dev warning. */
  styleUrl?: string;
};
