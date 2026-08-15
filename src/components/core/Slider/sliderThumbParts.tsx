import { SelectionThumb } from "@/components/core/SelectionThumb";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { forwardRef } from "react";

import { useSliderThumbShellAnimation } from "./sliderAnimations";
import { useOptionalSliderMotionScope, useSliderClassNames } from "./sliderContext";
import { sliderThumbButtonClass, sliderThumbPositionStyle } from "./sliderStyles";
import type { SliderThumbButtonProps } from "./sliderTypes";

import { cn } from "@/utils/cn";

export const SliderThumbButton = forwardRef<HTMLButtonElement, SliderThumbButtonProps>(
  function SliderThumbButton(
    {
      size,
      icon,
      gloss = false,
      thumbClassName,
      className,
      style,
      percent,
      orientation,
      disabled,
      active,
      ariaValueNow,
      ariaValueMin,
      ariaValueMax,
      ariaValueText,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      motion,
      onPointerDown,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const slotClassNames = useSliderClassNames();
    const shellRef = useSliderThumbShellAnimation(disabled);
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalSliderMotionScope(),
      slot: "thumb",
      motion,
      forwardedRef,
      pointerPhases: true,
      pressPhases: !disabled,
      onPointerDown,
    });

    return (
      <button
        ref={setRef}
        type="button"
        role="slider"
        {...(ariaLabelledBy != null
          ? { "aria-labelledby": ariaLabelledBy }
          : ariaLabel != null
            ? { "aria-label": ariaLabel }
            : {})}
        {...(ariaDescribedBy != null ? { "aria-describedby": ariaDescribedBy } : {})}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={ariaValueNow}
        aria-valuetext={ariaValueText}
        aria-orientation={orientation}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={sliderThumbButtonClass({
          size,
          orientation,
          disabled,
          active,
          slotClass: cn(slotClassNames.thumb, className),
        })}
        style={{ ...sliderThumbPositionStyle(percent, orientation), ...style }}
        onKeyDown={onKeyDown}
        {...rest}
        {...pointerHandlers}
      >
        <SelectionThumb
          size={size}
          gloss={gloss}
          shellRef={shellRef}
          className={cn(slotClassNames.thumbShell, thumbClassName)}
        >
          {icon != null ? (
            <SelectionThumb.Icon size={size} gloss={gloss}>
              {icon}
            </SelectionThumb.Icon>
          ) : null}
        </SelectionThumb>
      </button>
    );
  },
);

SliderThumbButton.displayName = "SliderThumbButton";
