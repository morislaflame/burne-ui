import type {
  FloatingAlign,
  PopoverContentProps,
  PopoverSide,
  PopoverSize,
  PopoverVariant,
} from "@/components/core/Popover";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { HTMLAttributes, PointerEventHandler, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

export type HoverCardSide = PopoverSide;
export type HoverCardSize = PopoverSize;
export type HoverCardVariant = PopoverVariant;

export const HOVER_CARD_OPEN_DELAY = 400;
export const HOVER_CARD_CLOSE_DELAY = 300;

export type HoverCardClassNames = {
  root?: string;
  trigger?: string;
  content?: string;
  /** Inner wrapper between the portal surface and the panel. */
  panelRelative?: string;
  panel?: string;
  arrow?: string;
  header?: string;
  /** `HoverCard.Title`. */
  title?: string;
  /** `HoverCard.Description`. */
  description?: string;
  body?: string;
};

export type HoverCardPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/**
 * `trigger` lives on the HoverCard scope.
 * `content`, `header`, `title`, `description`, `body`, `arrow` are the Popover portal scope.
 */
export type HoverCardMotion = {
  trigger?: HoverCardPartMotion;
  content?: HoverCardPartMotion;
  header?: HoverCardPartMotion;
  title?: HoverCardPartMotion;
  description?: HoverCardPartMotion;
  body?: HoverCardPartMotion;
  arrow?: HoverCardPartMotion;
};

export type HoverCardSchedule = {
  hold: () => void;
  release: () => void;
};

export type HoverCardHostContextValue = HoverCardSchedule & {
  motionController?: MotionController;
} & MotionStateHostProps;

export type HoverCardProps = {
  children?: ReactNode;
  /** Simple API anchor. Ignored when `HoverCard.Trigger` is a child. */
  trigger?: ReactNode;
  /** Simple API heading. */
  title?: ReactNode;
  /** Simple API supporting line. */
  description?: ReactNode;
  showArrow?: boolean;
  size?: HoverCardSize;
  variant?: HoverCardVariant;
  side?: HoverCardSide;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Delay before the card opens. Default `400`. */
  openDelay?: number;
  /** Delay before the card closes, so the pointer can cross the gap. Default `300`. */
  closeDelay?: number;
  shouldDismiss?: (target: Node) => boolean;
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<HoverCardClassNames>;
  /**
   * `trigger` is the HoverCard scope. The card slots play on `HoverCard.Content` (Popover portal).
   * `events` and `states` are siblings of the slots.
   */
  motion?: Prettify<MotionMapWithEvents<HoverCardMotion>>;
  /**
   * Handle for the card portal (`HoverCard.Content`). `play()` skips — there is no `root` slot.
   * Use `playSlot`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type UseHoverCardRootStateProps = Pick<
  HoverCardProps,
  "open" | "defaultOpen" | "onOpenChange" | "openDelay" | "closeDelay" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
>;

export type HoverCardTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  /** Merge props onto the single child. Default `true`. */
  asChild?: boolean;
  motion?: Prettify<HoverCardPartMotion>;
};

export type HoverCardContentProps = Pick<
  PopoverContentProps,
  "className" | "children" | "showArrow" | "offset" | "gap" | "matchAnchorWidth" | "align" | "unstyled" | "portalContainer"
> & {
  align?: FloatingAlign;
  motion?: Prettify<MotionMapWithEvents<HoverCardMotion>>;
  /**
   * Portal host. Overrides the root `motionController` for this card.
   * `play()` skips — use `playSlot`.
   */
  motionController?: MotionController;
  onPointerEnter?: PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: PointerEventHandler<HTMLDivElement>;
} & MotionStateHostProps;
