import { Fragment, forwardRef } from "react";

import {
  buildButtonGroupSegment,
  resolveButtonGroupSegmentPosition,
} from "@/components/composite/ButtonGroup/buttonGroupAPI";
import { ButtonGroupSegmentProvider } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { buttonGroupRootClass } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { ToggleButtonGroupProvider } from "@/components/core/ToggleButton/toggleButtonContext";

import { toggleButtonGroupRootTabIndex } from "./toggleButtonGroupA11y";
import { isToggleButtonChild } from "./toggleButtonGroupAPI";
import { ToggleButtonGroupSeparator } from "./toggleButtonGroupParts";
import type { ToggleButtonGroupProps } from "./toggleButtonGroupTypes";
import { useToggleButtonGroupRootState } from "./useToggleButtonGroupRootState";

export type {
  ToggleButtonGroupProps,
  ToggleButtonGroupType,
  ToggleButtonGroupOrientation,
  ToggleButtonGroupContextValue,
} from "./toggleButtonGroupTypes";

export const ToggleButtonGroupRoot = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroupRoot(props, ref) {
    const {
      children,
      className = "",
      orientation = "horizontal",
      separated = false,
      disabled = false,
      size = "base",
      variant = "default",
      type = "multiple",
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      onKeyDown: _onKeyDown,
      ...rest
    } = props;

    const { flat, segmentCount, contextValue, handleKeyDown, isSingle } =
      useToggleButtonGroupRootState(props);

    let segmentIndex = -1;

    return (
      <ToggleButtonGroupProvider value={contextValue}>
        <div
          ref={ref}
          role="toolbar"
          tabIndex={toggleButtonGroupRootTabIndex(disabled)}
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          className={buttonGroupRootClass({
            orientation,
            segmented: separated,
            variant,
            className,
          })}
          {...(isSingle ? { onKeyDown: handleKeyDown } : {})}
          {...rest}
        >
          {flat.map((child, i) => {
            if (!isToggleButtonChild(child)) {
              return <Fragment key={child.key ?? `tbg-wrap-${i}`}>{child}</Fragment>;
            }

            if (separated) {
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
                {variant !== "gloss" && position !== "last" && position !== "only" ? (
                  <ToggleButtonGroupSeparator orientation={orientation} />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </ToggleButtonGroupProvider>
    );
  },
);

ToggleButtonGroupRoot.displayName = "ToggleButtonGroup";
