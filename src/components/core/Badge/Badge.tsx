import type { AlertStatus } from "@/components/core/Alert";

import {
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
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

export type BadgeSize = "small" | "base" | "large";

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
  large: "gap-small px-plus py-xsmall",
};

/** Мин. ширина с подписью = сторона квадрата `icon-only` того же размера (не «вертикальная капсула»). */
const BADGE_TEXT_MIN_WIDTH: Record<BadgeSize, string> = {
  small: "min-w-[1.625rem]",
  base: "min-w-[1.755rem]",
  large: "min-w-[1.875rem]",
};

const BADGE_TEXT_VARIANT: Record<BadgeSize, TextVariant> = {
  small: "tools",
  base: "small",
  large: "base",
};

const BADGE_ICON_ONLY: Record<BadgeSize, string> = {
  small:
    "shrink-0 p-xsmall [&_svg]:icon-small",
  base: "shrink-0 p-small [&_svg]:icon-base",
  large:
    "shrink-0 p-plus [&_svg]:icon-large",
};

const BADGE_DOT_DIM: Record<BadgeSize, string> = {
  small: "icon-small min-h-3 min-w-3 shrink-0 p-0",
  base: "icon-base min-h-4 min-w-4 shrink-0 p-0",
  large: "icon-large min-h-5 min-w-5 shrink-0 p-0",
};

const BADGE_INLINE_SVG_SIZE: Record<BadgeSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-base",
  large: "[&_svg]:icon-large",
};

export type BadgeIconPosition = "start" | "end";


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

const BadgeAnchor = forwardRef<HTMLDivElement, BadgeAnchorProps>(function BadgeAnchor(
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
  const [anchorCommitGen, setAnchorCommitGen] = useState(0);

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

  useLayoutEffect(() => {
    setAnchorCommitGen((g) => g + 1);
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
  /** `small` · `base` · `large`. По умолчанию `base`. */
  size?: BadgeSize;
  icon?: ReactNode;
  iconPosition?: BadgeIconPosition;
  iconOnly?: boolean;
  dot?: boolean;
  /**
   * Только для бейджа — **прямого** ребёнка `Badge.Anchor`: угол наложения.
   * По умолчанию `top-right`. Внутри вложенных контейнеров не действует.
   */
  placement?: BadgePlacement;
  children?: ReactNode;
};

function hasMeaningfulContent(node: ReactNode): boolean {
  if (node == null || node === false) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (Array.isArray(node)) return node.some(hasMeaningfulContent);
  return isValidElement(node);
}

const BadgeRoot = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
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

  const meaningChild = hasMeaningfulContent(children);

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
    const hasLabel =
      typeof rest["aria-label"] === "string" ||
      typeof rest["aria-labelledby"] === "string";

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

  const implicitIconOnly = Boolean(icon) && !meaningChild;
  const onlyIconLayout =
    !meaningChild &&
    (implicitIconOnly || Boolean(iconOnly && icon));

  const iconSlot = icon ? (
    <span className={cn("inline-flex shrink-0 [&_svg]:shrink-0", BADGE_INLINE_SVG_SIZE[rk])}>
      {icon}
    </span>
  ) : null;

  const textSlot = meaningChild ? (
    <Text
      as="span"
      variant={BADGE_TEXT_VARIANT[rk]}
      inheritColor
      className={cn(
        "min-w-0 truncate",
        /** `leading-none` обрезает выносные (g, y, p); компактность сохраняем через `leading-tight`. */
        rk === "small" && "text-[0.6875rem] leading-tight",
        rk === "base" && "leading-tight",
        rk === "large" && "leading-snug",
      )}
    >
      {children}
    </Text>
  ) : null;

  if (onlyIconLayout) {
    const iconInnerCls = cn(
      "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap animate-shadow",
      BADGE_SURFACE[tone],
      BADGE_ICON_ONLY[rk],
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
          <span ref={innerLiftRef} data-badge-lift-target className={iconInnerCls}>
            {icon ?? children}
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
        {...rest}
      >
        {icon ?? children}
      </span>
    );
  }

  const showIconWithText = Boolean(iconSlot && textSlot);
  const dataIcon = showIconWithText ? iconPosition : undefined;

  const textInnerCls = cn(
    "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none animate-shadow",
    BADGE_TEXT_MIN_WIDTH[rk],
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
          {iconPosition === "start" && iconSlot}
          {textSlot}
          {iconPosition === "end" && iconSlot}
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
        BADGE_TEXT_MIN_WIDTH[rk],
        isDirectAnchorChild && "pointer-events-none",
        BADGE_SURFACE[tone],
        BADGE_TEXT_ROW[rk],
        placementClass,
        className,
      )}
      {...rest}
    >
      {iconPosition === "start" && iconSlot}
      {textSlot}
      {iconPosition === "end" && iconSlot}
    </span>
  );
});

/** Компактный статус-бейдж; с `Badge.Anchor` — наложение и hover-scale как у `Button`. */
export const Badge = Object.assign(BadgeRoot, {
  Anchor: BadgeAnchor,
});

export { BadgeAnchor };
