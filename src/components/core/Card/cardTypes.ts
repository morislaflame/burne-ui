import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";

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

export type CardProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "onKeyDown"
> & {
  variant?: CardVariant;
  /** Radius, padding and title/description type scale. @default "base" */
  size?: CardSize;
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
  classNames?: CardClassNames;
  /**
   * Enable GSAP interactions (hover lift, press squeeze).
   * Set to `false` to disable all motion while keeping `pressable` semantics (accessible activation still works).
   * @default true
   */
  animated?: boolean;
};

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardHeadingBlockProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export type CardProviderProps = {
  classNames?: CardClassNames;
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
  animated: boolean;
  onPress?: (event: CardPressEvent) => void;
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
  onPointerDown?: HTMLAttributes<HTMLElement>["onPointerDown"];
  onPointerOver?: HTMLAttributes<HTMLElement>["onPointerOver"];
  onPointerOut?: HTMLAttributes<HTMLElement>["onPointerOut"];
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
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
};
