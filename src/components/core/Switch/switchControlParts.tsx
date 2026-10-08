import { cloneElement, forwardRef, isValidElement, useCallback, useId, useLayoutEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
 
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useSkinVariant } from "@/skins/skinContext";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";
import { useControllableState } from "@/components/core/utils/useControllableState";
 
import { hasSwitchThumbChild, partitionSwitchControlChildren } from "./switchAPI";
import { switchFallbackAriaLabel, switchInputId } from "./switchA11y";
import { useOptionalSwitchFieldContext, useSwitchClassNames } from "./switchContext";
import { SWITCH_INPUT_VISUALLY_HIDDEN_CLASS, switchControlCellClass, switchControlClass } from "./switchStyles";
import type { SwitchControlProps } from "./switchTypes";
import { SwitchFill, SwitchTrack } from "./switchTrackParts";
 
import { dataOnState, dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
export const SwitchControl = forwardRef<HTMLInputElement, SwitchControlProps>(
  function SwitchControl(
    {
      size: sizeProp,
      iconOff,
      iconOn,
      color,
      variant: variantProp,
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
      onKeyDown,
      children,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const variant = useSkinVariant(variantProp);
    const unnamedLabel = useBurneLabel("switch");
    const fieldCtx = useOptionalSwitchFieldContext();
    const rootClassNames = useSwitchClassNames();
    const slotClassNames = useMemo(
      () => ({ ...rootClassNames, ...controlClassNames }),
      [controlClassNames, rootClassNames],
    );
    const autoId = useId();
    const inputId = fieldCtx?.switchId ?? switchInputId(idProp, autoId);
    const isCompound = fieldCtx?.isCompound === true;
    const ControlTag = isCompound ? "label" : "span";
    const hintId = fieldCtx?.hintId ?? `${inputId}-hint`;
    const errorId = fieldCtx?.errorId ?? `${inputId}-error`;
    const size = sizeProp ?? fieldCtx?.size ?? "base";
 
    const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
      value: checked,
      defaultValue: Boolean(defaultChecked),
    });
    const [squeezeToken, setSqueezeToken] = useState(0);
 
    useLayoutEffect(() => {
      fieldCtx?.setMergedChecked(mergedChecked);
    }, [fieldCtx, mergedChecked]);
 
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
 
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled || !isInteractivePressKey(e)) return;
        setSqueezeToken((t) => t + 1);
        fieldCtx?.setSqueezeToken((t) => t + 1);
      },
      [disabled, fieldCtx, onKeyDown],
    );
 
    const { "aria-label": ariaLabelProp, ...inputRest } = rest;
 
    const trackDefaults = {
      size,
      thickness,
      checked: mergedChecked,
      disabled,
      color,
      variant,
      squeezeToken,
      iconOff,
      iconOn,
      classNames: {
        track: slotClassNames.track,
        fill: slotClassNames.fill,
        thumb: slotClassNames.thumb,
        thumbShell: slotClassNames.thumbShell,
        iconOff: slotClassNames.iconOff,
        iconOn: slotClassNames.iconOn,
      },
    };
 
    const { compoundTrack, hasThumbChild } = useMemo(() => {
      const { track } = partitionSwitchControlChildren(children);
      return {
        compoundTrack: track,
        hasThumbChild: children != null && hasSwitchThumbChild(children),
      };
    }, [children]);
    let trackVisual: ReactNode;
 
    if (compoundTrack != null) {
      trackVisual = isValidElement(compoundTrack)
        ? cloneElement(compoundTrack, trackDefaults)
        : compoundTrack;
    } else if (hasThumbChild) {
      trackVisual = (
        <SwitchTrack {...trackDefaults} motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}>
          <SwitchFill />
          {children}
        </SwitchTrack>
      );
    } else if (children != null) {
      trackVisual = children;
    } else {
      trackVisual = <SwitchTrack {...trackDefaults} motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState} />;
    }
 
    return (
      <ControlTag
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
          aria-required={required || undefined}
          aria-invalid={fieldCtx?.isInvalid ? true : undefined}
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
            switchFallbackAriaLabel(fieldCtx?.hasTextColumn ?? false, unnamedLabel)
          }
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          {...(isControlled
            ? { checked: mergedChecked, onChange: handleChange }
            : { defaultChecked, onChange: handleChange })}
          {...inputRest}
          {...dataVariantProps({ size, variant })}
          data-invalid={fieldCtx?.isInvalid ? "" : undefined}
          data-state={dataOnState(mergedChecked)}
        />
        {trackVisual}
      </ControlTag>
    );
  },
);
 
SwitchControl.displayName = "SwitchControl";
 
 