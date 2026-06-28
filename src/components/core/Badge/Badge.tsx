import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { Text, type TextVariant } from "@/components/core/Text";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import {
  SHADOW_LIFT_MOTION_CLASS,
  useSecondLevelShadow,
  useSecondLevelShadowContainer,
} from "@/components/core/utils/useShadowMotion";
import { initElementShadow, shadowSm } from "@/components/core/utils/hoverInteractiveLift";
import {
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { cn } from "@/utils/cn";

import "../utils/glossInteractive.css";

export type BadgeVariant = "default" | "primary" | "outline" | "secondary" | "gloss";

export type BadgeStatus = "default" | "danger" | "success" | "info" | "warning";

const BADGE_VARIANT_SURFACE: Record<Exclude<BadgeVariant, "gloss">, string> = {
  default: "bg-surface border-token text-foreground",
  primary: "bg-primary border-token text-primary-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

const BADGE_STATUS_TEXT: Record<Exclude<BadgeStatus, "default">, string> = {
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

const BADGE_STATUS_SURFACE_TINT: Record<Exclude<BadgeStatus, "default">, string> = {
  danger: "bg-surface-tint-danger border-token",
  success: "bg-surface-tint-success border-token",
  info: "bg-surface-tint-info border-token",
  warning: "bg-surface-tint-warning border-token",
};

const BADGE_STATUS_FILL: Record<Exclude<BadgeStatus, "default">, string> = {
  danger: "bg-danger border border-transparent text-danger-foreground",
  success: "bg-success border border-transparent text-success-foreground",
  info: "bg-info border border-transparent text-info-foreground",
  warning: "bg-warning border border-transparent text-warning-foreground",
};

const BADGE_STATUS_OUTLINE_BORDER: Record<Exclude<BadgeStatus, "default">, string> = {
  danger: "border-token-danger",
  success: "border-token-success",
  info: "border-token-info",
  warning: "border-token-warning",
};

const BADGE_DOT_FILL: Record<Exclude<BadgeVariant, "gloss"> | Exclude<BadgeStatus, "default">, string> = {
  default: "bg-foreground",
  primary: "bg-primary",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary",
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

function dotFillClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (variant === "gloss") {
    if (status !== "default") return BADGE_DOT_FILL[status];
    return BADGE_DOT_FILL.default;
  }
  if (status !== "default") return BADGE_DOT_FILL[status];
  return BADGE_DOT_FILL[variant];
}

export type BadgeSize = "small" | "base" | "mid" | "large";

export type BadgePlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

const BADGE_ANCHOR_PLACEMENT: Record<BadgePlacement, string> = {
  "top-right":
    "absolute right-0 top-0 z-10 translate-x-[38%] -translate-y-[38%]",
  "top-left":
    "absolute left-0 top-0 z-10 -translate-x-[38%] -translate-y-[38%]",
  "bottom-right":
    "absolute bottom-0 right-0 z-10 translate-x-[38%] translate-y-[38%]",
  "bottom-left":
    "absolute bottom-0 left-0 z-10 -translate-x-[38%] translate-y-[38%]",
};

const BADGE_TEXT_ROW: Record<BadgeSize, string> = {
  small: "gap-xsmall px-small py-xsmall",
  base: "gap-xsmall px-base py-xsmall",
  mid: "gap-xsmall px-plus py-xsmall",
  large: "gap-small px-plus py-xsmall",
};

const BADGE_SQUARE_MIN: Record<BadgeSize, string> = {
  small: "min-h-3 min-w-3",
  base: "min-h-4 min-w-4",
  mid: "min-h-4 min-w-4",
  large: "min-h-5 min-w-5",
};


const BADGE_TEXT_VARIANT: Record<BadgeSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "small",
  large: "base",
};

const BADGE_ICON_ONLY: Record<BadgeSize, string> = {
  small: "shrink-0 p-xsmall [&_svg]:icon-small",
  base: "shrink-0 p-small [&_svg]:icon-base",
  mid: "shrink-0 p-base [&_svg]:icon-base",
  large: "shrink-0 p-plus [&_svg]:icon-large",
};

const BADGE_DOT_DIM: Record<BadgeSize, string> = {
  small: "icon-small shrink-0 p-0",
  base: "icon-small shrink-0 p-0",
  mid: "icon-base shrink-0 p-0",
  large: "icon-large shrink-0 p-0",
};

const BADGE_INLINE_SVG_SIZE: Record<BadgeSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-small",
  mid: "[&_svg]:icon-base",
  large: "[&_svg]:icon-large",
};

export type BadgeIconPosition = "start" | "end";

export type BadgeInlineIconPosition = "inline-start" | "inline-end";


function readBadgeInlineIconPosition(el: ReactElement): BadgeInlineIconPosition | null {
  const raw = (el.props as { "data-icon"?: string })["data-icon"];
  if (raw === "inline-start" || raw === "start") return "inline-start";
  if (raw === "inline-end" || raw === "end") return "inline-end";
  return null;
}

function isInlineIconChild(node: ReactNode): node is ReactElement {
  return isValidElement(node) && readBadgeInlineIconPosition(node) != null;
}

function hasInlineIconChildren(children: ReactNode): boolean {
  return Children.toArray(children).some(isInlineIconChild);
}

function isBadgeTextContent(node: ReactNode): boolean {
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (isValidElement(node)) return readBadgeInlineIconPosition(node) == null;
  return false;
}

function hasBadgeTextContent(children: ReactNode): boolean {
  return Children.toArray(children).some(isBadgeTextContent);
}

function ensureDecorativeIcon(el: ReactElement): ReactElement {
  const props = el.props as { "aria-hidden"?: boolean; "aria-label"?: string };
  if (props["aria-hidden"] === true || props["aria-label"]) return el;
  return cloneElement(el, { "aria-hidden": true } as Record<string, unknown>);
}

function BadgeInlineChild({ node, size }: { node: ReactNode; size: BadgeSize }) {
  if (node == null || node === false) return null;

  if (typeof node === "string") {
    const trimmed = node.trim();
    if (!trimmed) return null;
    return (
      <Text
        as="span"
        variant={BADGE_TEXT_VARIANT[size]}
        inheritColor
      >
        {node}
      </Text>
    );
  }

  if (typeof node === "number") {
    return (
      <Text
        as="span"
        variant={BADGE_TEXT_VARIANT[size]}
        inheritColor
      >
        {node}
      </Text>
    );
  }

  if (isValidElement(node)) {
    if (readBadgeInlineIconPosition(node)) {
      return (
        <span
          className={cn("inline-flex shrink-0 [&_svg]:shrink-0", BADGE_INLINE_SVG_SIZE[size])}
        >
          {ensureDecorativeIcon(node)}
        </span>
      );
    }
    return node;
  }

  return null;
}

function renderBadgeInlineChildren(children: ReactNode, size: BadgeSize): ReactNode {
  return Children.map(Children.toArray(children), (child, index) => (
    <Fragment key={index}>
      <BadgeInlineChild node={child} size={size} />
    </Fragment>
  ));
}

function badgeHasAccessibleName(props: HTMLAttributes<HTMLSpanElement>): boolean {
  return (
    typeof props["aria-label"] === "string" ||
    typeof props["aria-labelledby"] === "string"
  );
}

/** Dot/icon-only badges use `aria-label` on a `<span>` — `role="img"` is required. */
function badgeRootA11yProps(
  props: HTMLAttributes<HTMLSpanElement>,
): Pick<HTMLAttributes<HTMLSpanElement>, "aria-hidden" | "role"> {
  if (badgeHasAccessibleName(props)) {
    return { role: "img" };
  }
  return { "aria-hidden": true, role: "presentation" };
}

function badgeSurfaceClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (variant === "gloss") {
    return cn(
      "gloss-panel border-0 text-foreground",
      status !== "default" ? BADGE_STATUS_TEXT[status] : "",
    );
  }

  if (status === "default") return BADGE_VARIANT_SURFACE[variant];

  switch (variant) {
    case "default":
      return cn(BADGE_STATUS_SURFACE_TINT[status], BADGE_STATUS_TEXT[status]);
    case "primary":
      return BADGE_STATUS_FILL[status];
    case "outline":
      return cn("bg-transparent", BADGE_STATUS_OUTLINE_BORDER[status], BADGE_STATUS_TEXT[status]);
    case "secondary":
      return cn("bg-secondary border-token", BADGE_STATUS_TEXT[status]);
  }
}

type BadgeLiftContextValue = {
  registerLiftTarget: (el: HTMLElement | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  anchorCommitGen: number;
  hoverLift: boolean;
};

const BadgeLiftTargetContext = createContext<BadgeLiftContextValue | null>(null);

const BadgeDirectAnchorChildContext = createContext(false);

function isBadgeElement(child: ReactElement): boolean {
  return child.type === BadgeRoot;
}

function BadgeDirectAnchorChildProvider({ children }: { children: ReactNode }) {
  return (
    <BadgeDirectAnchorChildContext.Provider value={true}>
      {children}
    </BadgeDirectAnchorChildContext.Provider>
  );
}

export type BadgeAnchorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  /**
   * Slightly increase (GSAP) the direct child `Badge` on hover.
   * @default true
   */
  hoverLift?: boolean;
};

export const BadgeAnchor = forwardRef<HTMLDivElement, BadgeAnchorProps>(function BadgeAnchor(
  {
    className = "",
    children,
    hoverLift = true,
    onPointerOver: onPointerOverFromProps,
    onPointerOut: onPointerOutFromProps,
    ...rest
  },
  ref,
) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const liftedRef = useRef<HTMLElement | null>(null);
  const [anchorCommitGen] = useState(1);

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      anchorRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const registerLiftTarget = useCallback((el: HTMLElement | null) => {
    liftedRef.current = el;
    if (el && hoverLift) initElementShadow(el, shadowSm());
  }, [hoverLift]);

  const ctx = useMemo(
    () => ({ registerLiftTarget, anchorRef, anchorCommitGen, hoverLift }),
    [registerLiftTarget, anchorCommitGen, hoverLift],
  );

  const anchorLiftShadow = useSecondLevelShadowContainer(liftedRef, hoverLift, {
    liftScale: getMotionConfig().badgeAnchorHoverLiftScale,
  });

  return (
    <BadgeLiftTargetContext.Provider value={ctx}>
      <div
        ref={setMergedRef}
        data-badge-anchor
        className={cn(
          "relative isolate inline-grid w-fit shrink-0 [&>*]:col-start-1 [&>*]:row-start-1",
          className,
        )}
        onPointerOver={(e) => {
          onPointerOverFromProps?.(e);
          if (!e.defaultPrevented) anchorLiftShadow.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOutFromProps?.(e);
          anchorLiftShadow.onPointerOut(e);
        }}
        {...rest}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child;
          if (isBadgeElement(child)) {
            return (
              <BadgeDirectAnchorChildProvider key={child.key ?? `badge-anchor-child-${index}`}>
                {child}
              </BadgeDirectAnchorChildProvider>
            );
          }
          return child;
        })}
      </div>
    </BadgeLiftTargetContext.Provider>
  );
});

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  size?: BadgeSize;
  icon?: ReactNode;
  iconPosition?: BadgeIconPosition;
  iconOnly?: boolean;
  dot?: boolean;
  placement?: BadgePlacement;
  children?: ReactNode;
  /**
   * Lift and shadow enhancement on hover (like `Alert`): `sm` at rest, `md` on hover.
   * Does not duplicate if the badge is a direct child of `Badge.Anchor` with `hoverLift`: there is a lift on the anchor.
   * @default true
   */
  hoverLift?: boolean;
};

function hasMeaningfulContent(node: ReactNode): boolean {
  if (node == null || node === false) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (Array.isArray(node)) return node.some(hasMeaningfulContent);
  return isValidElement(node);
}

export const BadgeRoot = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = "default",
    status = "default",
    size = "base",
    icon,
    iconPosition = "start",
    iconOnly = false,
    dot: dotProp = false,
    placement,
    className = "",
    children,
    hoverLift = true,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    ...rest
  },
  forwardedRef,
) {
  const liftCtx = useContext(BadgeLiftTargetContext);
  const isDirectAnchorChild = useContext(BadgeDirectAnchorChildContext);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const innerLiftRef = useRef<HTMLSpanElement | null>(null);

  const isGloss = variant === "gloss";
  const surfaceClass = badgeSurfaceClass(variant, status);
  const rk = size;

  const inlineIconMode = hasInlineIconChildren(children);
  const meaningChild = inlineIconMode
    ? hasBadgeTextContent(children)
    : hasMeaningfulContent(children);

  const dot = dotProp;

  const placementResolved: BadgePlacement | undefined =
    isDirectAnchorChild ? placement ?? "top-right" : undefined;

  const placementClass = placementResolved
    ? BADGE_ANCHOR_PLACEMENT[placementResolved]
    : "";

  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift && !isGloss);
  const selfLiftEnabled = hoverLift && !splitLift;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, selfLiftEnabled && isGloss),
    [isGloss, selfLiftEnabled],
  );

  const glossLiftPointerHandlers = useGlossInteractiveHandlers(
    rootRef,
    selfLiftEnabled && isGloss,
  );

  const selfLiftShadow = useSecondLevelShadow(rootRef, selfLiftEnabled && !isGloss);

  const bindSelfLiftPointer = useMemo(
    () => ({
      onPointerOver: (e: ReactPointerEvent<HTMLSpanElement>) => {
        onPointerOverProp?.(e);
        if (!e.defaultPrevented && selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOver(e);
          else selfLiftShadow.onPointerEnter(e);
        }
      },
      onPointerOut: (e: ReactPointerEvent<HTMLSpanElement>) => {
        onPointerOutProp?.(e);
        if (selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOut(e);
          else selfLiftShadow.onPointerLeave(e);
        }
      },
    }),
    [
      glossLiftPointerHandlers.onPointerOut,
      glossLiftPointerHandlers.onPointerOver,
      isGloss,
      onPointerOutProp,
      onPointerOverProp,
      selfLiftEnabled,
      selfLiftShadow.onPointerEnter,
      selfLiftShadow.onPointerLeave,
    ],
  );

  const selfLiftMotionCls = selfLiftEnabled
    ? isGloss
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : selfLiftShadow.motionClass
    : "";

  const splitLiftMotionCls = splitLift && !isGloss ? SHADOW_LIFT_MOTION_CLASS : "";

  const syncDirectChild = useCallback(() => {
    if (!liftCtx || !isDirectAnchorChild || !liftCtx.hoverLift) {
      liftCtx?.registerLiftTarget(null);
      return;
    }
    liftCtx.registerLiftTarget(innerLiftRef.current);
  }, [isDirectAnchorChild, liftCtx]);

  const setMergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (node === null) {
        liftCtx?.registerLiftTarget(null);
      }

      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [bindGlossRef, forwardedRef, liftCtx],
  );

  useLayoutEffect(() => {
    syncDirectChild();
    queueMicrotask(() => {
      syncDirectChild();
    });
  }, [
    isDirectAnchorChild,
    liftCtx?.anchorCommitGen,
    liftCtx?.hoverLift,
    placement,
    syncDirectChild,
    meaningChild,
    icon,
    dot,
    iconOnly,
    children,
  ]);

  if (dot) {
    const dotInnerCls = cn(
      "box-border isolate rounded-full ring-2 ring-background motion-reduce:ring-1",
      BADGE_DOT_DIM[rk],
      BADGE_SQUARE_MIN[rk],
      isGloss
        ? cn("gloss-panel border-0", status !== "default" ? BADGE_STATUS_TEXT[status] : "")
        : dotFillClass(variant, status),
      splitLiftMotionCls,
      !splitLift && placementClass,
      className,
    );

    if (splitLift) {
      return (
        <span
          ref={setMergedRef}
          data-badge-root
          className={cn("pointer-events-none", placementClass)}
          {...rest}
          {...badgeRootA11yProps(rest)}
        >
          <span
            ref={innerLiftRef}
            data-badge-lift-target
            className={dotInnerCls}
          />
        </span>
      );
    }

    return (
      <span
        ref={setMergedRef}
        data-badge-root
        className={cn(
          dotInnerCls,
          selfLiftMotionCls,
          isDirectAnchorChild && !isGloss && "pointer-events-none",
          placementClass,
        )}
        {...rest}
        {...badgeRootA11yProps(rest)}
        {...bindSelfLiftPointer}
      />
    );
  }

  const resolvedIcon = inlineIconMode ? null : icon;

  const implicitIconOnly = Boolean(resolvedIcon) && !meaningChild;
  const inlineIconOnly =
    inlineIconMode && !meaningChild && Children.toArray(children).length > 0;
  const onlyIconLayout =
    !meaningChild &&
    (implicitIconOnly || Boolean(iconOnly && resolvedIcon) || inlineIconOnly);

  const iconSlot = resolvedIcon ? (
    <span className={cn("inline-flex shrink-0 [&_svg]:shrink-0", BADGE_INLINE_SVG_SIZE[rk])}>
      {isValidElement(resolvedIcon)
        ? ensureDecorativeIcon(resolvedIcon)
        : resolvedIcon}
    </span>
  ) : null;

  const textSlot =
    meaningChild && !inlineIconMode ? (
      <Text
        as="span"
        variant={BADGE_TEXT_VARIANT[rk]}
        inheritColor
      >
        {children}
      </Text>
    ) : null;

  const inlineBody = inlineIconMode ? renderBadgeInlineChildren(children, rk) : null;

  const bodyContent = inlineIconMode ? (
    inlineBody
  ) : (
    <>
      {iconPosition === "start" && iconSlot}
      {textSlot}
      {iconPosition === "end" && iconSlot}
    </>
  );

  const iconOnlyBody = inlineIconOnly
    ? inlineBody
    : resolvedIcon
      ? isValidElement(resolvedIcon)
        ? ensureDecorativeIcon(resolvedIcon)
        : resolvedIcon
      : children;

  if (onlyIconLayout) {
    const iconInnerCls = cn(
      "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap",
      surfaceClass,
      BADGE_ICON_ONLY[rk],
      BADGE_SQUARE_MIN[rk],
      splitLiftMotionCls,
      !splitLift && placementClass,
      className,
    );

    const iconOnlyA11y = { ...rest, ...badgeRootA11yProps(rest) };

    if (splitLift) {
      return (
        <span
          ref={setMergedRef}
          data-badge-root
          className={cn("pointer-events-none", placementClass)}
          {...iconOnlyA11y}
        >
          <span ref={innerLiftRef} data-badge-lift-target className={iconInnerCls}>
            {iconOnlyBody}
          </span>
        </span>
      );
    }

    return (
      <span
        ref={setMergedRef}
        data-badge-root
        className={cn(
          "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap",
          surfaceClass,
          BADGE_ICON_ONLY[rk],
          BADGE_SQUARE_MIN[rk],
          selfLiftMotionCls,
          isDirectAnchorChild && !isGloss && "pointer-events-none",
          placementClass,
          className,
        )}
        {...iconOnlyA11y}
        {...bindSelfLiftPointer}
      >
        {iconOnlyBody}
      </span>
    );
  }

  const showIconWithText = Boolean(!inlineIconMode && iconSlot && textSlot);
  const dataIcon = showIconWithText ? iconPosition : undefined;

  const textInnerCls = cn(
    "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none",
    surfaceClass,
    BADGE_TEXT_ROW[rk],
    BADGE_SQUARE_MIN[rk],
    splitLiftMotionCls,
    !splitLift && placementClass,
    className,
  );

  if (splitLift) {
    return (
      <span
        ref={setMergedRef}
        data-badge-root
        className={cn("pointer-events-none", placementClass)}
        {...rest}
      >
        <span
          ref={innerLiftRef}
          data-badge-lift-target
          data-icon={dataIcon}
          className={textInnerCls}
        >
          {bodyContent}
        </span>
      </span>
    );
  }

  return (
    <span
      ref={setMergedRef}
      data-icon={dataIcon}
      data-badge-root
      className={cn(
        "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none",
        isDirectAnchorChild && !isGloss && "pointer-events-none",
        surfaceClass,
        BADGE_TEXT_ROW[rk],
        BADGE_SQUARE_MIN[rk],
        selfLiftMotionCls,
        placementClass,
        className,
      )}
      {...bindSelfLiftPointer}
      {...rest}
    >
      {bodyContent}
    </span>
  );
});