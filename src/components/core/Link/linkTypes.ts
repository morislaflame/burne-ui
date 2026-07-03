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
  /** Anchor `<a>`. */
  anchor?: string;
  /** Link text (`Text`). */
  text?: string;
  /** Left icon wrapper. */
  iconStart?: string;
  /** Right icon wrapper. */
  iconEnd?: string;
};

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  href: string;
  children?: ReactNode;
  size?: LinkSize;
  underline?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showDefaultIcon?: boolean;
  defaultIconPosition?: LinkIconPosition;
  classNames?: LinkClassNames;
};

export type LinkIconProps = {
  position?: LinkIconPosition;
  children?: ReactNode;
};

export type ResolvedLinkIconSlot = {
  node: ReactNode | "default";
  muted: boolean;
};

export type ResolvedLinkCompoundBody = {
  textChildren: ReactNode;
  startIcon?: ResolvedLinkIconSlot;
  endIcon?: ResolvedLinkIconSlot;
};

export type UseLinkRootStateProps = Pick<
  LinkProps,
  | "size"
  | "underline"
  | "leftIcon"
  | "rightIcon"
  | "showDefaultIcon"
  | "defaultIconPosition"
  | "children"
>;

export type LinkIconPlacement = {
  usesDefaultIcon: boolean;
  defaultIconAtStart: boolean;
  defaultIconAtEnd: boolean;
};

export type LinkClassNamesProviderProps = {
  classNames?: LinkClassNames;
  children: ReactNode;
};

export type LinkAnchorBodyProps = {
  href: string;
  size: LinkSize;
  underline: boolean;
  textVariant: import("@/components/core/Text").TextVariant;
  textChildren: ReactNode;
  startIcon: ReactNode | null;
  endIcon: ReactNode | null;
  startIconMuted: boolean;
  endIconMuted: boolean;
  className?: string;
  setAnchorRef: (node: HTMLAnchorElement | null) => void;
  handlePointerEnter: (event: PointerEvent<HTMLAnchorElement>) => void;
  handlePointerLeave: (event: PointerEvent<HTMLAnchorElement>) => void;
  handlePointerDown: (event: PointerEvent<HTMLAnchorElement>) => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "className">;

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
