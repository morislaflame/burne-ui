import { SelectionThumb } from "@/components/core/SelectionThumb";
import { dataFlag } from "@/components/core/utils/dataContract";
import { useSkinVariant } from "@/skins/skinContext";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { forwardRef } from "react";
 
import { useSliderThumbShellAnimation } from "./sliderAnimations";
import { useOptionalSliderFieldContext, useOptionalSliderMotionScope, useSliderClassNames } from "./sliderContext";
import { sliderThumbButtonClass, sliderThumbPositionStyle } from "./sliderStyles";
import type { SliderThumbButtonProps } from "./sliderTypes";
 
import { cn } from "@/utils/cn";
 
export const SliderThumbButton = forwardRef<HTMLButtonElement, SliderThumbButtonProps>(
  function SliderThumbButton(
    {
      size,
      icon,
      variant: variantProp,
      className,
      style,
      percent,
      orientation,
      disabled,
      readOnly,
      isRtl,
      active,
      ariaValueNow,
      ariaValueMin,
      ariaValueMax,
      ariaValueText,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onKeyDown,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const variant = useSkinVariant(variantProp);
    const slotClassNames = useSliderClassNames();
    const fieldCtx = useOptionalSliderFieldContext();
    const shellRef = useSliderThumbShellAnimation(disabled);
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalSliderMotionScope(),
      slot: "thumb",
      motion,
      forwardedRef,
      pointerPhases: true,
      pressPhases: !disabled && !readOnly,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const isInvalid = Boolean(fieldCtx?.isInvalid);
 
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
        aria-invalid={isInvalid ? true : undefined}
        aria-readonly={readOnly || undefined}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={sliderThumbButtonClass({
          size,
          orientation,
          disabled,
          active,
          slotClass: cn(slotClassNames.thumb, className),
        })}
        style={{ ...sliderThumbPositionStyle(percent, orientation, isRtl), ...style }}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          onBlur?.(event);
          fieldCtx?.onControlBlur?.();
        }}
        {...rest}
        {...pointerHandlers}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
        data-invalid={dataFlag(isInvalid)}
      >
        <SelectionThumb
          size={size}
          variant={variant}
          shellRef={shellRef}
          className={slotClassNames.thumbShell}
        >
          {icon != null ? (
            <SelectionThumb.Icon size={size} variant={variant}>
              {icon}
            </SelectionThumb.Icon>
          ) : null}
        </SelectionThumb>
      </button>
    );
  },
);
 
SliderThumbButton.displayName = "SliderThumbButton";
 