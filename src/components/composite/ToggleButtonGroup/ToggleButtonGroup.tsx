import { Fragment, forwardRef, useMemo, type ForwardedRef, type HTMLAttributes, type ReactNode } from "react";
 
import { buildButtonGroupSegment, resolveButtonGroupSegmentPosition } from "@/components/composite/ButtonGroup/buttonGroupAPI";
import { ButtonGroupSegmentProvider } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { buttonGroupRootClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { ToggleButtonGroupProvider } from "@/components/core/ToggleButton/toggleButtonContext";
import { KIT_TOGGLE_BUTTON_VARIANTS } from "@/components/core/ToggleButton/toggleButtonTypes";
import { isKitVariant } from "@/skins/resolveVariantVisual";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
import { isToggleButtonChild } from "./toggleButtonGroupAPI";
import { resolveToggleButtonGroupMotionDefaults, useToggleButtonGroupRootMotion } from "./toggleButtonGroupAnimations";
import { ToggleButtonGroupClassNamesProvider, ToggleButtonGroupMotionProvider } from "./toggleButtonGroupContext";
import { ToggleButtonGroupSeparator } from "./toggleButtonGroupParts";
import type { ToggleButtonGroupProps } from "./toggleButtonGroupTypes";
import { useToggleButtonGroupRootState } from "./useToggleButtonGroupRootState";
 
export type {
  ToggleButtonGroupProps,
  ToggleButtonGroupType,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupContextValue,
  ToggleButtonGroupClassNames,
  ToggleButtonGroupMotion,
  ToggleButtonGroupPartMotion,
} from "./toggleButtonGroupTypes";
 
export const ToggleButtonGroupRoot = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroupRoot(props, ref) {
    const {
      children: _children,
      className = "",
      classNames,
      orientation = "horizontal",
      segmented = false,
      disabled = false,
      size = "base",
      variant: _variant,
      type: _type = "multiple",
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      onKeyDown: _onKeyDown,
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
    } = props;
 
    const { flat, segmentCount, contextValue, handleKeyDown, selectionIdentity } =
      useToggleButtonGroupRootState(props);
    const motionDefaults = useMemo(() => resolveToggleButtonGroupMotionDefaults(), []);
 
    let segmentIndex = -1;
 
    return (
      <ToggleButtonGroupProvider value={contextValue}>
        <ToggleButtonGroupClassNamesProvider classNames={classNames}>
          <ToggleButtonGroupMotionProvider
            motion={motion}
            defaults={motionDefaults}
            controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
          >
            <ToggleButtonGroupRootSurface
              forwardedRef={ref}
              orientation={orientation}
              segmented={segmented}
              variant={contextValue.variant}
              size={size}
              disabled={disabled}
              className={cn(classNames?.root, className)}
              handleKeyDown={handleKeyDown}
              selectionIdentity={selectionIdentity}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              rest={rest}
            >
              {flat.map((child, i) => {
                if (!isToggleButtonChild(child)) {
                  return <Fragment key={child.key ?? `tbg-wrap-${i}`}>{child}</Fragment>;
                }
 
                if (segmented) {
                  return <Fragment key={child.key ?? `tbg-item-${i}`}>{child}</Fragment>;
                }
 
                segmentIndex += 1;
                const position = resolveButtonGroupSegmentPosition(segmentIndex, segmentCount);
                const segment = buildButtonGroupSegment(orientation, position);
 
                return (
                  <Fragment key={child.key ?? `tbg-seg-${i}`}>
                    <ButtonGroupSegmentProvider segment={segment} buttonSize={size}>
                      {child}
                    </ButtonGroupSegmentProvider>
                    {isKitVariant(contextValue.variant, KIT_TOGGLE_BUTTON_VARIANTS) &&
                    position !== "last" &&
                    position !== "only" ? (
                      <ToggleButtonGroupSeparator orientation={orientation} />
                    ) : null}
                  </Fragment>
                );
              })}
            </ToggleButtonGroupRootSurface>
          </ToggleButtonGroupMotionProvider>
        </ToggleButtonGroupClassNamesProvider>
      </ToggleButtonGroupProvider>
    );
  },
);
 
function ToggleButtonGroupRootSurface({
  forwardedRef,
  orientation,
  segmented,
  variant,
  size,
  disabled,
  className,
  handleKeyDown,
  selectionIdentity,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  orientation: NonNullable<ToggleButtonGroupProps["orientation"]>;
  segmented: boolean;
  variant: NonNullable<ToggleButtonGroupProps["variant"]>;
  size: NonNullable<ToggleButtonGroupProps["size"]>;
  disabled: boolean;
  className: string;
  handleKeyDown: ToggleButtonGroupProps["onKeyDown"];
  selectionIdentity: string;
  onPointerOver: ToggleButtonGroupProps["onPointerOver"];
  onPointerOut: ToggleButtonGroupProps["onPointerOut"];
  onPointerDown: ToggleButtonGroupProps["onPointerDown"];
  onPointerUp: ToggleButtonGroupProps["onPointerUp"];
  rest: Omit<
    HTMLAttributes<HTMLDivElement>,
    | "children"
    | "className"
    | "onKeyDown"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
    | "defaultValue"
  >;
  children: ReactNode;
}) {
  const part = useToggleButtonGroupRootMotion({
    forwardedRef,
    selectionIdentity,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  return (
    <div
      ref={part.setRef}
      role="toolbar"
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      className={buttonGroupRootClass({
        orientation,
        segmented,
        variant,
        className,
        kitVariants: KIT_TOGGLE_BUTTON_VARIANTS,
        skinSlot: "toggleButtonGroup.root",
      })}
      onKeyDown={handleKeyDown}
      {...part.pointerHandlers}
      {...rest}
      {...dataVariantProps({ size, variant })}
    >
      {children}
    </div>
  );
}
 
ToggleButtonGroupRoot.displayName = "ToggleButtonGroup";
 