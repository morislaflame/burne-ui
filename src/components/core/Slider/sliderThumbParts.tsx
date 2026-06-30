import { SelectionThumb, SelectionThumbIcon } from "@/components/core/SelectionThumb";

import { mergeSliderSlotClass } from "./sliderAPI";
import {
  useSliderThumbPressAnimation,
  useSliderThumbShellAnimation,
} from "./sliderAnimations";
import { useSliderClassNames } from "./sliderContext";
import { sliderThumbButtonClass, sliderThumbPositionStyle } from "./sliderStyles";
import type { SliderThumbButtonProps } from "./sliderTypes";

export function SliderThumbButton({
  size,
  icon,
  gloss = false,
  thumbClassName,
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
  onPointerDown,
  onKeyDown,
}: SliderThumbButtonProps) {
  const slotClassNames = useSliderClassNames();
  const shellRef = useSliderThumbShellAnimation(disabled);
  const { squeezeRef, handlePointerDown } = useSliderThumbPressAnimation({
    disabled,
    onPointerDown,
  });

  return (
    <button
      ref={squeezeRef}
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
        slotClass: slotClassNames.thumb,
      })}
      style={sliderThumbPositionStyle(percent, orientation)}
      onPointerDown={handlePointerDown}
      onKeyDown={onKeyDown}
    >
      <SelectionThumb
        active={active}
        size={size}
        gloss={gloss}
        shellRef={shellRef}
        className={mergeSliderSlotClass(slotClassNames.thumbShell, thumbClassName)}
      >
        {icon != null ? (
          <SelectionThumbIcon size={size} highlighted={active} gloss={gloss}>
            {icon}
          </SelectionThumbIcon>
        ) : null}
      </SelectionThumb>
    </button>
  );
}
