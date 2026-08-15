import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ShadowLevel } from "@/tokens/shadows";
import type { MotionValue } from "@/components/core/utils/slotMotion";
import type { CardSize } from "./cardStyles";

export type { CardSize } from "./cardStyles";

export type CardVariant = "default" | "outline" | "secondary" | "gloss";

export type CardPressEvent =
  | MouseEvent<HTMLElement>
  | KeyboardEvent<HTMLElement>;

export type CardClassNames = {
  root?: string;
  glossContent?: string;
  content?: string;
  header?: string;
  headingBlock?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
};

export type CardPointerMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
};

export type CardRootMotion = CardPointerMotion & {
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type CardPartMotion = CardPointerMotion;

export type CardMotion = {
  root?: CardRootMotion;
  title?: CardPartMotion;
  description?: CardPartMotion;
  header?: CardPartMotion;
  headingBlock?: CardPartMotion;
  body?: CardPartMotion;
  footer?: CardPartMotion;
};

export type CardProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "onKeyDown"
> & {
  variant?: CardVariant;
  /** Radius, padding and title/description type scale. @default "base" */
  size?: CardSize;
  /**
   * Rest shadow size (passive CSS or pressable `--el-shadow` family).
   * @default "base"
   */
  shadow?: ShadowLevel;
  /**
   * Interactive card: hover-lift, shadow and squeeze on press (like a button).
   * Ripple is not built-in — if needed, pass `<Ripple />` as the first child and wrap the rest of the content in a layer with `relative z-[1]`.
   * Do not place other buttons/links inside without `stopPropagation` on their click — otherwise the `onPress` of the card will also trigger.
   */
  pressable?: boolean;
  /** Called when activated (`click` or Enter / Space on the root). Only meaningful when `pressable`. */
  onPress?: (event: CardPressEvent) => void;
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
  classNames?: Prettify<CardClassNames>;
  /**
   * Per-slot motion (`root`, `title`, `description`, `header`, `headingBlock`, `body`, `footer`).
   * Pressable defaults: second-level hover lift + squeeze (gloss recipes when gloss).
   */
  motion?: Prettify<CardMotion>;
};

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CardPartMotion>;
};
export type CardHeadingBlockProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CardPartMotion>;
};
export type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CardPartMotion>;
};
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  motion?: Prettify<CardPartMotion>;
};
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  motion?: Prettify<CardPartMotion>;
};
export type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<CardPartMotion>;
};

export type CardProviderProps = {
  classNames?: Prettify<CardClassNames>;
  size: CardSize;
  children: ReactNode;
};

export type UseCardRootStateProps = Pick<
  CardProps,
  | "variant"
  | "size"
  | "pressable"
  | "className"
  | "onClick"
  | "onKeyDown"
  | "onPointerDown"
>;

export type UseCardAnimationsProps = {
  pressable: boolean;
  isGloss: boolean;
  shadow?: ShadowLevel;
  motion?: CardMotion;
  onPress?: (event: CardPressEvent) => void;
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
  onPointerDown?: HTMLAttributes<HTMLElement>["onPointerDown"];
  onPointerUp?: HTMLAttributes<HTMLElement>["onPointerUp"];
  onPointerOver?: HTMLAttributes<HTMLElement>["onPointerOver"];
  onPointerOut?: HTMLAttributes<HTMLElement>["onPointerOut"];
  hoverPointerInsideRef: React.RefObject<boolean>;
  forwardedRef: React.ForwardedRef<HTMLElement>;
};

export type CardRootShellProps = {
  pressable: boolean;
  isGloss: boolean;
  renderAsButton: boolean;
  glossPanelClass: string;
  rootClassName: string;
  setRootRef: (node: HTMLElement | null) => void;
  rest: HTMLAttributes<HTMLElement>;
  children: ReactNode;
  /** Merged handlers (user prop + animation). Safe to use in all branches. */
  onPointerOver?: HTMLAttributes<HTMLElement>["onPointerOver"];
  onPointerOut?: HTMLAttributes<HTMLElement>["onPointerOut"];
  onPointerDown?: HTMLAttributes<HTMLElement>["onPointerDown"];
  onPointerUp?: HTMLAttributes<HTMLElement>["onPointerUp"];
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
};
