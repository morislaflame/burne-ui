import type { AlertStatus } from "@/components/core/Alert";

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
  type ReactElement,
  type ReactNode,
} from "react";

import { Text, type TextVariant } from "@/components/core/Text";
import { MOTION_BADGE_ANCHOR_HOVER_LIFT_SCALE } from "@/components/core/utils/motionTokens";
import { useInteractiveHoverLiftContainerHandlers, SHADOW_SM, SHADOW_MD, initElementShadow } from "@/components/core/utils/hoverInteractiveLift";
import { SEMANTIC_STATUS_ICON_TEXT_CLASS } from "@/components/core/utils/semanticStatusIcons";
import { cn } from "@/utils/cn";

/** Семантика заливки — как у `Alert` / `AlertStatus` (включая `secondary`). */
export type BadgeTone = AlertStatus;

/** Публичный prop `color` (синоним тона бейджа). */
export type BadgeColor = BadgeTone;

/** @deprecated Используйте `BadgeColor`; оставлено для совместимости. */
export type BadgeVariant = BadgeTone;

const BADGE_SURFACE: Record<BadgeTone, string> = {
  default: "bg-accent text-accent-foreground",
  outline: "surface-outline text-foreground",
  secondary: "surface-secondary text-accent",
  danger: cn("bg-surface-tint-danger", SEMANTIC_STATUS_ICON_TEXT_CLASS.danger),
  success: cn("bg-surface-tint-success", SEMANTIC_STATUS_ICON_TEXT_CLASS.success),
  info: cn("bg-surface-tint-info", SEMANTIC_STATUS_ICON_TEXT_CLASS.info),
  warning: cn("bg-surface-tint-warning", SEMANTIC_STATUS_ICON_TEXT_CLASS.warning),
};

const BADGE_DOT_FILL: Record<BadgeTone, string> = {
  default: "bg-accent",
  outline: "bg-accent",
  secondary: "bg-accent",
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

export type BadgeSize = "small" | "base" | "mid" | "large";

/** Угол привязки внутри `Badge.Anchor`. */
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


const BADGE_TEXT_VARIANT: Record<BadgeSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "small",
  large: "base",
};

const BADGE_ICON_ONLY: Record<BadgeSize, string> = {
  small:
    "shrink-0 p-xsmall [&_svg]:icon-small",
  base: "shrink-0 p-small [&_svg]:icon-base",
  mid: "shrink-0 p-base [&_svg]:icon-base",
  large:
    "shrink-0 p-plus [&_svg]:icon-large",
};

const BADGE_DOT_DIM: Record<BadgeSize, string> = {
  small: "icon-small min-h-3 min-w-3 shrink-0 p-0",
  base: "icon-small min-h-4 min-w-4 shrink-0 p-0",
  mid: "icon-base min-h-4 min-w-4 shrink-0 p-0",
  large: "icon-large min-h-5 min-w-5 shrink-0 p-0",
};

const BADGE_INLINE_SVG_SIZE: Record<BadgeSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-small",
  mid: "[&_svg]:icon-base",
  large: "[&_svg]:icon-large",
};

export type BadgeIconPosition = "start" | "end";

/** Значение `data-icon` на inline-иконке в children. */
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

/** Устаревший литерал из API; сводим к `secondary`. */
type BadgeToneProp = BadgeTone | "accent";

function normalizeBadgeToneProp(t: BadgeToneProp | undefined): BadgeTone | undefined {
  if (t === "accent") return "secondary";
  return t;
}

function resolveBadgeTone(
  color: BadgeToneProp | undefined,
  variant: BadgeToneProp | undefined,
): BadgeTone {
  return normalizeBadgeToneProp(color ?? undefined) ??
    normalizeBadgeToneProp(variant ?? undefined) ??
    "default";
}

type BadgeLiftContextValue = {
  /** Регистрация узла бейджа для scale при hover контейнера (как у Button). */
  registerLiftTarget: (el: HTMLElement | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  /** Меняется после коммита DOM якоря; дочерние Badge перепривязываются без «мигания». */
  anchorCommitGen: number;
  /** Подъём прямого дочернего Badge при наведении на якорь. */
  hoverLift: boolean;
};

const BadgeLiftTargetContext = createContext<BadgeLiftContextValue | null>(null);

export type BadgeAnchorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  /**
   * При наведении на якорь слегка увеличивать (anime.js) прямой дочерний `Badge`, как hover у `Button`.
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
  }, []);

  const ctx = useMemo(
    () => ({ registerLiftTarget, anchorRef, anchorCommitGen, hoverLift }),
    [registerLiftTarget, anchorCommitGen, hoverLift],
  );

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers<HTMLDivElement>(
    liftedRef,
    hoverLift,
    undefined,
    MOTION_BADGE_ANCHOR_HOVER_LIFT_SCALE,
    { idle: SHADOW_SM(), hover: SHADOW_MD() },
  );

  return (
    <BadgeLiftTargetContext.Provider value={ctx}>
      <div
        ref={setMergedRef}
        data-badge-anchor
        className={cn(
          "relative isolate block w-max shrink-0",
          className,
        )}
        onPointerOver={(e) => {
          onPointerOverFromProps?.(e);
          if (!e.defaultPrevented) liftPointerHandlers.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOutFromProps?.(e);
          liftPointerHandlers.onPointerOut(e);
        }}
        {...rest}
      >
        {children}
      </div>
    </BadgeLiftTargetContext.Provider>
  );
});

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Семантика / цвет поверхности. Приоритет над `variant`. */
  color?: BadgeToneProp;
  /** Совместимость с прежним API; если задан только он — работает как `color`. */
  variant?: BadgeToneProp;
  /** `small` · `base` · `mid` · `large`. По умолчанию `base`. */
  size?: BadgeSize;
  /** Simple API: иконка через prop. Игнорируется, если в `children` есть элемент с `data-icon`. */
  icon?: ReactNode;
  iconPosition?: BadgeIconPosition;
  iconOnly?: boolean;
  dot?: boolean;
  /**
   * Только для бейджа — **прямого** ребёнка `Badge.Anchor`: угол наложения.
   * По умолчанию `top-right`. Внутри вложенных контейнеров не действует.
   */
  placement?: BadgePlacement;
  /**
   * Текст или compound-иконки: `data-icon="inline-start" | "inline-end"` (также `start` / `end`).
   * Декоративные иконки получают `aria-hidden`, если нет `aria-label`.
   */
  children?: ReactNode;
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
    color,
    variant = "default",
    size = "base",
    icon,
    iconPosition = "start",
    iconOnly = false,
    dot: dotProp = false,
    placement,
    className = "",
    children,
    ...rest
  },
  forwardedRef,
) {
  const liftCtx = useContext(BadgeLiftTargetContext);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const innerLiftRef = useRef<HTMLSpanElement | null>(null);
  const [isDirectAnchorChild, setIsDirectAnchorChild] = useState(false);

  const tone = resolveBadgeTone(color ?? undefined, variant);
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

  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift);

  const syncDirectChild = useCallback(() => {
    const outer = rootRef.current;
    if (!liftCtx) {
      setIsDirectAnchorChild(false);
      return;
    }
    const anchor = liftCtx.anchorRef.current;
    const direct = !!(outer && anchor && outer.parentElement === anchor);
    setIsDirectAnchorChild(direct);
    if (!direct || !liftCtx.hoverLift) {
      liftCtx.registerLiftTarget(null);
      return;
    }
    liftCtx.registerLiftTarget(innerLiftRef.current);
  }, [liftCtx]);

  const setMergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (node === null) {
        liftCtx?.registerLiftTarget(null);
        setIsDirectAnchorChild(false);
      }

      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef, liftCtx],
  );

  useLayoutEffect(() => {
    syncDirectChild();
    queueMicrotask(() => {
      syncDirectChild();
    });
  }, [
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

  // Инициализируем начальную тень на том элементе, который будет анимироваться.
  useLayoutEffect(() => {
    const target = splitLift ? innerLiftRef.current : rootRef.current;
    initElementShadow(target, SHADOW_SM());
  });

  if (dot) {
    const hasLabel = badgeHasAccessibleName(rest);

    const dotInnerCls = cn(
      "box-border isolate rounded-full ring-2 ring-background motion-reduce:ring-1",
      BADGE_DOT_DIM[rk],
      BADGE_DOT_FILL[tone],
      splitLift && "will-change-transform origin-center",
      !splitLift && placementClass,
      className,
    );

    if (splitLift) {
      return (
        <span
          ref={setMergedRef}
          data-badge-root
          className={cn("pointer-events-none", placementClass)}
          {...(hasLabel
            ? {}
            : { "aria-hidden": true, role: "presentation" as const })}
          {...rest}
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
          "box-border isolate rounded-full ring-2 ring-background motion-reduce:ring-1",
          BADGE_DOT_DIM[rk],
          BADGE_DOT_FILL[tone],
          isDirectAnchorChild && "pointer-events-none",
          placementClass,
          className,
        )}
        {...(hasLabel
          ? {}
          : { "aria-hidden": true, role: "presentation" as const })}
        {...rest}
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
      "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap animate-shadow",
      BADGE_SURFACE[tone],
      BADGE_ICON_ONLY[rk],
      splitLift && "will-change-transform origin-center",
      !splitLift && placementClass,
      className,
    );

    const iconOnlyA11y =
      badgeHasAccessibleName(rest) ? rest : { ...rest, "aria-hidden": true as const, role: "presentation" as const };

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
          "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap animate-shadow",
          isDirectAnchorChild && "pointer-events-none",
          BADGE_SURFACE[tone],
          BADGE_ICON_ONLY[rk],
          placementClass,
          className,
        )}
        {...iconOnlyA11y}
      >
        {iconOnlyBody}
      </span>
    );
  }

  const showIconWithText = Boolean(!inlineIconMode && iconSlot && textSlot);
  const dataIcon = showIconWithText ? iconPosition : undefined;

  const textInnerCls = cn(
    "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none animate-shadow",
    BADGE_SURFACE[tone],
    BADGE_TEXT_ROW[rk],
    splitLift && "will-change-transform origin-center",
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
        "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none animate-shadow",
        isDirectAnchorChild && "pointer-events-none",
        BADGE_SURFACE[tone],
        BADGE_TEXT_ROW[rk],
        placementClass,
        className,
      )}
      {...rest}
    >
      {bodyContent}
    </span>
  );
});

/** Компактный статус-бейдж; с `Badge.Anchor` — наложение и hover-scale как у `Button`. */
