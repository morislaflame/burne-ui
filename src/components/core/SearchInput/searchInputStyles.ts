import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { FIELD_SHELL_VARIANT_BG_CLASS, type FieldShellFilledVariant } from "@/components/core/utils/fieldShellVariant";
import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import {
  FIELD_SHELL_FOCUS_CLASS,
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import { cn } from "@/utils/cn";

import type {
  SearchInputSize,
  SearchInputVariant,
  SearchSizeLayout,
} from "./searchInputTypes";

export const SEARCH_INPUT_EXPAND_TRIGGER_CLASS =
  "absolute inset-0 z-[2] m-0 cursor-pointer border-0 bg-transparent p-0 outline-none focus-ring-inset rounded-[inherit]";

export const SEARCH_INPUT_ICON_WRAP_CLASS =
  "pointer-events-none absolute inset-y-0 z-[1] flex items-center justify-center text-muted";

export const SEARCH_INPUT_ICON_CLASS = "shrink-0";

export const SEARCH_INPUT_CONTROL_BASE_CLASS =
  "box-border min-h-0 w-full border-0 bg-transparent text-foreground outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none disabled:cursor-not-allowed disabled:opacity-100";

export const SEARCH_INPUT_CONTROL_EXPANDED_CLASS = "relative z-[2] opacity-100";

export const SEARCH_INPUT_CONTROL_COLLAPSED_CLASS =
  "pointer-events-none absolute inset-0 opacity-0";

export const SEARCH_INPUT_CLEAR_BUTTON_CLASS =
  "absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 text-foreground outline-none focus-ring-inset cursor-pointer";

export const SEARCH_INPUT_CLEAR_ICON_CLASS = "shrink-0";

export const SEARCH_INPUT_ROOT_BASE_CLASS =
  "relative box-border inline-block overflow-hidden text-left";

export const SEARCH_INPUT_ROOT_GLOSS_CLASS = "gloss-control border-0";

export const SEARCH_INPUT_ROOT_BORDER_CLASS = "border-1 border-token";

export const SEARCH_INPUT_ROOT_COLLAPSED_ROUNDED_CLASS = "rounded-full";

export const SEARCH_INPUT_CURSOR_TEXT_CLASS = "cursor-text";

export const SEARCH_INPUT_CURSOR_POINTER_CLASS = "cursor-pointer";

export const SEARCH_INPUT_BLOCKED_CLASS = "pointer-events-none opacity-55";

type SearchExpandedRadiusStep = "small" | "base" | "mid" | "large";

const SEARCH_EXPANDED_RADIUS_VALUE_VAR: Record<SearchExpandedRadiusStep, string> = {
  small: "--radius-value-small",
  base: "--radius-value-base",
  mid: "--radius-value-mid",
  large: "--radius-value-large",
};

const SEARCH_EXPANDED_RADIUS_STEP: Record<ComponentSize, SearchExpandedRadiusStep> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

const SEARCH_EXPANDED_RADIUS_FALLBACK_MULT: Record<SearchExpandedRadiusStep, number> = {
  small: 0.75,
  base: 1,
  mid: 1.25,
  large: 1.5,
};

export const SEARCH_EXPANDED_ROUNDED_CLASS: Record<ComponentSize, string> = {
  small: "rounded-small",
  base: "rounded-base",
  mid: "rounded-mid",
  large: "rounded-large",
};

const SHELL_W_COLLAPSED: Record<ComponentSize, string> = {
  small: "w-control-small",
  base: "w-control-base",
  mid: "w-control-mid",
  large: "w-control-large",
};

const SEARCH_PAD_X_PX: Record<ComponentSize, number> = {
  small: 8,
  base: 12,
  mid: 16,
  large: 20,
};

const SEARCH_ICON_BOX_PX: Record<ComponentSize, number> = {
  small: 14,
  base: 16,
  mid: 20,
  large: 20,
};

const SEARCH_CLEAR_TAP_PX: Record<ComponentSize, number> = {
  small: 20,
  base: 24,
  mid: 28,
  large: 32,
};

const SEARCH_DEFAULT_EXPANDED_WIDTH: Record<ComponentSize, number> = {
  small: 240,
  base: 280,
  mid: 320,
  large: 360,
};

function buildSearchLayout(size: ComponentSize): SearchSizeLayout {
  const control = CONTROL_SIZE_LAYOUT[size];
  return {
    defaultExpandedW: SEARCH_DEFAULT_EXPANDED_WIDTH[size],
    iconBox: SEARCH_ICON_BOX_PX[size],
    padX: SEARCH_PAD_X_PX[size],
    iconClass: control.icon,
    controlPad: control.controlPad,
    shellWCollapsed: SHELL_W_COLLAPSED[size],
    clearTap: SEARCH_CLEAR_TAP_PX[size],
    clearIconClass: control.chevronIcon,
    textGapClear: size === "small" ? 4 : 6,
  };
}

const SIZE_LAYOUT: Record<SearchInputSize, SearchSizeLayout> = {
  small: buildSearchLayout("small"),
  base: buildSearchLayout("base"),
  mid: buildSearchLayout("mid"),
  large: buildSearchLayout("large"),
};

export function resolveSearchLayout(size: ComponentSize): SearchSizeLayout {
  return SIZE_LAYOUT[size];
}

function parseCssLengthPx(raw: string, rootPx: number): number | undefined {
  const remMatch = /^([\d.]+)rem$/i.exec(raw);
  if (remMatch) return Number.parseFloat(remMatch[1]!) * rootPx;
  const pxMatch = /^([\d.]+)px$/i.exec(raw);
  if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  return undefined;
}

/** Border radius in px for expanded SearchInput — reads `--radius-value-*` from `:root`. */
export function readSearchExpandedRadiusPx(size: ComponentSize, rootPx = 16): number {
  const step = SEARCH_EXPANDED_RADIUS_STEP[size];
  if (typeof document !== "undefined") {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(SEARCH_EXPANDED_RADIUS_VALUE_VAR[step])
      .trim();
    const parsed = parseCssLengthPx(raw, rootPx);
    if (parsed != null) return parsed;
  }
  return rootPx * 0.5 * SEARCH_EXPANDED_RADIUS_FALLBACK_MULT[step];
}

export function searchInputGroupShellClass(segment: ButtonGroupSegment): string {
  return cn(
    buttonGroupRoundingClasses(segment),
    buttonGroupSegmentSurfaceClasses(segment),
  );
}

export function searchInputRootClass({
  size,
  variant,
  expanded,
  blocked,
  isGloss,
  groupSegment,
  shellHoverMotionClass,
  standardMotionClass,
  className,
  slotRoot,
}: {
  size: SearchInputSize;
  variant: SearchInputVariant;
  expanded: boolean;
  blocked: boolean;
  isGloss: boolean;
  groupSegment?: ButtonGroupSegment;
  shellHoverMotionClass?: string;
  standardMotionClass?: string | false | null;
  className?: string;
  slotRoot?: string;
}): string {
  const layout = resolveSearchLayout(size);
  const filledVariant: FieldShellFilledVariant =
    variant === "gloss" ? "default" : variant;

  return cn(
    groupSegment
      ? searchInputGroupShellClass(groupSegment)
      : expanded
        ? SEARCH_EXPANDED_ROUNDED_CLASS[size]
        : cn(SEARCH_INPUT_ROOT_COLLAPSED_ROUNDED_CLASS, layout.shellWCollapsed),
    SEARCH_INPUT_ROOT_BASE_CLASS,
    isGloss
      ? SEARCH_INPUT_ROOT_GLOSS_CLASS
      : cn(SEARCH_INPUT_ROOT_BORDER_CLASS, FIELD_SHELL_VARIANT_BG_CLASS[filledVariant]),
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss
      ? shellHoverMotionClass
      : fieldShellHoverClass(!blocked, "default", filledVariant),
    !isGloss && !blocked && standardMotionClass,
    expanded ? SEARCH_INPUT_CURSOR_TEXT_CLASS : "",
    !expanded && !blocked ? SEARCH_INPUT_CURSOR_POINTER_CLASS : "",
    blocked ? SEARCH_INPUT_BLOCKED_CLASS : "",
    slotRoot,
    className,
  );
}

export function searchInputIconWrapClass(slotIcon?: string): string {
  return cn(SEARCH_INPUT_ICON_WRAP_CLASS, slotIcon);
}

export function searchInputIconClass(layoutIconClass: string): string {
  return cn(SEARCH_INPUT_ICON_CLASS, layoutIconClass);
}

export function searchInputControlClass({
  controlPad,
  expanded,
  slotInput,
}: {
  controlPad: string;
  expanded: boolean;
  slotInput?: string;
}): string {
  return cn(
    SEARCH_INPUT_CONTROL_BASE_CLASS,
    controlPad,
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
    expanded
      ? SEARCH_INPUT_CONTROL_EXPANDED_CLASS
      : SEARCH_INPUT_CONTROL_COLLAPSED_CLASS,
    slotInput,
  );
}

export function searchInputClearClass(slotClear?: string): string {
  return cn(
    SEARCH_INPUT_CLEAR_BUTTON_CLASS,
    TEXT_COLOR_TRANSITION,
    hoverVariant(),
    slotClear,
  );
}

export function searchInputClearIconClass(layoutClearIconClass: string): string {
  return cn(SEARCH_INPUT_CLEAR_ICON_CLASS, layoutClearIconClass);
}
