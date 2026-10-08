import { forwardRef } from "react";
 
import { Text } from "@/components/core/Text";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";
 
import { useButtonClassNames, useOptionalButtonContext, useOptionalButtonMotionScope } from "./buttonContext";
import { buttonContentClass, buttonErrorLayerClass, buttonIconClass, buttonIconSvgClass, buttonLabelClass, buttonLoaderLayerClass, buttonSpinnerClass, buttonSpinnerInnerClass, buttonSuccessLayerClass, buttonTextClass, BUTTON_SIZE_TEXT_VARIANT, BUTTON_SPINNER_MOTION_CLASS } from "./buttonStyles";
import type {
  ButtonContentProps,
  ButtonErrorProps,
  ButtonIconCheckProps,
  ButtonIconCrossProps,
  ButtonIconProps,
  ButtonLabelProps,
  ButtonLoaderProps,
  ButtonSpinnerProps,
  ButtonSuccessProps,
  ButtonTextProps,
} from "./buttonTypes";
 
export function ButtonSpinner({ className }: ButtonSpinnerProps) {
  return (
    <span
      className={cn(buttonSpinnerInnerClass(), className)}
      aria-hidden
    />
  );
}
 
export function ButtonIconCheck({ className }: ButtonIconCheckProps) {
  return (
    <svg
      className={cn(buttonIconSvgClass(), className)}
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
 
export function ButtonIconCross({ className }: ButtonIconCrossProps) {
  return (
    <svg
      className={cn(buttonIconSvgClass(), className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
 
export const ButtonContent = forwardRef<HTMLSpanElement, ButtonContentProps>(
  function ButtonContent({ className = "", children, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const scope = useOptionalButtonMotionScope();
 
    const setRef = (node: HTMLSpanElement | null) => {
      if (ref != null) mergeForwardedRef(ref, node);
      else if (ctx?.contentMotionRef) ctx.contentMotionRef.current = node;
      if (ctx?.groupSegment) scope?.registerTarget("root", node);
    };
 
    return (
      <span
        ref={setRef}
        className={buttonContentClass({
          groupSegment: Boolean(ctx?.groupSegment),
          slotClass: slotClassNames.content,
          className,
        })}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
 
ButtonContent.displayName = "ButtonContent";
 
export const ButtonLabel = forwardRef<HTMLSpanElement, ButtonLabelProps>(
  function ButtonLabel(
    { className = "", children, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const slotClassNames = useButtonClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalButtonMotionScope(),
      slot: "label",
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
    });
 
    return (
      <span
        ref={setRef}
        className={buttonLabelClass({
          slotClass: slotClassNames.label,
          className,
        })}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </span>
    );
  },
);
 
ButtonLabel.displayName = "ButtonLabel";
 
export function ButtonIcon({
  className = "",
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: ButtonIconProps) {
  const ctx = useOptionalButtonContext();
  const slotClassNames = useButtonClassNames();
  const size = ctx?.size ?? "base";
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalButtonMotionScope(),
    slot: "icon",
    motion,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <span
      ref={setRef}
      className={buttonIconClass(size, cn(slotClassNames.icon, className))}
      aria-hidden
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}
 
ButtonIcon.displayName = "ButtonIcon";
 
export function ButtonText({
  className = "",
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: ButtonTextProps) {
  const ctx = useOptionalButtonContext();
  const slotClassNames = useButtonClassNames();
  const size = ctx?.size ?? "base";
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalButtonMotionScope(),
    slot: "text",
    motion,
    onPointerOver,
    onPointerOut,
  });
 
  return (
    <Text
      ref={setRef}
      variant={BUTTON_SIZE_TEXT_VARIANT[size]}
      as="span"
      inheritColor
      className={buttonTextClass(slotClassNames.text, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </Text>
  );
}
 
ButtonText.displayName = "ButtonText";
 
export const ButtonLoader = forwardRef<HTMLSpanElement, ButtonLoaderProps>(
  function ButtonLoader({ className = "", motion, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const loaderTextClass = ctx?.loaderTextClass ?? "";
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalButtonMotionScope(),
      slot: "loader",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <span
        ref={setRef}
        className={buttonLoaderLayerClass(
          loaderTextClass,
          cn(slotClassNames.loader, className),
        )}
        aria-hidden
        {...rest}
      >
        <ButtonSpinner
          className={cn(buttonSpinnerClass(size), BUTTON_SPINNER_MOTION_CLASS)}
        />
      </span>
    );
  },
);
 
ButtonLoader.displayName = "ButtonLoader";
 
export const ButtonSuccess = forwardRef<HTMLSpanElement, ButtonSuccessProps>(
  function ButtonSuccess({ className = "", motion, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const layout = CONTROL_SIZE_LAYOUT[size];
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalButtonMotionScope(),
      slot: "success",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <span
        ref={setRef}
        className={buttonSuccessLayerClass(cn(slotClassNames.success, className))}
        aria-hidden
        {...rest}
      >
        <ButtonIconCheck className={layout.icon} />
      </span>
    );
  },
);
 
ButtonSuccess.displayName = "ButtonSuccess";
 
export const ButtonError = forwardRef<HTMLSpanElement, ButtonErrorProps>(
  function ButtonError({ className = "", motion, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const layout = CONTROL_SIZE_LAYOUT[size];
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalButtonMotionScope(),
      slot: "error",
      motion,
      forwardedRef: ref,
    });
 
    return (
      <span
        ref={setRef}
        className={buttonErrorLayerClass(cn(slotClassNames.error, className))}
        aria-hidden
        {...rest}
      >
        <ButtonIconCross className={layout.icon} />
      </span>
    );
  },
);
 
ButtonError.displayName = "ButtonError";
 