import "@/components/core/utils/glossInteractive.css";

import { Fragment, forwardRef } from "react";

import { cn } from "@/utils/cn";

import { buildButtonGroupSegment, isGroupSegmentSlot, resolveButtonGroupSegmentPosition } from "./buttonGroupAPI";
import { ButtonGroupClassNamesProvider, ButtonGroupLayoutProvider, ButtonGroupSegmentProvider, useButtonGroupClassNames } from "./buttonGroupContext";
import { ButtonGroupText } from "./buttonGroupParts";
import { buttonGroupRootClass, buttonGroupSeparatorClass } from "./buttonGroupStyles";
import type { ButtonGroupOrientation, ButtonGroupProps } from "./buttonGroupTypes";
import { useButtonGroupRootState } from "./useButtonGroupRootState";

export type {
  ButtonGroupProps,
  ButtonGroupTextProps,
  ButtonGroupOrientation,
  ButtonGroupSegment,
  ButtonGroupClassNames,
} from "./buttonGroupTypes";

function ButtonGroupSeparator({ orientation }: { orientation: ButtonGroupOrientation }) {
  const slotClassNames = useButtonGroupClassNames();
  return <span aria-hidden className={buttonGroupSeparatorClass(orientation, slotClassNames.separator)} />;
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

    let segmentIndex = -1;

    return (
      <ButtonGroupLayoutProvider value={layoutValue}>
        <ButtonGroupClassNamesProvider classNames={classNames}>
          <div
            ref={ref}
            role="group"
            className={buttonGroupRootClass({
              orientation,
              segmented,
              variant,
              className: cn(classNames?.root, className),
            })}
            {...rest}
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
          </div>
        </ButtonGroupClassNamesProvider>
      </ButtonGroupLayoutProvider>
    );
  },
);

ButtonGroupRoot.displayName = "ButtonGroup";

export { ButtonGroupText };
