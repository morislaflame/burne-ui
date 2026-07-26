import { SelectionThumb } from "@/components/core/SelectionThumb";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { forwardRef } from "react";

import { useSliderThumbPressAnimation, useSliderThumbShellAnimation } from "./sliderAnimations";
import { useSliderClassNames } from "./sliderContext";
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
      ariaValueNow,
      ariaValueMin,
      ariaValueMax,
      ariaValueText,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      onPointerDown,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const slotClassNames = useSliderClassNames();
    const shellRef = useSliderThumbShellAnimation(disabled);
    const { squeezeRef, handlePointerDown } = useSliderThumbPressAnimation({
      disabled,
      onPointerDown,
    });

    return (
      <button
        ref={mergeRefs(squeezeRef, forwardedRef)}
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
          orientation,
          disabled,
          slotClass: cn(slotClassNames.thumb, className),
        })}
        style={{ ...sliderThumbPositionStyle(percent, orientation), ...style }}
        onPointerDown={handlePointerDown}
        onKeyDown={onKeyDown}
        {...rest}
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
