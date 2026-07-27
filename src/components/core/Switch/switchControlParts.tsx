import { cloneElement, forwardRef, isValidElement, useCallback, useId, useMemo, useState, type ChangeEvent, type PointerEvent, type ReactNode } from "react";

import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useControllableState } from "@/components/core/utils/useControllableState";

import { hasSwitchThumbChild, partitionSwitchControlChildren } from "./switchAPI";
import { switchFallbackAriaLabel, switchInputId } from "./switchA11y";
import { useOptionalSwitchFieldContext, useSwitchClassNames } from "./switchContext";
import { SWITCH_INPUT_VISUALLY_HIDDEN_CLASS, switchControlCellClass, switchControlClass } from "./switchStyles";
import type { SwitchControlProps } from "./switchTypes";
import { SwitchFill, SwitchTrack } from "./switchTrackParts";

import { cn } from "@/utils/cn";

export const SwitchControl = forwardRef<HTMLInputElement, SwitchControlProps>(
  function SwitchControl(
    {
      size: sizeProp,
      iconOff,
      iconOn,
      color,
      gloss = false,
      thickness,
      className,
      classNames: controlClassNames,
      disabled,
      checked,
      defaultChecked,
      onChange,
      id: idProp,
      name,
      value,
      required,
      form,
      autoFocus,
      tabIndex,
      readOnly,
      onBlur,
      onFocus,
      onPointerDown,
      children,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalSwitchFieldContext();
    const rootClassNames = useSwitchClassNames();
    const slotClassNames = useMemo(
      () => ({ ...rootClassNames, ...controlClassNames }),
      [controlClassNames, rootClassNames],
    );
    const autoId = useId();
    const inputId = switchInputId(idProp, autoId, fieldCtx?.switchId);
    const hintId = fieldCtx?.hintId ?? `${inputId}-hint`;
    const errorId = fieldCtx?.errorId ?? `${inputId}-error`;
    const size = sizeProp ?? fieldCtx?.size ?? "base";

    const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
      value: checked,
      defaultValue: Boolean(defaultChecked),
    });
    const [squeezeToken, setSqueezeToken] = useState(0);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) setMergedChecked(next);
        onChange?.(e);
      },
      [isControlled, onChange, setMergedChecked],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLInputElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        setSqueezeToken((t) => t + 1);
        fieldCtx?.setSqueezeToken((t) => t + 1);
      },
      [disabled, fieldCtx, onPointerDown],
    );

    const { "aria-label": ariaLabelProp, ...inputRest } = rest;

    const trackDefaults = {
      size,
      thickness,
      checked: mergedChecked,
      disabled,
      color,
      gloss,
      squeezeToken,
      iconOff,
      iconOn,
      classNames: {
        track: slotClassNames.track,
        fill: slotClassNames.fill,
        thumb: slotClassNames.thumb,
        thumbShell: slotClassNames.thumbShell,
        icon: slotClassNames.icon,
      },
    };

    const { track: compoundTrack } = partitionSwitchControlChildren(children);
    let trackVisual: ReactNode;

    if (compoundTrack != null) {
      trackVisual = isValidElement(compoundTrack)
        ? cloneElement(compoundTrack, trackDefaults)
        : compoundTrack;
    } else if (children != null && hasSwitchThumbChild(children)) {
      trackVisual = (
        <SwitchTrack {...trackDefaults}>
          <SwitchFill />
          {children}
        </SwitchTrack>
      );
    } else if (children != null) {
      trackVisual = children;
    } else {
      trackVisual = <SwitchTrack {...trackDefaults} />;
    }

    return (
      <span
        className={cn(
          switchControlClass(size),
          fieldCtx != null
            ? switchControlCellClass(fieldCtx.labelPosition)
            : undefined,
          slotClassNames.control,
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-checked={mergedChecked}
          className={cn(
            SWITCH_INPUT_VISUALLY_HIDDEN_CLASS,
            slotClassNames.input,
          )}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          form={form}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          readOnly={readOnly ?? (isControlled && onChange === undefined)}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-describedby={joinFieldDescribedBy(
            fieldCtx?.hintConnected ? hintId : undefined,
            fieldCtx?.errorConnected ? errorId : undefined,
          )}
          aria-label={
            ariaLabelProp ??
            switchFallbackAriaLabel(fieldCtx?.hasTextColumn ?? false)
          }
          onPointerDown={handlePointerDown}
          {...(isControlled
            ? { checked: mergedChecked, onChange: handleChange }
            : { defaultChecked, onChange: handleChange })}
          {...inputRest}
        />
        {trackVisual}
      </span>
    );
  },
);

SwitchControl.displayName = "SwitchControl";

