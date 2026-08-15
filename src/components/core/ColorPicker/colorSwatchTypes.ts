import type { ButtonHTMLAttributes, KeyboardEvent, MutableRefObject, PointerEvent } from "react";
import type { Prettify } from "@/utils/prettify";

import type { MotionValue } from "@/components/core/utils/slotMotion";

export type ColorSwatchSize = "small" | "base" | "mid" | "large";
export type ColorSwatchShape = "square" | "circle" | "rounded";

export type ColorSwatchPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type ColorSwatchMotion = {
  root?: ColorSwatchPartMotion;
};

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
  motion?: Prettify<ColorSwatchMotion>;
};

export type UseColorSwatchAnimationsProps = {
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  motion?: ColorSwatchMotion;
  hoverPointerInsideRef: MutableRefObject<boolean>;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOver?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerOut?: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
};
