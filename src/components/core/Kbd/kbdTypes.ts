import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type {
  ForwardedRef,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";

export type KbdVariant = "default" | "primary" | "outline" | "secondary" | "gloss";

export type KbdSize = "small" | "base" | "mid" | "large";

export type KbdClassNames = {
  root?: string;
  text?: string;
  group?: string;
  /** Separator between keys in `Kbd.Group` (prop `separator`, not a compound part). */
  separator?: string;
};

export type KbdPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  enter?: MotionValue;
};

export type KbdMotion = {
  root?: KbdPartMotion;
  text?: KbdPartMotion;
  group?: KbdPartMotion;
};

export type KbdProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  variant?: KbdVariant;
  size?: KbdSize;
  classNames?: Prettify<KbdClassNames>;
  children?: ReactNode;
  /**
   * Hover lift + stronger shadow in the same family (like `Badge`). Rest elevation stays when `false`.
   * Shorthand for `motion.root.hoverIn/Out: false`. An explicit `motion.root.hoverIn` wins.
   * @default true
   */
  hoverLift?: boolean;
  /**
   * Per-slot motion (`root`, `text`, `group`).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<KbdMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type KbdGroupProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  classNames?: Prettify<KbdClassNames>;
  /**
   * Separator between keys. Pass `null` to hide.
   * @default "+"
   */
  separator?: ReactNode | null;
  children?: ReactNode;
  /**
   * Part motion for the wrapping `<span>` (`group` slot).
   * Standalone Group (no Kbd ancestor) creates its own scope when this or `motionController` is set.
   */
  motion?: Prettify<KbdPartMotion>;
  /**
   * Deferred handle for a standalone Group (no parent Kbd). Inside `<Kbd>` use the Root handle.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type KbdClassNamesProviderProps = {
  classNames?: Prettify<KbdClassNames>;
  children: ReactNode;
};

export type UseKbdRootStateProps = {
  variant: KbdVariant;
  size: KbdSize;
  className?: string;
  classNames?: Prettify<KbdClassNames>;
};

export type UseKbdAnimationsProps = {
  variant: KbdVariant;
  hoverLift?: boolean;
  motion?: KbdMotion;
  forwardedRef: ForwardedRef<HTMLElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
};

export type KbdTextProps = HTMLAttributes<HTMLSpanElement> & {
  size: KbdSize;
  motion?: Prettify<KbdPartMotion>;
};
