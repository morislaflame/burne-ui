import { killMotion } from "@/components/core/utils/gsapMotion";
import type {
  ButtonHTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOptionalButtonGroupSegment } from "@/components/core/utils/buttonGroupContext";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
  shadowSm,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { Ripple } from "@/components/core/Ripple";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";
import {
  buttonGroupOverlapBorderClasses,
  buttonGroupRoundingClasses,
} from "@/components/core/utils/buttonGroupSegment";
import { Text, type TextVariant } from "@/components/core/Text";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

/** Состояние асинхронного сценария после клика. */
export type ButtonAsyncState = "idle" | "loading" | "success" | "error";

/** Размер кнопки: высота, отступы, типографика, спиннер и иконки результата. */
export type ButtonSize = ComponentSize;

/** Визуальный вариант заливки и обводки. */
export type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "info"
  | "warning";

type VariantVisual = {
  root: string;
  focusOutline: string;
  convergeBg: string;
  loaderText: string;
  hoverIdle: string;
};

/** Варианты, у которых тень появляется при hover (анимируем shadow-sm). */
const BUTTON_VARIANT_HAS_HOVER_SHADOW = new Set<ButtonVariant>([
  "default", "outline", "secondary", "ghost", "danger", "success", "info", "warning",
]);

const BUTTON_VARIANT: Record<ButtonVariant, VariantVisual> = {
  default: {
    root: "bg-primary text-primary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-primary-fill"),
    loaderText: "text-primary-foreground",
    hoverIdle: "hover:bg-primary-hover",
  },
  outline: {
    root: "bg-transparent border-token text-foreground",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    loaderText: "text-foreground",
    hoverIdle: "hover:bg-primary-tint",
  },
  secondary: {
    root: "bg-secondary text-secondary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    loaderText: "text-secondary-foreground",
    hoverIdle: "hover:bg-secondary-hover",
  },
  ghost: {
    root: "bg-transparent text-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    loaderText: "text-foreground",
    hoverIdle: "hover:bg-primary-tint",
  },
  danger: {
    root: "bg-danger text-danger-foreground border border-transparent",
    focusOutline: "focus-visible:outline-danger",
    convergeBg: colorToken("converge-ripple-danger"),
    loaderText: "text-danger-foreground",
    hoverIdle: "hover:bg-danger-fill-hover",
  },
  success: {
    root: "bg-success text-success-foreground border border-transparent",
    focusOutline: "focus-visible:outline-success",
    convergeBg: colorToken("converge-ripple-success"),
    loaderText: "text-success-foreground",
    hoverIdle: "hover:bg-success-fill-hover",
  },
  info: {
    root: "bg-info text-info-foreground border border-transparent",
    focusOutline: "focus-visible:outline-info",
    convergeBg: colorToken("converge-ripple-info"),
    loaderText: "text-info-foreground",
    hoverIdle: "hover:bg-info-fill-hover",
  },
  warning: {
    root: "bg-warning text-warning-foreground border border-transparent",
    focusOutline: "focus-visible:outline-warning",
    convergeBg: colorToken("converge-ripple-warning"),
    loaderText: "text-warning-foreground",
    hoverIdle: "hover:bg-warning-fill-hover",
  },
};

/** Типографика подписи — через `Text`, без `text-*` на корне кнопки. */
const BUTTON_SIZE_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const BUTTON_SIZE_CLASSES: Record<
  ButtonSize,
  { root: string; rootIconOnly: string; spinner: string; icon: string }
> = {
  small: {
    root: `${CONTROL_SIZE_LAYOUT.small.h} ${CONTROL_SIZE_LAYOUT.small.minWButton} ${CONTROL_SIZE_LAYOUT.small.padX}`,
    rootIconOnly: `${CONTROL_SIZE_LAYOUT.small.h} min-w-fit ${CONTROL_SIZE_LAYOUT.small.padX}`,
    spinner: `${CONTROL_SIZE_LAYOUT.small.spinnerIcon} ${CONTROL_SIZE_LAYOUT.small.spinnerBorder}`,
    icon: CONTROL_SIZE_LAYOUT.small.icon,
  },
  base: {
    root: `${CONTROL_SIZE_LAYOUT.base.h} ${CONTROL_SIZE_LAYOUT.base.minWButton} ${CONTROL_SIZE_LAYOUT.base.padX}`,
    rootIconOnly: `${CONTROL_SIZE_LAYOUT.base.h} min-w-fit ${CONTROL_SIZE_LAYOUT.base.padX}`,
    spinner: `${CONTROL_SIZE_LAYOUT.base.spinnerIcon} ${CONTROL_SIZE_LAYOUT.base.spinnerBorder}`,
    icon: CONTROL_SIZE_LAYOUT.base.icon,
  },
  mid: {
    root: `${CONTROL_SIZE_LAYOUT.mid.h} ${CONTROL_SIZE_LAYOUT.mid.minWButton} ${CONTROL_SIZE_LAYOUT.mid.padX}`,
    rootIconOnly: `${CONTROL_SIZE_LAYOUT.mid.h} min-w-fit ${CONTROL_SIZE_LAYOUT.mid.padX}`,
    spinner: `${CONTROL_SIZE_LAYOUT.mid.spinnerIcon} ${CONTROL_SIZE_LAYOUT.mid.spinnerBorder}`,
    icon: CONTROL_SIZE_LAYOUT.mid.icon,
  },
  large: {
    root: `${CONTROL_SIZE_LAYOUT.large.h} ${CONTROL_SIZE_LAYOUT.large.minWButton} ${CONTROL_SIZE_LAYOUT.large.padX}`,
    rootIconOnly: `${CONTROL_SIZE_LAYOUT.large.h} min-w-fit ${CONTROL_SIZE_LAYOUT.large.padX}`,
    spinner: `${CONTROL_SIZE_LAYOUT.large.spinnerIcon} ${CONTROL_SIZE_LAYOUT.large.spinnerBorder}`,
    icon: CONTROL_SIZE_LAYOUT.large.icon,
  },
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Склейка с соседями в `ButtonGroup`: без зазора, общий контур скругления только по краям группы.
   * Задаётся автоматически при использовании внутри `<ButtonGroup>`.
   */
  groupSegment?: ButtonGroupSegment;
  /** Стиль заливки и акцента. По умолчанию `default`. */
  variant?: ButtonVariant;
  /** Габариты и типографика. По умолчанию `base`. */
  size?: ButtonSize;
  /**
   * Кнопка только с иконкой: вместо `min-w-button-*` используется `min-w-fit` (узкая обводка по контенту).
   */
  iconOnly?: boolean;
  /** Включить лёгкий scale-пульс при нажатии (GSAP), только в idle. */
  animated?: boolean;
  /**
   * Управляемое состояние: loading → success | error с рябью и иконками.
   * Без `onAsyncClick` переходы задаёт родитель.
   */
  asyncState?: ButtonAsyncState;
  /** При контроле `asyncState` — уведомление о смене (опционально). */
  onAsyncStateChange?: (state: ButtonAsyncState) => void;
  /**
   * Неконтролируемый режим: `true` из промиса → success + зелёная галочка,
   * `false` → error + красный крест. Отклонение промиса трактуется как error.
   */
  onAsyncClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
  /** Через сколько вернуться в idle после success/error (неконтролируемый режим). */
  asyncFeedbackMs?: number;
  /** Иконка слева от подписи (только в состоянии idle). */
  leftIcon?: ReactNode;
  /**
   * Включить converge-ripple от точки нажатия (`<Ripple />` внутри кнопки, тон под `variant`).
   * @default false
   */
  ripple?: boolean;
};

type ExpandRipple = {
  id: number;
  size: number;
  tone: "success" | "error";
};

function maxDistanceToCorners(px: number, py: number, w: number, h: number) {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  return Math.max(
    ...corners.map(([cx, cy]) => Math.hypot(cx - px, cy - py)),
  );
}

function centerCoverDiameter(w: number, h: number) {
  return 2 * maxDistanceToCorners(w / 2, h / 2, w, h);
}

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`box-border inline-block rounded-full border-current border-t-transparent ${className ?? ""}`}
      aria-hidden
    />
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconCross({ className }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      variant = "default",
      size: sizeProp = "base",
      type = "button",
      animated = true,
      asyncState: asyncStateProp,
      onAsyncStateChange,
      onAsyncClick,
      asyncFeedbackMs = 2000,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onMouseDown,
      onClick,
      disabled: disabledProp,
      leftIcon,
      ripple = false,
      iconOnly = false,
      groupSegment: groupSegmentProp,
      children,
      ...props
    },
    ref,
  ) {
    const groupCtx = useOptionalButtonGroupSegment();
    const groupSegment = groupSegmentProp ?? groupCtx?.segment;
    const size = sizeProp ?? groupCtx?.buttonSize ?? "base";
    const userDisabled = Boolean(disabledProp);
    const btnRef = useRef<HTMLButtonElement>(null);
    const hoverPointerInsideRef = useRef(false);
    const asyncStateRef = useRef<ButtonAsyncState>("idle");
    const expandId = useRef(0);
    const prevAsyncRef = useRef<ButtonAsyncState>("idle");
    const asyncInFlight = useRef(false);

    const [internalAsync, setInternalAsync] =
      useState<ButtonAsyncState>("idle");
    const isControlled = asyncStateProp !== undefined;
    const asyncState: ButtonAsyncState = isControlled
      ? asyncStateProp!
      : internalAsync;
    asyncStateRef.current = asyncState;

    const [expandRipples, setExpandRipples] = useState<ExpandRipple[]>([]);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const pushExpandRipple = useCallback((tone: "success" | "error") => {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const size = centerCoverDiameter(r.width, r.height);
      const id = ++expandId.current;
      setExpandRipples((prev) => [...prev, { id, size, tone }]);
    }, []);

    const setUncontrolledAsync = useCallback(
      (next: ButtonAsyncState) => {
        setInternalAsync(next);
        onAsyncStateChange?.(next);
      },
      [onAsyncStateChange],
    );

    const scheduleAsyncIdleReset = useCallback(() => {
      window.setTimeout(() => {
        setUncontrolledAsync("idle");
      }, asyncFeedbackMs);
    }, [asyncFeedbackMs, setUncontrolledAsync]);

    useLayoutEffect(() => {
      if (!isControlled) return;
      const prev = prevAsyncRef.current;
      if (
        (asyncState === "success" || asyncState === "error") &&
        prev === "loading"
      ) {
        pushExpandRipple(asyncState === "success" ? "success" : "error");
      }
      prevAsyncRef.current = asyncState;
    }, [asyncState, isControlled, pushExpandRipple]);

    const busy =
      asyncState === "loading" ||
      asyncState === "success" ||
      asyncState === "error";
    const blocked = userDisabled || busy;

    useEffect(() => {
      const el = btnRef.current;
      if (!blocked || !el) return;
      hoverPointerInsideRef.current = false;
      killMotion(el);
    }, [blocked]);

    const btnShadow = useMemo(
      () =>
        BUTTON_VARIANT_HAS_HOVER_SHADOW.has(variant)
          ? { hover: shadowSm() }
          : undefined,
      [variant],
    );

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        if (blocked) return;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        hoverPointerInsideRef.current = true;
        animateInteractiveHoverLift(el, true, undefined, btnShadow);
      },
      [blocked, btnShadow, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el || blocked) return;
        animateInteractiveHoverLift(el, false, undefined, btnShadow);
      },
      [blocked, btnShadow, onPointerLeave],
    );

    function onAnimeDown() {
      if (!animated || !btnRef.current || asyncState !== "idle") return;
      if (prefersReducedInteractiveHoverLift()) return;
      const el = btnRef.current;
      void animateInteractivePressSqueeze(el).then(() => {
        const btn = btnRef.current;
        if (
          !btn ||
          btn.disabled ||
          asyncStateRef.current !== "idle" ||
          shouldSkipInteractiveHoverLift()
        ) {
          return;
        }
        if (hoverPointerInsideRef.current) {
          animateInteractiveHoverLift(btn, true, undefined, btnShadow);
        }
      });
    }

    const dismissExpand = useCallback((id: number) => {
      setExpandRipples((prev) => prev.filter((rp) => rp.id !== id));
    }, []);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (isControlled || !onAsyncClick || e.defaultPrevented) return;
        if (asyncInFlight.current || internalAsync !== "idle") return;
        asyncInFlight.current = true;
        setUncontrolledAsync("loading");
        Promise.resolve(onAsyncClick(e))
          .then((ok) => {
            const next = ok ? "success" : "error";
            setUncontrolledAsync(next);
            pushExpandRipple(next);
            scheduleAsyncIdleReset();
          })
          .catch(() => {
            setUncontrolledAsync("error");
            pushExpandRipple("error");
            scheduleAsyncIdleReset();
          })
          .finally(() => {
            asyncInFlight.current = false;
          });
      },
      [
        onClick,
        onAsyncClick,
        isControlled,
        internalAsync,
        pushExpandRipple,
        scheduleAsyncIdleReset,
        setUncontrolledAsync,
      ],
    );

    const baseInteractive =
      "relative overflow-hidden inline-flex items-center justify-center font-medium outline-none " +
      "focus-ring " +
      "disabled:pointer-events-none";

    const vn = BUTTON_VARIANT[variant];
    const labelHidden =
      asyncState !== "idle"
        ? "opacity-0 scale-[0.92]"
        : "opacity-100 scale-100";
    const successVisible =
      asyncState === "success"
        ? "opacity-100 scale-100"
        : "pointer-events-none opacity-0 scale-[0.85]";
    const errorVisible =
      asyncState === "error"
        ? "opacity-100 scale-100"
        : "pointer-events-none opacity-0 scale-[0.85]";

    const crossFade =
      "flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

    const sz = BUTTON_SIZE_CLASSES[size];
    const sizeRoot = iconOnly ? sz.rootIconOnly : sz.root;

    const idleSurfaceMotion = blocked
      ? ""
      : cn("button-idle-surface-transition motion-reduce:transition-none", vn.hoverIdle);

    const roundingClass = groupSegment
      ? buttonGroupRoundingClasses(groupSegment)
      : "rounded-base";

    const groupGlue = groupSegment
      ? cn(
          buttonGroupOverlapBorderClasses(groupSegment),
          "z-0 hover:z-[2] focus-visible:z-[2] active:z-[2]",
        )
      : "";

    const clipClass = groupSegment
      ? buttonGroupRoundingClasses(groupSegment)
      : "rounded-base";

    return (
      <button
        ref={setRefs}
        {...props}
        type={type}
        disabled={blocked}
        aria-busy={asyncState === "loading"}
        className={cn(
          baseInteractive,
          groupGlue,
          vn.focusOutline,
          sizeRoot,
          vn.root,
          "animate-shadow",
          userDisabled ? "opacity-50" : "",
          idleSurfaceMotion,
          roundingClass,
          className,
          "cursor-pointer",
        )}
        onPointerDown={(e) => {
          onAnimeDown();
          onPointerDown?.(e);
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onMouseDown={onMouseDown}
        onClick={handleClick}
      >
        {ripple ? (
          <Ripple
            color={vn.convergeBg}
            disabled={blocked || asyncState !== "idle"}
            duration={getMotionConfig().rippleDefaultDuration}
            className={clipClass}
          />
        ) : null}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 z-0 overflow-hidden",
            clipClass,
          )}
          aria-hidden
        >
          {expandRipples.map((rp) => (
            <span
              key={rp.id}
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 rounded-full will-change-[transform,opacity]"
              style={{
                width: rp.size,
                height: rp.size,
                marginLeft: -rp.size / 2,
                marginTop: -rp.size / 2,
                background:
                  rp.tone === "success"
                    ? "color-mix(in oklab, var(--color-success) 55%, transparent)"
                    : "color-mix(in oklab, var(--color-danger) 55%, transparent)",
                animation:
                  `button-ripple-expand ${getMotionConfig().feedbackExpandDuration}ms ${getMotionConfig().rippleEaseCss} forwards`,
              }}
              onAnimationEnd={() => dismissExpand(rp.id)}
            />
          ))}
        </span>

        <span className="relative z-[1] grid place-items-center">
          <span
            className={`${crossFade} col-start-1 row-start-1 ${labelHidden} inline-flex min-w-0 items-center justify-center gap-xsmall`}
          >
            {leftIcon != null ? (
              <span
                className={`inline-flex shrink-0 items-center justify-center ${sz.icon} [&_svg]:size-full`}
                aria-hidden
              >
                {leftIcon}
              </span>
            ) : null}
            <Text
              variant={BUTTON_SIZE_TEXT_VARIANT[size]}
              as="span"
              inheritColor
              className="min-w-0 shrink"
            >
              {children}
            </Text>
          </span>
          {asyncState === "loading" ? (
            <span
              className={`${crossFade} col-start-1 row-start-1 ${vn.loaderText} opacity-100 scale-100`}
              aria-hidden
            >
              <Spinner
                className={`${sz.spinner} animate-spin motion-reduce:animate-none`}
              />
            </span>
          ) : null}
          <span
            className={`${crossFade} col-start-1 row-start-1 text-success ${successVisible}`}
            aria-hidden={asyncState !== "success"}
          >
            <IconCheck className={sz.icon} />
          </span>
          <span
            className={`${crossFade} col-start-1 row-start-1 text-danger ${errorVisible}`}
            aria-hidden={asyncState !== "error"}
          >
            <IconCross className={sz.icon} />
          </span>
        </span>
      </button>
    );
  },
);
