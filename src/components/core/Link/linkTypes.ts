import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { MotionValue } from "@/components/core/utils/slotMotion";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { IconPosition } from "@/components/core/utils/iconPosition";

export type LinkSize = ComponentSize;

export type LinkIconPos = IconPosition;

export type LinkClassNames = {
  /** Root `<a>`. */
  root?: string;
  /** Link text (`Text`). */
  text?: string;
  /** Icon wrapper (both start and end positions). */
  icon?: string;
};

export type LinkPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type LinkMotion = {
  root?: LinkPartMotion;
  text?: LinkPartMotion;
  icon?: LinkPartMotion;
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
  defaultIconPosition?: LinkIconPos;
  classNames?: Prettify<LinkClassNames>;
  /** Per-slot motion (`root`, `text`, `icon`). No hover shadow. */
  motion?: Prettify<LinkMotion>;
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
  iconPosition?: LinkIconPos;
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
  classNames?: Prettify<LinkClassNames>;
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
  pointerHandlers: {
    onPointerOver: (event: PointerEvent<HTMLAnchorElement>) => void;
    onPointerOut: (event: PointerEvent<HTMLAnchorElement>) => void;
    onPointerDown: (event: PointerEvent<HTMLAnchorElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLAnchorElement>) => void;
  };
  handleKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => void;
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
  onPointerOver?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerOut?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerDown?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
};
