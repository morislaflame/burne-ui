import { remove } from "animejs";
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
  useRef,
  useState,
} from "react";
import {
  ConvergeRippleLayer,
} from "../utils/pressRipple";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "../utils/hoverInteractiveLift";
import {
  MOTION_FEEDBACK_EXPAND_MS,
  MOTION_RIPPLE_EASE_CSS,
} from "../utils/motionTokens";
import { useConvergeRipples } from "../utils/useConvergeRipples";

/** Состояние асинхронного сценария после клика. */
export type ButtonAsyncState = "idle" | "loading" | "success" | "error";

/** Размер кнопки: высота, отступы, типографика, спиннер и иконки результата. */
export type ButtonSize = "s" | "m" | "l" | "xl";

/** Визуальный вариант заливки и обводки. */
export type ButtonVariant =
  | "default"
  | "outline"
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

const BUTTON_VARIANT: Record<ButtonVariant, VariantVisual> = {
  default: {
    root: "bg-b-accent text-b-accent-fg border border-b-border shadow-sm",
    focusOutline: "focus-visible:outline-b-accent",
    convergeBg:
      "color-mix(in oklab, var(--b-color-accent-foreground) 38%, transparent)",
    loaderText: "text-b-accent-fg",
    hoverIdle: "hover:opacity-90",
  },
  outline: {
    root: "bg-transparent text-b-accent border border-b-border shadow-none",
    focusOutline: "focus-visible:outline-b-accent",
    convergeBg:
      "color-mix(in oklab, var(--b-color-accent) 42%, transparent)",
    loaderText: "text-b-accent",
    hoverIdle:
      "hover:bg-[color-mix(in_oklab,var(--b-color-accent)_12%,transparent)]",
  },
  ghost: {
    root: "bg-transparent text-b-accent border border-transparent shadow-none",
    focusOutline: "focus-visible:outline-b-accent",
    convergeBg:
      "color-mix(in oklab, var(--b-color-accent) 42%, transparent)",
    loaderText: "text-b-accent",
    hoverIdle:
      "hover:bg-[color-mix(in_oklab,var(--b-color-accent)_18%,transparent)]",
  },
  danger: {
    root: "bg-b-danger text-b-danger-fg border border-transparent shadow-sm",
    focusOutline: "focus-visible:outline-b-danger",
    convergeBg:
      "color-mix(in oklab, var(--b-color-danger-foreground) 38%, transparent)",
    loaderText: "text-b-danger-fg",
    hoverIdle: "hover:opacity-90",
  },
  success: {
    root: "bg-b-success text-b-success-fg border border-transparent shadow-sm",
    focusOutline: "focus-visible:outline-b-success",
    convergeBg:
      "color-mix(in oklab, var(--b-color-success-foreground) 38%, transparent)",
    loaderText: "text-b-success-fg",
    hoverIdle: "hover:opacity-90",
  },
  info: {
    root: "bg-b-info text-b-info-fg border border-transparent shadow-sm",
    focusOutline: "focus-visible:outline-b-info",
    convergeBg:
      "color-mix(in oklab, var(--b-color-info-foreground) 38%, transparent)",
    loaderText: "text-b-info-fg",
    hoverIdle: "hover:opacity-90",
  },
  warning: {
    root: "bg-b-warning text-b-warning-fg border border-transparent shadow-sm",
    focusOutline: "focus-visible:outline-b-warning",
    convergeBg:
      "color-mix(in oklab, var(--b-color-warning-foreground) 38%, transparent)",
    loaderText: "text-b-warning-fg",
    hoverIdle: "hover:opacity-90",
  },
};

const BUTTON_SIZE_CLASSES: Record<
  ButtonSize,
  { root: string; spinner: string; icon: string }
> = {
  s: {
    root: "min-h-8 min-w-[5.5rem] px-3 py-1.5 text-sm",
    spinner: "size-4 border-2",
    icon: "size-[1.125rem]",
  },
  m: {
    root: "min-h-10 min-w-[7rem] px-4 py-2",
    spinner: "size-5 border-2",
    icon: "size-[1.375rem]",
  },
  l: {
    root: "min-h-12 min-w-[8rem] px-5 py-2.5 text-base",
    spinner: "size-6 border-[2.5px]",
    icon: "size-6",
  },
  xl: {
    root: "min-h-14 min-w-[9.5rem] px-6 py-3 text-lg",
    spinner: "size-7 border-[3px]",
    icon: "size-7",
  },
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Стиль заливки и акцента. По умолчанию `default`. */
  variant?: ButtonVariant;
  /** Габариты и типографика. По умолчанию `s`. */
  size?: ButtonSize;
  /** Включить лёгкий scale-пульс при нажатии (anime.js), только в idle. */
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
      size = "s",
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
      children,
      ...props
    },
    ref,
  ) {
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

    const {
      ripples: convergeRipples,
      pushFromPointer: pushConvergeRippleBase,
      dismiss: dismissConverge,
    } = useConvergeRipples();
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

    const skipAsyncNotify = useRef(true);
    useEffect(() => {
      if (isControlled) return;
      if (skipAsyncNotify.current) {
        skipAsyncNotify.current = false;
        return;
      }
      onAsyncStateChange?.(internalAsync);
    }, [internalAsync, isControlled, onAsyncStateChange]);

    useEffect(() => {
      const prev = prevAsyncRef.current;
      if (
        (asyncState === "success" || asyncState === "error") &&
        prev === "loading"
      ) {
        pushExpandRipple(asyncState === "success" ? "success" : "error");
      }
      prevAsyncRef.current = asyncState;
    }, [asyncState, pushExpandRipple]);

    useEffect(() => {
      if (isControlled) return;
      if (asyncState !== "success" && asyncState !== "error") return;
      const t = window.setTimeout(() => {
        setInternalAsync("idle");
      }, asyncFeedbackMs);
      return () => window.clearTimeout(t);
    }, [asyncState, isControlled, asyncFeedbackMs]);

    const busy =
      asyncState === "loading" ||
      asyncState === "success" ||
      asyncState === "error";
    const blocked = userDisabled || busy;

    useEffect(() => {
      const el = btnRef.current;
      if (!blocked || !el) return;
      hoverPointerInsideRef.current = false;
      remove(el);
    }, [blocked]);

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        if (blocked) return;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        hoverPointerInsideRef.current = true;
        animateInteractiveHoverLift(el, true);
      },
      [blocked, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el || blocked) return;
        animateInteractiveHoverLift(el, false);
      },
      [blocked, onPointerLeave],
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
          prefersReducedInteractiveHoverLift()
        ) {
          return;
        }
        if (hoverPointerInsideRef.current) {
          animateInteractiveHoverLift(btn, true);
        }
      });
    }

    const pushConvergeRipple = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (asyncState !== "idle") return;
        const el = e.currentTarget;
        if (el.disabled) return;
        pushConvergeRippleBase(e);
      },
      [asyncState, pushConvergeRippleBase],
    );

    const dismissExpand = useCallback((id: number) => {
      setExpandRipples((prev) => prev.filter((rp) => rp.id !== id));
    }, []);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (isControlled || !onAsyncClick || e.defaultPrevented) return;
        if (asyncInFlight.current || internalAsync !== "idle") return;
        asyncInFlight.current = true;
        setInternalAsync("loading");
        Promise.resolve(onAsyncClick(e))
          .then((ok) => {
            setInternalAsync(ok ? "success" : "error");
          })
          .catch(() => {
            setInternalAsync("error");
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
      ],
    );

    const baseInteractive =
      "relative overflow-hidden inline-flex items-center justify-center rounded-lg font-medium outline-none " +
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
      "disabled:pointer-events-none";

    const vn = BUTTON_VARIANT[variant];
    const labelHidden =
      asyncState !== "idle"
        ? "opacity-0 scale-[0.92]"
        : "opacity-100 scale-100";
    const loaderVisible =
      asyncState === "loading"
        ? "opacity-100 scale-100"
        : "pointer-events-none opacity-0 scale-[0.85]";
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

    const idleSurfaceMotion = blocked
      ? ""
      : [
          "transition-[opacity,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          vn.hoverIdle,
        ].join(" ");

    return (
      <button
        ref={setRefs}
        {...props}
        type={type}
        disabled={blocked}
        aria-busy={asyncState === "loading"}
        className={[
          baseInteractive,
          vn.focusOutline,
          sz.root,
          vn.root,
          userDisabled ? "opacity-50" : "",
          idleSurfaceMotion,
          className,
          'cursor-pointer',
        ].join(" ")}
        onPointerDown={(e) => {
          if (!blocked) pushConvergeRipple(e);
          onAnimeDown();
          onPointerDown?.(e);
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onMouseDown={onMouseDown}
        onClick={handleClick}
      >
        <span
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg"
          aria-hidden
        >
          <ConvergeRippleLayer
            ripples={convergeRipples}
            tone={vn.convergeBg}
            onDone={dismissConverge}
          />
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
                    ? "color-mix(in oklab, var(--b-color-success) 55%, transparent)"
                    : "color-mix(in oklab, var(--b-color-danger) 55%, transparent)",
                animation:
                  `b-button-ripple-expand ${MOTION_FEEDBACK_EXPAND_MS}ms ${MOTION_RIPPLE_EASE_CSS} forwards`,
              }}
              onAnimationEnd={() => dismissExpand(rp.id)}
            />
          ))}
        </span>

        <span className="relative z-[1] grid place-items-center">
          <span
            className={`${crossFade} col-start-1 row-start-1 ${labelHidden} inline-flex min-w-0 items-center justify-center gap-1.5`}
          >
            {leftIcon != null ? (
              <span
                className={`inline-flex shrink-0 items-center justify-center ${sz.icon} [&_svg]:size-full`}
                aria-hidden
              >
                {leftIcon}
              </span>
            ) : null}
            {children}
          </span>
          <span
            className={`${crossFade} col-start-1 row-start-1 ${vn.loaderText} ${loaderVisible}`}
            aria-hidden={asyncState !== "loading"}
          >
            <Spinner
              className={`${sz.spinner} animate-spin motion-reduce:animate-none`}
            />
          </span>
          <span
            className={`${crossFade} col-start-1 row-start-1 text-b-success ${successVisible}`}
            aria-hidden={asyncState !== "success"}
          >
            <IconCheck className={sz.icon} />
          </span>
          <span
            className={`${crossFade} col-start-1 row-start-1 text-b-danger ${errorVisible}`}
            aria-hidden={asyncState !== "error"}
          >
            <IconCross className={sz.icon} />
          </span>
        </span>
      </button>
    );
  },
);
