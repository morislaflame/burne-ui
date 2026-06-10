import { remove } from "animejs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
} from "react";
import { IoClose } from "react-icons/io5";

import { Ripple, type RippleColor } from "@/components/core/Ripple";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  initElementShadow,
  prefersReducedInteractiveHoverLift,
  SHADOW_MD,
  SHADOW_SM,
  useInteractiveHoverLiftContainerHandlers,
} from "@/components/core/utils/hoverInteractiveLift";
import { MOTION_RIPPLE_DEFAULT_DURATION_MS } from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

export type CloseButtonVariant = "default" | "outline";

const VARIANT: Record<
  CloseButtonVariant,
  {
    root: string;
    focusOutline: string;
    hoverIdle: string;
    ripple: RippleColor;
  }
> = {
  /** Серый фон (не акцентная «default»-кнопка). */
  default: {
    root: "border-token bg-primary-tint text-foreground",
    focusOutline: "focus-ring",
    hoverIdle: "hover:bg-primary-tint-strong",
    ripple: "neutral",
  },
  /** Как `Button` outline: `bordered-transparent` + нейтральный крест. */
  outline: {
    root: "bordered-transparent text-foreground",
    focusOutline: "focus-ring",
    hoverIdle: "hover:bg-primary-tint",
    ripple: "neutral",
  },
};

const CLOSE_SHADOW = { idle: SHADOW_SM(), hover: SHADOW_MD() };

export type CloseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Поверхность: серая заливка или outline как у `Button`. По умолчанию `default`. */
  variant?: CloseButtonVariant;
};

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(
    {
      variant = "default",
      className,
      disabled,
      type = "button",
      "aria-label": ariaLabel = "Закрыть",
      onPointerDown,
      onPointerOver,
      onPointerOut,
      ...rest
    },
    ref,
  ) {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const pointerInsideRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const vn = VARIANT[variant];

    const liftHandlers = useInteractiveHoverLiftContainerHandlers(
      btnRef,
      !disabled,
      pointerInsideRef,
      undefined,
      CLOSE_SHADOW,
    );

    useEffect(() => {
      const el = btnRef.current;
      if (!el || disabled) return;
      initElementShadow(el, SHADOW_SM());
    }, [disabled]);

    useEffect(() => {
      const el = btnRef.current;
      if (!el) return;
      if (disabled) {
        remove(el);
        pointerInsideRef.current = false;
        el.style.removeProperty("--el-shadow");
      }
    }, [disabled]);

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const b = btnRef.current;
          if (!b || disabled || prefersReducedInteractiveHoverLift()) return;
          if (pointerInsideRef.current) {
            animateInteractiveHoverLift(b, true, undefined, CLOSE_SHADOW);
          }
        });
      },
      [disabled, onPointerDown],
    );

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "relative z-0 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none",
          "animate-shadow button-idle-surface-transition motion-reduce:transition-none",
          "overflow-hidden will-change-transform origin-center",
          vn.root,
          vn.hoverIdle,
          vn.focusOutline,
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onPointerOver={(e) => {
          onPointerOver?.(e);
          if (!e.defaultPrevented && !disabled) liftHandlers.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOut?.(e);
          if (!disabled) liftHandlers.onPointerOut(e);
        }}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <Ripple
          color={vn.ripple}
          disabled={Boolean(disabled)}
          duration={MOTION_RIPPLE_DEFAULT_DURATION_MS}
        />
        <IoClose
          aria-hidden
          className="relative z-[1] icon-base shrink-0 text-current"
        />
      </button>
    );
  },
);

CloseButton.displayName = "CloseButton";
