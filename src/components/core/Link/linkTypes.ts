import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  PointerEvent,
  ReactNode,
} from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import type { IconPosition } from "@/components/core/utils/iconPosition";

export type LinkSize = ComponentSize;

export type LinkIconPosition = IconPosition;

export type LinkClassNames = {
  /** Root `<a>`. */
  root?: string;
  /** Link text (`Text`). */
  text?: string;
  /** Start icon wrapper. */
  iconStart?: string;
  /** End icon wrapper. */
  iconEnd?: string;
};

type LinkSharedProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href"
> & {
  children?: ReactNode;
  size?: LinkSize;
  underline?: boolean;
  icon?: ReactNode;
  /** @default "start" */
  iconPosition?: IconPosition;
  showDefaultIcon?: boolean;
  defaultIconPosition?: LinkIconPosition;
  classNames?: LinkClassNames;
};

export type LinkProps =
  | (LinkSharedProps & {
      /** Merge Link styles onto the single child (router `Link`, custom `<a>`). */
      asChild: true;
      href?: string;
    })
  | (LinkSharedProps & {
      asChild?: false;
      href: string;
    });

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
  LinkSharedProps,
  | "size"
  | "underline"
  | "icon"
  | "iconPosition"
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

export type LinkBodyContentProps = {
  size: LinkSize;
  underline: boolean;
  textVariant: import("@/components/core/Text").TextVariant;
  textChildren: ReactNode;
  startIcon: ReactNode | null;
  endIcon: ReactNode | null;
  startIconMuted: boolean;
  endIconMuted: boolean;
  usesDefaultAtStart: boolean;
  usesDefaultAtEnd: boolean;
};

export type LinkAnchorBodyProps = LinkBodyContentProps & {
  href: string;
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
