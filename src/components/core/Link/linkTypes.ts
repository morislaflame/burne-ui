import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  PointerEvent,
  ReactNode,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type LinkSize = ComponentSize;

export type LinkIconPosition = "start" | "end";

export type LinkClassNames = {
  /** Обёртка lift-motion (`<span>` вокруг якоря). */
  motion?: string;
  /** Якорь `<a>`. */
  anchor?: string;
  /** Текст ссылки (`Text`). */
  text?: string;
  /** Обёртка иконки слева. */
  iconStart?: string;
  /** Обёртка иконки справа. */
  iconEnd?: string;
};

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  href: string;
  children: ReactNode;
  size?: LinkSize;
  underline?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showDefaultIcon?: boolean;
  defaultIconPosition?: LinkIconPosition;
  classNames?: LinkClassNames;
};

export type LinkClassNamesProviderProps = {
  classNames?: LinkClassNames;
  children: ReactNode;
};

export type UseLinkRootStateProps = Pick<
  LinkProps,
  | "size"
  | "underline"
  | "leftIcon"
  | "rightIcon"
  | "showDefaultIcon"
  | "defaultIconPosition"
>;

export type LinkIconPlacement = {
  usesDefaultIcon: boolean;
  defaultIconAtStart: boolean;
  defaultIconAtEnd: boolean;
};

export type LinkIconSlotProps = {
  children: ReactNode;
  size: LinkSize;
  muted?: boolean;
  slotClass?: string;
};

export type UseLinkAnimationsProps = {
  forwardedRef: ForwardedRef<HTMLAnchorElement>;
  onPointerEnter?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerDown?: (event: PointerEvent<HTMLAnchorElement>) => void;
};
