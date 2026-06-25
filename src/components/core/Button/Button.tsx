import { ensureRippleEase, gsap, killMotion } from "@/components/core/utils/gsapMotion";
import type {
  ButtonHTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
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
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow, SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import {
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
} from "@/components/core/utils/glossInteractiveMotion";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { getMotionConfig, motionFeedbackExpand, motionInteractive } from "@/components/core/utils/motionConfig";
import { Ripple } from "@/components/core/Ripple";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupSegment";
import {
  buttonGroupOverlapBorderClasses,
  buttonGroupRoundingClasses,
} from "@/components/composite/ButtonGroup/buttonGroupSegment";
import { Text, type TextVariant } from "@/components/core/Text";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import {
  buttonRootClass,
  buttonSpinnerClass,
  CONTROL_SIZE_LAYOUT,
} from "@/components/core/utils/controlSizeLayout";

import "../utils/glossInteractive.css";

/** Состояние асинхронного сценария после клика. */
export type ButtonAsyncState = "idle" | "loading" | "success" | "error";

/** Размер кнопки: высота, отступы, типографика, спиннер и иконки результата. */
export type ButtonSize = ComponentSize;

/** Визуальный вариант заливки и обводки. */
export type ButtonVariant =
  | "default"
  | "primary"
  | "outline"
  | "secondary"
  | "ghost"
  | "gloss";

/** Семантический статус кнопки */
export type ButtonStatus = "default" | "danger" | "success" | "info" | "warning";

type VariantVisual = {
  root: string;
  loaderText: string;
};

/** Варианты, у которых тень появляется при hover (анимируем shadow-sm). */
const BUTTON_VARIANT_HAS_HOVER_SHADOW = new Set<ButtonVariant>([
  "default", "primary", "outline", "secondary", "ghost",
]);

const BUTTON_VARIANT: Record<ButtonVariant, VariantVisual> = {
  default: {
    root: "bg-surface text-foreground border-token",
    loaderText: "text-foreground",
  },
  primary: {
    root: "bg-primary text-primary-foreground border border-transparent",
    loaderText: "text-primary-foreground",
  },
  outline: {
    root: "bg-transparent border-token text-foreground",
    loaderText: "text-foreground",
  },
  secondary: {
    root: "bg-secondary text-secondary-foreground border border-transparent",
    loaderText: "text-secondary-foreground",
  },
  ghost: {
    root: "bg-transparent text-foreground border border-transparent",
    loaderText: "text-foreground",
  },
  gloss: {
    root: "",
    loaderText: "text-foreground",
  },
};

/** Тинт стекла по статусу для `variant="gloss"` (нейтральные слои — в CSS). */
const BUTTON_GLOSS_STATUS: Record<ButtonStatus, string> = {
  default: "",
  danger: "gloss-btn-danger",
  success: "gloss-btn-success",
  info: "gloss-btn-info",
  warning: "gloss-btn-warning",
};

const BUTTON_STATUS_FOCUS_OUTLINE: Record<ButtonStatus, string> = {
  default: "focus-visible:outline-primary",
  danger: "focus-visible:outline-danger",
  success: "focus-visible:outline-success",
  info: "focus-visible:outline-info",
  warning: "focus-visible:outline-warning",
};

const BUTTON_STATUS_RIPPLE: Record<ButtonStatus, string> = {
  default: colorToken("converge-ripple-neutral"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};

const BUTTON_PRIMARY_STATUS_RIPPLE: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};

const BUTTON_STATUS_TEXT: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

const BUTTON_STATUS_SURFACE_TINT: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: "bg-surface-tint-danger border-token",
  success: "bg-surface-tint-success border-token",
  info: "bg-surface-tint-info border-token",
  warning: "bg-surface-tint-warning border-token",
};

const BUTTON_STATUS_FILL: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: "bg-danger border border-transparent text-danger-foreground",
  success: "bg-success border border-transparent text-success-foreground",
  info: "bg-info border border-transparent text-info-foreground",
  warning: "bg-warning border border-transparent text-warning-foreground",
};

const BUTTON_STATUS_FILL_TEXT: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: "text-danger-foreground",
  success: "text-success-foreground",
  info: "text-info-foreground",
  warning: "text-warning-foreground",
};

const BUTTON_STATUS_OUTLINE_BORDER: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: "border-token-danger",
  success: "border-token-success",
  info: "border-token-info",
  warning: "border-token-warning",
};

function buttonVariantRootClass(variant: ButtonVariant, status: ButtonStatus): string {
  const { root } = BUTTON_VARIANT[variant];
  if (variant === "outline" && status !== "default") {
    return "bg-transparent text-foreground";
  }
  return root;
}

function buttonHoverVariant(variant: ButtonVariant, status: ButtonStatus): HoverVariant {
  if (status === "default") {
    switch (variant) {
      case "default":
        return "default";
      case "primary":
        return "primary";
      case "outline":
        return "default";
      case "secondary":
        return "secondary";
      case "ghost":
        return "default";
      case "gloss":
        return "default";
    }
  }

  switch (variant) {
    case "default":
      return `${status}-tint-hover` as HoverVariant;
    case "primary":
      return `${status}-fill` as HoverVariant;
    case "outline":
    case "ghost":
      return status as HoverVariant;
    case "secondary":
      return "secondary";
    case "gloss":
      return "default";
  }
}

function buttonStatusClass(variant: ButtonVariant, status: ButtonStatus): string {
  if (status === "default") return "";

  switch (variant) {
    case "default":
      return cn(BUTTON_STATUS_SURFACE_TINT[status], BUTTON_STATUS_TEXT[status]);
    case "primary":
      return BUTTON_STATUS_FILL[status];
    case "outline":
      return cn(BUTTON_STATUS_OUTLINE_BORDER[status], BUTTON_STATUS_TEXT[status]);
    case "secondary":
      return BUTTON_STATUS_TEXT[status];
    case "ghost":
      return BUTTON_STATUS_TEXT[status];
    case "gloss":
      return "";
  }
}

/** Типографика подписи — через `Text`, без `text-*` на корне кнопки. */
const BUTTON_SIZE_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Склейка с соседями в `ButtonGroup`: без зазора, общий контур скругления только по краям группы.
   * Задаётся автоматически при использовании внутри `<ButtonGroup>`.
   */
  groupSegment?: ButtonGroupSegment;
  /** Стиль заливки и акцента. По умолчанию `default`. */
  variant?: ButtonVariant;
  /** Семантический статус: меняет акцент, но не тип поверхности (`variant`). */
  status?: ButtonStatus;
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

function ButtonFeedbackExpandRipple({
  size,
  tone,
  onDone,
}: {
  size: number;
  tone: "success" | "error";
  onDone: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let finished = false;
    killMotion(el);

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableFeedbackExpand;

    if (reduceMotion) {
      onDoneRef.current();
      return;
    }

    const tween = gsap.fromTo(
      el,
      { scale: 0, autoAlpha: 0.5 },
      {
        scale: 1,
        autoAlpha: 0,
        ...motionFeedbackExpand(),
        ease: ensureRippleEase(),
        overwrite: "auto",
        onComplete: () => {
          if (!finished) onDoneRef.current();
        },
      },
    );

    return () => {
      finished = true;
      tween.kill();
      killMotion(el);
    };
  }, [size, tone]);

  return (
    <span
      ref={ref}
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 rounded-full will-change-[transform,opacity]"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background:
          tone === "success"
            ? "color-mix(in oklab, var(--color-success) 55%, transparent)"
            : "color-mix(in oklab, var(--color-danger) 55%, transparent)",
        transform: "scale(0)",
      }}
      aria-hidden
    />
  );
}

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

type ButtonAsyncLayerKind = "label" | "loader" | "success" | "error";

const BUTTON_ASYNC_LAYER_INIT_ATTR = "data-button-async-layer-init";

const BUTTON_ASYNC_LAYER_SCALE: Record<
  ButtonAsyncLayerKind,
  { in: number; out: number }
> = {
  label: { in: 1, out: 0.92 },
  loader: { in: 1, out: 0.85 },
  success: { in: 1, out: 0.85 },
  error: { in: 1, out: 0.85 },
};

function isButtonAsyncLayerActive(
  state: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
): boolean {
  switch (layer) {
    case "label":
      return state === "idle";
    case "loader":
      return state === "loading";
    case "success":
      return state === "success";
    case "error":
      return state === "error";
  }
}

function applyButtonAsyncLayerInstant(
  el: HTMLElement,
  state: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
) {
  const active = isButtonAsyncLayerActive(state, layer);
  const { in: scaleIn, out: scaleOut } = BUTTON_ASYNC_LAYER_SCALE[layer];
  gsap.set(el, {
    autoAlpha: active ? 1 : 0,
    scale: active ? scaleIn : scaleOut,
  });
}

function createButtonAsyncLayerRefCallback(
  ref: RefObject<HTMLElement | null>,
  initialState: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && !node.hasAttribute(BUTTON_ASYNC_LAYER_INIT_ATTR)) {
      node.setAttribute(BUTTON_ASYNC_LAYER_INIT_ATTR, "");
      applyButtonAsyncLayerInstant(node, initialState, layer);
    }
  };
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
      status = "default",
      size: sizeProp,
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
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const size = sizeProp ?? groupCtx?.buttonSize ?? "base";
    const userDisabled = Boolean(disabledProp);
    const isGloss = variant === "gloss";
    const btnRef = useRef<HTMLButtonElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const loaderRef = useRef<HTMLSpanElement>(null);
    const successRef = useRef<HTMLSpanElement>(null);
    const errorRef = useRef<HTMLSpanElement>(null);
    const hoverPointerInsideRef = useRef(false);
    const asyncStateRef = useRef<ButtonAsyncState>("idle");
    const expandId = useRef(0);
    const prevAsyncRef = useRef<ButtonAsyncState>("idle");
    const prevCrossfadeAsyncRef = useRef<ButtonAsyncState | undefined>(undefined);
    const asyncInFlight = useRef(false);

    const [internalAsync, setInternalAsync] =
      useState<ButtonAsyncState>("idle");
    const isControlled = asyncStateProp !== undefined;
    const asyncState: ButtonAsyncState = isControlled
      ? asyncStateProp!
      : internalAsync;
    asyncStateRef.current = asyncState;

    const initialAsyncRef = useRef(asyncState);

    const bindLabelRef = useMemo(
      () => createButtonAsyncLayerRefCallback(labelRef, initialAsyncRef.current, "label"),
      [],
    );
    const bindLoaderRef = useMemo(
      () => createButtonAsyncLayerRefCallback(loaderRef, initialAsyncRef.current, "loader"),
      [],
    );
    const bindSuccessRef = useMemo(
      () => createButtonAsyncLayerRefCallback(successRef, initialAsyncRef.current, "success"),
      [],
    );
    const bindErrorRef = useMemo(
      () => createButtonAsyncLayerRefCallback(errorRef, initialAsyncRef.current, "error"),
      [],
    );

    const [expandRipples, setExpandRipples] = useState<ExpandRipple[]>([]);

    const bindGlossRef = useMemo(
      () => createGlossInteractiveRefCallback(btnRef, isGloss),
      [isGloss],
    );

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        bindGlossRef(node);
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [bindGlossRef, ref],
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

    useLayoutEffect(() => {
      const label = labelRef.current;
      const loader = loaderRef.current;
      const success = successRef.current;
      const error = errorRef.current;
      if (!label || !loader || !success || !error) return;

      const reduceMotion =
        prefersReducedInteractiveHoverLift() || !getMotionConfig().enableAsyncButtonCrossfade;
      const vars = motionInteractive();

      const layers = [
        { el: label, active: asyncState === "idle", scaleIn: 1, scaleOut: 0.92 },
        { el: loader, active: asyncState === "loading", scaleIn: 1, scaleOut: 0.85 },
        { el: success, active: asyncState === "success", scaleIn: 1, scaleOut: 0.85 },
        { el: error, active: asyncState === "error", scaleIn: 1, scaleOut: 0.85 },
      ] as const;

      if (prevCrossfadeAsyncRef.current === undefined) {
        prevCrossfadeAsyncRef.current = asyncState;
        for (const { el, active, scaleIn, scaleOut } of layers) {
          killMotion(el);
          gsap.set(el, {
            autoAlpha: active ? 1 : 0,
            scale: active ? scaleIn : scaleOut,
          });
        }
        return;
      }

      if (prevCrossfadeAsyncRef.current === asyncState) return;
      prevCrossfadeAsyncRef.current = asyncState;

      for (const { el, active, scaleIn, scaleOut } of layers) {
        killMotion(el);
        if (reduceMotion) {
          gsap.set(el, {
            autoAlpha: active ? 1 : 0,
            scale: active ? scaleIn : scaleOut,
          });
          continue;
        }
        gsap.to(el, {
          autoAlpha: active ? 1 : 0,
          scale: active ? scaleIn : scaleOut,
          ...vars,
          overwrite: "auto",
        });
      }
    }, [asyncState]);

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
          ? firstLevelHoverShadow()
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
        if (isGloss) {
          animateGlossInteractiveHoverLift(el, true);
        } else {
          animateInteractiveHoverLift(el, true, undefined, btnShadow);
        }
      },
      [blocked, btnShadow, isGloss, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (blocked) return;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        if (isGloss) {
          animateGlossInteractiveHoverLift(el, false);
        } else {
          animateInteractiveHoverLift(el, false, undefined, btnShadow);
        }
      },
      [blocked, btnShadow, isGloss, onPointerLeave],
    );

    function onAnimeDown() {
      if (!animated || !btnRef.current || asyncState !== "idle") return;
      if (prefersReducedInteractiveHoverLift()) return;
      const el = btnRef.current;
      const afterPress = () => {
        const btn = btnRef.current;
        if (!btn || btn.disabled || asyncStateRef.current !== "idle") return;
        if (shouldSkipInteractiveHoverLift()) return;
        if (hoverPointerInsideRef.current) {
          if (isGloss) {
            animateGlossInteractiveHoverLift(btn, true);
          } else {
            animateInteractiveHoverLift(btn, true, undefined, btnShadow);
          }
        }
      };

      if (isGloss) {
        void animateGlossInteractivePressSqueeze(
          el,
          hoverPointerInsideRef.current,
        );
        return;
      }

      void animateInteractivePressSqueeze(el).then(afterPress);
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

    const layout = CONTROL_SIZE_LAYOUT[size];
    const sizeRoot = buttonRootClass(size, iconOnly);

    const idleSurfaceMotion = blocked ? "" : hoverVariant(buttonHoverVariant(variant, status));
    const statusClass = buttonStatusClass(variant, status);
    const focusOutlineClass = BUTTON_STATUS_FOCUS_OUTLINE[status];
    const convergeRippleColor =
      variant === "primary"
        ? (status === "default"
            ? colorToken("converge-ripple-primary-fill")
            : BUTTON_PRIMARY_STATUS_RIPPLE[status])
        : BUTTON_STATUS_RIPPLE[status];
    const loaderTextClass =
      variant === "primary" && status !== "default"
        ? BUTTON_STATUS_FILL_TEXT[status]
        : vn.loaderText;

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
          focusOutlineClass,
          sizeRoot,
          isGloss
            ? cn(
                "gloss-btn",
                GLOSS_INTERACTIVE_MOTION_CLASS,
                BUTTON_GLOSS_STATUS[status],
              )
            : cn(
                buttonVariantRootClass(variant, status),
                statusClass,
                SHADOW_LIFT_MOTION_CLASS,
                idleSurfaceMotion,
              ),
          userDisabled ? "opacity-50" : "",
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
            color={convergeRippleColor}
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
            <ButtonFeedbackExpandRipple
              key={rp.id}
              size={rp.size}
              tone={rp.tone}
              onDone={() => dismissExpand(rp.id)}
            />
          ))}
        </span>

        <span className="relative z-[1] grid place-items-center">
          <span
            ref={bindLabelRef}
            className="col-start-1 row-start-1 inline-flex min-w-0 items-center justify-center gap-xsmall"
          >
            {leftIcon != null ? (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
                  layout.icon,
                )}
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
          <span
            ref={bindLoaderRef}
            className={`col-start-1 row-start-1 flex items-center justify-center ${loaderTextClass}`}
            aria-hidden={asyncState !== "loading"}
          >
            <Spinner
              className={cn(
                buttonSpinnerClass(size),
                "animate-spin motion-reduce:animate-none",
              )}
            />
          </span>
          <span
            ref={bindSuccessRef}
            className="col-start-1 row-start-1 flex items-center justify-center text-success"
            aria-hidden={asyncState !== "success"}
          >
            <IconCheck className={layout.icon} />
          </span>
          <span
            ref={bindErrorRef}
            className="col-start-1 row-start-1 flex items-center justify-center text-danger"
            aria-hidden={asyncState !== "error"}
          >
            <IconCross className={layout.icon} />
          </span>
        </span>
      </button>
    );
  },
);
