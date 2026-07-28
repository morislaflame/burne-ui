import type {
  ForwardedRef,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { IconPosition } from "@/components/core/utils/iconPosition";

export type BadgeVariant = "default" | "primary" | "outline" | "secondary" | "gloss";

export type BadgeStatus = "default" | "danger" | "success" | "info" | "warning";

export type BadgeSize = "small" | "base" | "mid" | "large";

export type BadgePlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export type BadgeIconPosition = IconPosition;

export type BadgeInlineIconPosition = "inline-start" | "inline-end";

export type BadgeClassNames = {
  root?: string;
  text?: string;
  iconOnly?: string;
  dot?: string;
  anchor?: string;
};

export type BadgeLayoutKind = "dot" | "iconOnly" | "text";

export type BadgeLiftContextValue = {
  registerLiftTarget: (el: HTMLElement | null) => void;
  anchorRef: RefObject<HTMLDivElement | null>;
  anchorCommitGen: number;
  hoverLift: boolean;
};

export type BadgeShellProps = {
  setMergedRef: Ref<HTMLSpanElement>;
  splitLift: boolean;
  placementClass: string;
  splitLiftMotionCls: string;
  selfLiftMotionCls: string;
  isDirectAnchorChild: boolean;
  isGloss: boolean;
  innerLiftRef: Ref<HTMLSpanElement>;
  pointerHandlers: {
    onPointerOver: (e: React.PointerEvent<HTMLSpanElement>) => void;
    onPointerOut: (e: React.PointerEvent<HTMLSpanElement>) => void;
  };
  rest: HTMLAttributes<HTMLSpanElement>;
  className: string;
  dataIcon?: string;
  children: ReactNode;
  withA11y?: boolean;
};

export type BadgeDotShellProps = Omit<
  BadgeShellProps,
  "children" | "className" | "withA11y" | "dataIcon"
>;

export type BadgeTextShellProps = Omit<
  BadgeShellProps,
  "children" | "className" | "withA11y"
>;

export type BadgeDotViewProps = {
  size: BadgeSize;
  variant: BadgeVariant;
  status: BadgeStatus;
  shell: BadgeDotShellProps;
  className: string;
  rest: HTMLAttributes<HTMLSpanElement>;
};

export type BadgeIconOnlyViewProps = {
  size: BadgeSize;
  surfaceClass: string;
  shell: BadgeDotShellProps;
  className: string;
  rest: HTMLAttributes<HTMLSpanElement>;
  iconOnlyBody: ReactNode;
};

export type BadgeTextViewProps = {
  size: BadgeSize;
  surfaceClass: string;
  shell: BadgeTextShellProps;
  className: string;
  rest: HTMLAttributes<HTMLSpanElement>;
  bodyContent: ReactNode;
  dataIcon?: string;
};

export type ResolveBadgeBodyProps = {
  size: BadgeSize;
  children?: ReactNode;
  icon?: ReactNode;
  iconOnly: boolean;
  iconPosition: BadgeIconPosition;
  inlineIconMode: boolean;
  meaningChild: boolean;
  dot: boolean;
};

export type ResolvedBadgeBody = {
  layoutKind: BadgeLayoutKind;
  bodyContent: ReactNode;
  iconOnlyBody: ReactNode;
  dataIcon: BadgeIconPosition | undefined;
};

export type BadgeAnchorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  classNames?: Prettify<BadgeClassNames>;
  /**
   * Slightly increase (GSAP) the direct child `Badge` on hover.
   * @default true
   */
  hoverLift?: boolean;
};

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  size?: BadgeSize;
  icon?: ReactNode;
  iconPosition?: BadgeIconPosition;
  iconOnly?: boolean;
  dot?: boolean;
  placement?: BadgePlacement;
  classNames?: Prettify<BadgeClassNames>;
  children?: ReactNode;
  /**
   * Lift and shadow enhancement on hover (like `Alert`): `sm` at rest, `md` on hover.
   * Does not duplicate if the badge is a direct child of `Badge.Anchor` with `hoverLift`: there is a lift on the anchor.
   * @default true
   */
  hoverLift?: boolean;
};

export type BadgeInlineChildProps = {
  node: ReactNode;
  size: BadgeSize;
};

export type UseBadgeRootStateProps = {
  variant: BadgeVariant;
  status: BadgeStatus;
  size: BadgeSize;
  children?: ReactNode;
  icon?: ReactNode;
  iconOnly: boolean;
  iconPosition: BadgeIconPosition;
  dot: boolean;
  placement?: BadgePlacement;
};

export type BadgeAnimationsSyncDeps = {
  meaningChild: boolean;
  icon: ReactNode;
  dot: boolean;
  iconOnly: boolean;
  children: ReactNode;
};

export type UseBadgeAnimationsProps = {
  variant: BadgeVariant;
  hoverLift?: boolean;
  forwardedRef: ForwardedRef<HTMLSpanElement>;
  isDirectAnchorChild: boolean;
  placement?: BadgePlacement;
  onPointerOver?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
  syncDeps: BadgeAnimationsSyncDeps;
};

export type BadgeLiftTargetProviderProps = {
  value: BadgeLiftContextValue;
  children: ReactNode;
};

export type BadgeDirectAnchorChildProviderProps = {
  children: ReactNode;
};

export type BadgeClassNamesProviderProps = {
  classNames?: Prettify<BadgeClassNames>;
  children: ReactNode;
};
