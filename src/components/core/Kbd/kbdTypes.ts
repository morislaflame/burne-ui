import type {
  ForwardedRef,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

export type KbdVariant = "default" | "primary" | "outline" | "secondary" | "gloss";

export type KbdSize = "small" | "base" | "mid" | "large";

export type KbdClassNames = {
  root?: string;
  group?: string;
  separator?: string;
};

export type KbdProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  variant?: KbdVariant;
  size?: KbdSize;
  classNames?: KbdClassNames;
  children?: ReactNode;
  /**
   * Lift and shadow on hover (2nd level: sm → md), like `Badge`.
   * @default true
   */
  hoverLift?: boolean;
};

export type KbdGroupProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  classNames?: KbdClassNames;
  /**
   * Separator between keys. Pass `null` to hide.
   * @default "+"
   */
  separator?: ReactNode | null;
  children?: ReactNode;
};

export type KbdClassNamesProviderProps = {
  classNames?: KbdClassNames;
  children: ReactNode;
};

export type UseKbdRootStateProps = {
  variant: KbdVariant;
  size: KbdSize;
  className?: string;
  classNames?: KbdClassNames;
};

export type UseKbdAnimationsProps = {
  variant: KbdVariant;
  hoverLift?: boolean;
  forwardedRef: ForwardedRef<HTMLElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
};
