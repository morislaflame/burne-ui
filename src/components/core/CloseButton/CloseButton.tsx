import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
} from "react";
import { IoClose } from "react-icons/io5";

import { Ripple } from "@/components/core/Ripple";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
  shadowSm,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";

export type CloseButtonSize = ComponentSize;

/** Визуальный вариант — как у `Button`, без статусных тонов. */
export type CloseButtonVariant = "default" | "outline" | "secondary" | "ghost";

type VariantVisual = {
  root: string;
  focusOutline: string;
  convergeBg: string;
  hoverIdle: string;
};

const CLOSE_BUTTON_HAS_HOVER_SHADOW = new Set<CloseButtonVariant>([
  "default",
  "outline",
  "secondary",
  "ghost",
]);

const CLOSE_BUTTON_VARIANT: Record<CloseButtonVariant, VariantVisual> = {
  default: {
    root: "bg-primary text-primary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-primary-fill"),
    hoverIdle: "hover:bg-primary-hover",
  },
  outline: {
    root: "bg-transparent border-token text-foreground",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    hoverIdle: "hover:bg-primary-tint",
  },
  secondary: {
    root: "bg-secondary text-secondary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    hoverIdle: "hover:bg-secondary-hover",
  },
  ghost: {
    root: "bg-transparent text-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
    hoverIdle: "hover:bg-primary-tint",
  },
};

const CLOSE_BUTTON_SIZE: Record<
  CloseButtonSize,
  { root: string; icon: string }
> = {
  small: {
    root: CONTROL_SIZE_LAYOUT.small.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.small.toggleIcon,
  },
  base: {
    root: CONTROL_SIZE_LAYOUT.base.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.base.toggleIcon,
  },
  mid: {
    root: CONTROL_SIZE_LAYOUT.mid.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.mid.toggleIcon,
  },
  large: {
    root: CONTROL_SIZE_LAYOUT.large.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.large.toggleIcon,
  },
};

export type CloseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Стиль заливки. По умолчанию `default`. */
  variant?: CloseButtonVariant;
  /** Диаметр кнопки и иконки. По умолчанию `base`. */
  size?: CloseButtonSize;
  /** Лёгкий scale при нажатии. По умолчанию `true`. */
  animated?: boolean;
  /**
   * Converge-ripple от точки нажатия (`<Ripple />` внутри кнопки, тон под `variant`).
   * @default false
   */
  ripple?: boolean;
};

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(
    {
      variant = "default",
      size = "base",
      animated = true,
      ripple = false,
      className,
      disabled,
      type = "button",
      "aria-label": ariaLabel = "Закрыть",
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const hoverPointerInsideRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const vn = CLOSE_BUTTON_VARIANT[variant];
    const sizeClasses = CLOSE_BUTTON_SIZE[size];

    const btnShadow = useMemo(
      () =>
        CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant)
          ? { hover: shadowSm() }
          : undefined,
      [variant],
    );

    useEffect(() => {
      const el = btnRef.current;
      if (!el) return;
      if (disabled) {
        killMotion(el);
        hoverPointerInsideRef.current = false;
        el.style.removeProperty("--el-shadow");
      }
    }, [disabled]);

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented || disabled) return;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        hoverPointerInsideRef.current = true;
        animateInteractiveHoverLift(el, true, undefined, btnShadow);
      },
      [btnShadow, disabled, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el || disabled) return;
        animateInteractiveHoverLift(el, false, undefined, btnShadow);
      },
      [disabled, btnShadow, onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled || !animated) return;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const b = btnRef.current;
          if (
            !b ||
            disabled ||
            !animated ||
            shouldSkipInteractiveHoverLift()
          )
            return;
          if (hoverPointerInsideRef.current) {
            animateInteractiveHoverLift(b, true, undefined, btnShadow);
          }
        });
      },
      [animated, btnShadow, disabled, onPointerDown],
    );

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "relative z-0 flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none",
          "animate-shadow button-idle-surface-transition motion-reduce:transition-none",
          "overflow-hidden will-change-transform origin-center",
          sizeClasses.root,
          vn.root,
          vn.hoverIdle,
          vn.focusOutline,
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {ripple ? (
          <Ripple
            color={vn.convergeBg}
            disabled={Boolean(disabled)}
            duration={getMotionConfig().rippleDefaultDuration}
            className="rounded-full"
          />
        ) : null}
        <IoClose
          aria-hidden
          className={cn(
            "relative z-[1] shrink-0 text-current",
            sizeClasses.icon,
          )}
        />
      </button>
    );
  },
);

CloseButton.displayName = "CloseButton";
