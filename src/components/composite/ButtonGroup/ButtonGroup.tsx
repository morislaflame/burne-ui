import { Fragment, cloneElement, forwardRef, useMemo, type ForwardedRef, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
 
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
import { useSkinVariant } from "@/skins/skinContext";
import { isKitVariant } from "@/skins/resolveVariantVisual";
import { KIT_BUTTON_VARIANTS } from "@/components/core/Button/buttonTypes";
 
import { BUTTON_GROUP_ROLE, buttonGroupSeparatorA11yProps } from "./buttonGroupA11y";
import { resolveButtonGroupMotionDefaults, useButtonGroupSlotMotion } from "./buttonGroupAnimations";
import { buildButtonGroupSegment, isGroupSegmentSlot, isToggleButtonElement, resolveButtonGroupSegmentPosition } from "./buttonGroupAPI";
import { ButtonGroupClassNamesProvider, ButtonGroupLayoutProvider, ButtonGroupMotionProvider, ButtonGroupSegmentProvider, useButtonGroupClassNames } from "./buttonGroupContext";
import { buttonGroupRootClass, buttonGroupSeparatorClass } from "./buttonGroupStyles";
import type { ButtonGroupOrientation, ButtonGroupProps } from "./buttonGroupTypes";
import { useButtonGroupRootState } from "./useButtonGroupRootState";
 
export type {
  ButtonGroupProps,
  ButtonGroupTextProps,
  ButtonGroupOrientation,
  ButtonGroupSegment,
  ButtonGroupClassNames,
  ButtonGroupMotion,
  ButtonGroupPartMotion,
} from "./buttonGroupTypes";
 
function ButtonGroupSeparator({ orientation }: { orientation: ButtonGroupOrientation }) {
  const slotClassNames = useButtonGroupClassNames();
  return <span {...buttonGroupSeparatorA11yProps()} className={buttonGroupSeparatorClass(orientation, slotClassNames.separator)} />;
}
 
export const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroupRoot(
    {
      children: _children,
      className = "",
      classNames,
      orientation = "horizontal",
      segmented = false,
      size = "base",
      variant: variantProp,
      disabled,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const variant = useSkinVariant(variantProp);
    const { flat, segmentCount, layoutValue } = useButtonGroupRootState({
      children: _children,
      orientation,
      segmented,
      size,
      variant,
    });
    const motionDefaults = useMemo(() => resolveButtonGroupMotionDefaults(), []);
 
    let segmentIndex = -1;
 
    return (
      <ButtonGroupLayoutProvider value={layoutValue}>
        <ButtonGroupClassNamesProvider classNames={classNames}>
          <ButtonGroupMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
            <ButtonGroupRootSurface
              forwardedRef={ref}
              orientation={orientation}
              segmented={segmented}
              variant={variant}
              disabled={disabled}
              className={cn(classNames?.root, className)}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              rest={rest}
            >
              <ButtonGroupSegmentProvider
                segment={undefined}
                size={size}
                variant={variant}
                disabled={disabled}
              >
                {flat.map((child, i) => {
                  const childProps = child.props as {
                    disabled?: boolean;
                    variant?: string;
                  };
                  const extraToggleProps: Record<string, unknown> = {};
                  if (disabled && childProps.disabled === undefined) {
                    extraToggleProps.disabled = true;
                  }
                  if (
                    isToggleButtonElement(child) &&
                    variantProp != null &&
                    childProps.variant === undefined &&
                    (variantProp === "default" ||
                      variantProp === "outline" ||
                      variantProp === "ghost" ||
                      !isKitVariant(variantProp, KIT_BUTTON_VARIANTS))
                  ) {
                    extraToggleProps.variant = variantProp;
                  }
                  const resolvedChild =
                    Object.keys(extraToggleProps).length > 0
                      ? cloneElement(child as ReactElement<Record<string, unknown>>, extraToggleProps)
                      : child;

                  if (!isGroupSegmentSlot(child)) {
                    return <Fragment key={child.key ?? `bg-wrap-${i}`}>{resolvedChild}</Fragment>;
                  }
 
                  if (segmented) {
                    return (
                      <ButtonGroupSegmentProvider
                        key={child.key ?? `bg-item-${i}`}
                        segment={undefined}
                        size={size}
                        variant={variant}
                        disabled={disabled}
                      >
                        {resolvedChild}
                      </ButtonGroupSegmentProvider>
                    );
                  }
 
                  segmentIndex += 1;
                  const position = resolveButtonGroupSegmentPosition(segmentIndex, segmentCount);
                  const segment = buildButtonGroupSegment(orientation, position);
 
                  return (
                    <Fragment key={child.key ?? `bg-seg-${i}`}>
                      <ButtonGroupSegmentProvider
                        segment={segment}
                        size={size}
                        variant={variant}
                        disabled={disabled}
                      >
                        {resolvedChild}
                      </ButtonGroupSegmentProvider>
                      {isKitVariant(variant, KIT_BUTTON_VARIANTS) &&
                      position !== "last" &&
                      position !== "only" ? (
                        <ButtonGroupSeparator orientation={orientation} />
                      ) : null}
                    </Fragment>
                  );
                })}
              </ButtonGroupSegmentProvider>
            </ButtonGroupRootSurface>
          </ButtonGroupMotionProvider>
        </ButtonGroupClassNamesProvider>
      </ButtonGroupLayoutProvider>
    );
  },
);
 
ButtonGroupRoot.displayName = "ButtonGroup";
 
function ButtonGroupRootSurface({
  forwardedRef,
  orientation,
  segmented,
  variant,
  disabled,
  className,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  orientation: ButtonGroupOrientation;
  segmented: boolean;
  variant: NonNullable<ButtonGroupProps["variant"]>;
  disabled?: boolean;
  className: string;
  onPointerOver: ButtonGroupProps["onPointerOver"];
  onPointerOut: ButtonGroupProps["onPointerOut"];
  onPointerDown: ButtonGroupProps["onPointerDown"];
  onPointerUp: ButtonGroupProps["onPointerUp"];
  rest: Omit<
    HTMLAttributes<HTMLDivElement>,
    "role" | "children" | "className" | "onPointerOver" | "onPointerOut" | "onPointerDown" | "onPointerUp"
  >;
  children: ReactNode;
}) {
  const part = useButtonGroupSlotMotion<HTMLDivElement>("root", {
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  return (
    <div
      ref={part.setRef}
      role={BUTTON_GROUP_ROLE}
      aria-disabled={disabled || undefined}
      className={buttonGroupRootClass({
        orientation,
        segmented,
        variant,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
      {...dataVariantProps({ variant })}
      data-disabled={dataFlag(disabled)}
    >
      {children}
    </div>
  );
}
 
 