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
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
} from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow, SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import "../utils/glossInteractive.css";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";

export type CloseButtonSize = ComponentSize;

export type CloseButtonVariant =
  | "default"
  | "primary"
  | "outline"
  | "secondary"
  | "ghost"
  | "gloss";

type VariantVisual = {
  root: string;
  focusOutline: string;
  convergeBg: string;
};

const CLOSE_BUTTON_HAS_HOVER_SHADOW = new Set<CloseButtonVariant>([
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
]);

const CLOSE_BUTTON_HOVER_VARIANT: Record<CloseButtonVariant, HoverVariant> = {
  default: "default",
  primary: "primary",
  outline: "default",
  secondary: "secondary",
  ghost: "default",
  gloss: "default",
};

const CLOSE_BUTTON_VARIANT: Record<CloseButtonVariant, VariantVisual> = {
  default: {
    root: "bg-surface text-foreground border-token",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  primary: {
    root: "bg-primary text-primary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-primary-fill"),
  },
  outline: {
    root: "bg-transparent border-token text-foreground",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  secondary: {
    root: "bg-secondary text-secondary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  ghost: {
    root: "bg-transparent text-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  gloss: {
    root: "",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
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
  variant?: CloseButtonVariant;
  size?: CloseButtonSize;
  animated?: boolean;
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
    const isGloss = variant === "gloss";

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

    const vn = CLOSE_BUTTON_VARIANT[variant];
    const sizeClasses = CLOSE_BUTTON_SIZE[size];

    const btnShadow = useMemo(
      () =>
        CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant)
          ? firstLevelHoverShadow()
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
        if (isGloss) {
          animateGlossInteractiveHoverLift(el, true);
        } else {
          animateInteractiveHoverLift(el, true, undefined, btnShadow);
        }
      },
      [btnShadow, disabled, isGloss, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el || disabled) return;
        if (isGloss) {
          animateGlossInteractiveHoverLift(el, false);
        } else {
          animateInteractiveHoverLift(el, false, undefined, btnShadow);
        }
      },
      [disabled, btnShadow, isGloss, onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled || !animated) return;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;

        if (isGloss) {
          void animateGlossInteractivePressSqueeze(
            el,
            hoverPointerInsideRef.current,
          );
          return;
        }

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
      [animated, btnShadow, disabled, isGloss, onPointerDown],
    );

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "relative z-0 flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none",
          !isGloss && SHADOW_LIFT_MOTION_CLASS,
          !disabled && !isGloss && hoverVariant(CLOSE_BUTTON_HOVER_VARIANT[variant]),
          "overflow-hidden",
          isGloss ? cn("gloss-btn", GLOSS_INTERACTIVE_MOTION_CLASS) : "will-change-transform origin-center",
          sizeClasses.root,
          !isGloss && vn.root,
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
