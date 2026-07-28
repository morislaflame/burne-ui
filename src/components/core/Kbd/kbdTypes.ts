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

export type KbdProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  variant?: KbdVariant;
  size?: KbdSize;
  classNames?: Prettify<KbdClassNames>;
  children?: ReactNode;
  /**
   * Lift and shadow on hover (2nd level: sm → md), like `Badge`.
   * @default true
   */
  hoverLift?: boolean;
};

export type KbdGroupProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  classNames?: Prettify<KbdClassNames>;
  /**
   * Separator between keys. Pass `null` to hide.
   * @default "+"
   */
  separator?: ReactNode | null;
  children?: ReactNode;
};

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
  forwardedRef: ForwardedRef<HTMLElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
};
