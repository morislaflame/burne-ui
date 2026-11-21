import type {
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { IconPosition } from "@/components/core/utils/iconPosition";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
export const KIT_DISCLOSURE_VARIANTS = ["default", "outline", "secondary", "card", "ghost"] as const;
export type KitDisclosureVariant = (typeof KIT_DISCLOSURE_VARIANTS)[number];
export type DisclosureVariant = KitDisclosureVariant | (string & {});
 
export type DisclosureSize = ComponentSize;
 
export type DisclosureClassNames = {
  root?: string;
  trigger?: string;
  titleLift?: string;
  title?: string;
  icon?: string;
  chevron?: string;
  contentShell?: string;
  contentWrap?: string;
  content?: string;
  handle?: string;
  group?: string;
};
 
export type DisclosureLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};
 
export type DisclosureTitleLiftMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};
 
/**
 * Per-slot motion. DOM slots: `titleLift` (`classNames.titleLift`), `title`, `chevron`,
 * `contentShell`, `icon`, `content` (Content `<section>`). `panelInner` is an internal height-recipe target, not a public slot.
 * Handle-drag is kit-internal (not a slot). `contentWrap` is layout-only.
 */
export type DisclosureMotion = {
  /** Card shell. `hoverLiftFirstLevel` with scale locked at 1. */
  root?: DisclosureLifecycleMotion;
  titleLift?: DisclosureTitleLiftMotion;
  title?: DisclosureLifecycleMotion;
  chevron?: DisclosureLifecycleMotion;
  contentShell?: DisclosureLifecycleMotion;
  icon?: DisclosureLifecycleMotion;
  content?: DisclosureLifecycleMotion;
};
 
export type DisclosureGroupContextValue = {
  selectionMode: "single" | "multiple";
  openValue: string | null;
  values: string[];
  setOpenValue: (val: string | null) => void;
  setItemOpen: (id: string, open: boolean) => void;
  variant: DisclosureVariant;
  size: DisclosureSize;
  separated: boolean;
  motion?: DisclosureMotion;
};
 
export type DisclosureContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerId: string;
  panelId: string;
  variant: DisclosureVariant;
  size: DisclosureSize;
  disabled: boolean;
  chevronPosition: IconPosition;
  dragHandle: boolean;
  shellRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  chevronRef: RefObject<HTMLSpanElement | null>;
  skipContentAnimRef: RefObject<boolean>;
};
 
export type DisclosureClassNamesProviderProps = {
  classNames?: Prettify<DisclosureClassNames>;
  children: ReactNode;
};
 
export type DisclosureProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  disabled?: boolean;
  chevronPosition?: IconPosition;
  dragHandle?: boolean;
  classNames?: Prettify<DisclosureClassNames>;
  /**
   * Per-slot motion: `titleLift` (hover/press), `title` (enter/leave broadcast), `chevron` (enter/leave rotate),
   * `contentShell` (height), `icon` / `content` (broadcast on open). Group `motion` is merged into each item.
   * There is no `root` slot — `play()` skips; use `playSlot("titleLift")` / `playAll`.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<DisclosureMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this Disclosure scope. `Disclosure.Group` has no scope — pass a handle per item.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type DisclosureGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** `single` keeps one item open. `multiple` uses `values`. Default `single`. */
  selectionMode?: "single" | "multiple";
  separated?: boolean;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  classNames?: Prettify<DisclosureClassNames>;
  /** Merged into each item’s slot map (same as Accordion). */
  motion?: Prettify<DisclosureMotion>;
};
 
export type DisclosureTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  /** Leading indicator icon (left of title). */
  icon?: ReactNode;
  /** Expand chevron; `null` hides the default chevron. */
  chevron?: ReactNode | null;
  asChild?: boolean;
  motion?: Prettify<DisclosureTitleLiftMotion>;
};
 
export type DisclosureIconProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<DisclosureLifecycleMotion>;
};
export type DisclosureChevronProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<DisclosureLifecycleMotion>;
};
 
export type DisclosureHandleProps = HTMLAttributes<HTMLDivElement>;
export type DisclosureContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  motion?: Prettify<DisclosureLifecycleMotion>;
};
 
export type UseDisclosureRootStateProps = Omit<
  DisclosureProps,
  "className" | "classNames"
>;
 
export type UseDisclosureGroupRootStateProps = Omit<
  DisclosureGroupProps,
  "className" | "classNames"
>;
 
export type UseDisclosureTriggerMotionProps = {
  open: boolean;
  disabled: boolean;
  setOpen: (value: boolean) => void;
  chevronRef: RefObject<HTMLSpanElement | null>;
  skipContentAnimRef: RefObject<boolean>;
  forwardedRef: Ref<HTMLButtonElement>;
  motion?: DisclosureTitleLiftMotion;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
};
 
export type UseDisclosureContentMotionProps = {
  open: boolean;
  motion?: DisclosureLifecycleMotion;
  skipContentAnimRef: RefObject<boolean>;
  shellRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
};
 