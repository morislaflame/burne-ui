import "@/components/core/utils/glossInteractive.css";

import { Fragment, forwardRef, useMemo, type ForwardedRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

import { BUTTON_GROUP_ROLE, buttonGroupSeparatorA11yProps } from "./buttonGroupA11y";
import { resolveButtonGroupMotionDefaults, useButtonGroupSlotMotion } from "./buttonGroupAnimations";
import { buildButtonGroupSegment, isGroupSegmentSlot, resolveButtonGroupSegmentPosition } from "./buttonGroupAPI";
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
      buttonSize = "base",
      variant = "default",
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const { flat, segmentCount, layoutValue } = useButtonGroupRootState({
      children: _children,
      orientation,
      segmented,
      buttonSize,
      variant,
    });
    const motionDefaults = useMemo(() => resolveButtonGroupMotionDefaults(), []);

    let segmentIndex = -1;

    return (
      <ButtonGroupLayoutProvider value={layoutValue}>
        <ButtonGroupClassNamesProvider classNames={classNames}>
          <ButtonGroupMotionProvider motion={motion} defaults={motionDefaults}>
            <ButtonGroupRootSurface
              forwardedRef={ref}
              orientation={orientation}
              segmented={segmented}
              variant={variant}
              className={cn(classNames?.root, className)}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              rest={rest}
            >
              {flat.map((child, i) => {
                if (!isGroupSegmentSlot(child)) {
                  return <Fragment key={child.key ?? `bg-wrap-${i}`}>{child}</Fragment>;
                }

                if (segmented) {
                  return <Fragment key={child.key ?? `bg-item-${i}`}>{child}</Fragment>;
                }

                segmentIndex += 1;
                const position = resolveButtonGroupSegmentPosition(segmentIndex, segmentCount);
                const segment = buildButtonGroupSegment(orientation, position);

                return (
                  <Fragment key={child.key ?? `bg-seg-${i}`}>
                    <ButtonGroupSegmentProvider
                      segment={segment}
                      buttonSize={buttonSize}
                      variant={variant}
                    >
                      {child}
                    </ButtonGroupSegmentProvider>
                    {variant !== "gloss" && position !== "last" && position !== "only" ? (
                      <ButtonGroupSeparator orientation={orientation} />
                    ) : null}
                  </Fragment>
                );
              })}
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
      className={buttonGroupRootClass({
        orientation,
        segmented,
        variant,
        className,
      })}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </div>
  );
}

