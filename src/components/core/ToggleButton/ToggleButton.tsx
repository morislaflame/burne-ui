import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useToggleButtonFillAnimation } from "./useToggleButtonFillAnimation";
import { Text, type TextVariant } from "@/components/core/Text";
import { useOptionalToggleButtonGroupContext } from "./toggleButtonGroupContext";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { useOptionalButtonGroupSegment } from "@/components/core/utils/buttonGroupContext";
import {
  buttonGroupOverlapBorderClasses,
  buttonGroupRoundingClasses,
  type ButtonGroupSegment,
} from "@/components/core/utils/buttonGroupSegment";
import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
  shadowSm,
} from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

export type ToggleButtonSize = ComponentSize;

export type ToggleButtonVariant = "default" | "outline" | "ghost";

export type ToggleButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed" | "aria-checked" | "role" | "value"
> & {
  /** Идентификатор внутри `ToggleButtonGroup`. */
  value?: string;
  /** Склейка с соседями в `ToggleButtonGroup` (без `separated`). */
  groupSegment?: ButtonGroupSegment;
  /** Контролируемое состояние «нажато» (вне группы или override). */
  pressed?: boolean;
  /** Начальное состояние (неконтролируемый режим). */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Поверхность в покое. По умолчанию `default`. */
  variant?: ToggleButtonVariant;
  /** Габариты по высоте как у `Button`, без `min-w-button-*`. */
  size?: ToggleButtonSize;
  /** Иконка слева от подписи. */
  leftIcon?: ReactNode;
  /** Иконка справа от подписи. */
  rightIcon?: ReactNode;
  /** Включить hover-lift и squeeze при нажатии. По умолчанию `true`. */
  animated?: boolean;
};

const TOGGLE_BUTTON_TEXT_VARIANT: Record<ToggleButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const TOGGLE_BUTTON_SIZE: Record<
  ToggleButtonSize,
  { root: string; icon: string }
> = {
  small: {
    root: `${CONTROL_SIZE_LAYOUT.small.h} min-w-fit ${CONTROL_SIZE_LAYOUT.small.padX}`,
    icon: CONTROL_SIZE_LAYOUT.small.icon,
  },
  base: {
    root: `${CONTROL_SIZE_LAYOUT.base.h} min-w-fit ${CONTROL_SIZE_LAYOUT.base.padX}`,
    icon: CONTROL_SIZE_LAYOUT.base.icon,
  },
  mid: {
    root: `${CONTROL_SIZE_LAYOUT.mid.h} min-w-fit ${CONTROL_SIZE_LAYOUT.mid.padX}`,
    icon: CONTROL_SIZE_LAYOUT.mid.icon,
  },
  large: {
    root: `${CONTROL_SIZE_LAYOUT.large.h} min-w-fit ${CONTROL_SIZE_LAYOUT.large.padX}`,
    icon: CONTROL_SIZE_LAYOUT.large.icon,
  },
};

type ToggleButtonVariantVisual = {
  idle: string;
  pressedBorder: string;
};

const TOGGLE_BUTTON_VARIANT: Record<ToggleButtonVariant, ToggleButtonVariantVisual> = {
  default: {
    idle: "border-token bg-surface text-foreground",
    pressedBorder: "border-primary",
  },
  outline: {
    idle: "bg-transparent border-token text-foreground",
    pressedBorder: "border-primary",
  },
  ghost: {
    idle: "border border-transparent bg-transparent text-foreground",
    pressedBorder: "border-transparent",
  },
};

function useMergedPressed(
  pressed: boolean | undefined,
  defaultPressed: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultPressed));
  const value = isControlled ? Boolean(pressed) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      className = "",
      value: itemValue,
      groupSegment: groupSegmentProp,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      variant: variantProp,
      size: sizeProp,
      type = "button",
      leftIcon,
      rightIcon,
      animated = true,
      disabled: disabledProp = false,
      children,
      onClick,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const groupCtx = useOptionalToggleButtonGroupContext();
    const segmentCtx = useOptionalButtonGroupSegment();
    const groupSegment = groupSegmentProp ?? segmentCtx?.segment;

    const inGroup = groupCtx != null && itemValue != null;
    const isSingleGroup = groupCtx?.type === "single";

    const size = sizeProp ?? groupCtx?.size ?? segmentCtx?.buttonSize ?? "base";
    const variant = variantProp ?? groupCtx?.variant ?? "default";
    const disabled = disabledProp || Boolean(groupCtx?.disabled);

    const [localPressed, setLocalPressed] = useMergedPressed(
      inGroup ? undefined : pressedProp,
      inGroup ? false : defaultPressed,
    );

    const pressedFromGroup = inGroup ? groupCtx!.isSelected(itemValue!) : localPressed;
    const pressed = inGroup
      ? pressedProp !== undefined
        ? Boolean(pressedProp)
        : pressedFromGroup
      : pressedProp !== undefined
        ? Boolean(pressedProp)
        : localPressed;

    const btnRef = useRef<HTMLButtonElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const hoverPointerInsideRef = useRef(false);

    const { animateTo } = useToggleButtonFillAnimation(pressed, fillRef);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      const el = btnRef.current;
      if (!el || !disabled) return;
      hoverPointerInsideRef.current = false;
      killMotion(el);
    }, [disabled]);

    const btnShadow = useMemo(() => ({ hover: shadowSm() }), []);

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented || disabled || !animated) return;
        if (shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        hoverPointerInsideRef.current = true;
        animateInteractiveHoverLift(el, true, undefined, btnShadow);
      },
      [animated, btnShadow, disabled, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverPointerInsideRef.current = false;
        if (!animated || shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el || disabled) return;
        animateInteractiveHoverLift(el, false, undefined, btnShadow);
      },
      [animated, btnShadow, disabled, onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled || !animated) return;
        if (prefersReducedInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        void animateInteractivePressSqueeze(el).then(() => {
          const btn = btnRef.current;
          if (!btn || disabled || shouldSkipInteractiveHoverLift()) return;
          if (hoverPointerInsideRef.current) {
            animateInteractiveHoverLift(btn, true, undefined, btnShadow);
          }
        });
      },
      [animated, btnShadow, disabled, onPointerDown],
    );

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;

        if (inGroup && itemValue != null) {
          // В группе состояние и заливку ведёт selection — не toggl'им локально:
          // в single повторный клик не меняет value, optimistic animateTo(false) ломал контраст текста.
          groupCtx!.select(itemValue);
          return;
        }

        const next = !pressed;
        animateTo(next);

        setLocalPressed(next);
        onPressedChange?.(next);
      },
      [
        animateTo,
        disabled,
        groupCtx,
        inGroup,
        itemValue,
        onClick,
        onPressedChange,
        pressed,
        setLocalPressed,
      ],
    );

    const sz = TOGGLE_BUTTON_SIZE[size];
    const vn = TOGGLE_BUTTON_VARIANT[variant];
    const roundingClass = groupSegment ? buttonGroupRoundingClasses(groupSegment) : "rounded-base";
    const groupGlue = groupSegment
      ? cn(
          buttonGroupOverlapBorderClasses(groupSegment),
          "z-0 hover:z-[2] focus-visible:z-[2] active:z-[2]",
        )
      : "";

    return (
      <button
        ref={setRefs}
        type={type}
        disabled={disabled}
        data-toggle-button-value={itemValue}
        role={inGroup && isSingleGroup ? "radio" : undefined}
        aria-pressed={!inGroup || !isSingleGroup ? pressed : undefined}
        aria-checked={inGroup && isSingleGroup ? pressed : undefined}
        tabIndex={inGroup && isSingleGroup ? groupCtx!.tabIndexFor(itemValue!) : undefined}
        className={cn(
          "group/toggle relative inline-flex origin-center items-center justify-center overflow-hidden outline-none",
          "font-medium focus-ring",
          "animate-shadow will-change-transform",
          !pressed && !disabled && hoverVariant(),
          groupGlue,
          vn.idle,
          pressed && cn(vn.pressedBorder, "bg-transparent"),
          pressed ? "text-primary-foreground" : "text-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          sz.root,
          roundingClass,
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        {...rest}
      >
        <span
          ref={fillRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px z-0 origin-center bg-primary transition-colors duration-normal ease-out motion-reduce:transition-none group-hover/toggle:bg-primary-hover",
            roundingClass,
          )}
        />
        <span className="relative z-[1] inline-flex min-w-0 items-center justify-center gap-xsmall">
          {leftIcon != null ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
                sz.icon,
              )}
              aria-hidden
            >
              {leftIcon}
            </span>
          ) : null}
          {children != null ? (
            <Text variant={TOGGLE_BUTTON_TEXT_VARIANT[size]} as="span" inheritColor className="min-w-0 shrink">
              {children}
            </Text>
          ) : null}
          {rightIcon != null ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
                sz.icon,
              )}
              aria-hidden
            >
              {rightIcon}
            </span>
          ) : null}
        </span>
      </button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";
