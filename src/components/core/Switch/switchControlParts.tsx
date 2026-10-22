import { cloneElement, forwardRef, isValidElement, useCallback, useId, useLayoutEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from "react";
 
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
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
 
export const SwitchControl = forwardRef<HTMLElement, SwitchControlProps>(
  function SwitchControl(
    {
      size: sizeProp,
      iconOff,
      iconOn,
      color,
      status,
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
      inputRef,
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
 
    const formBinding = useFormControlProps({
      name: typeof name === "string" ? name : undefined,
      value: checked,
      onChange: onChange as ((event: unknown) => void) | undefined,
      onBlur: onBlur as ((event: unknown) => void) | undefined,
      disabled,
      readOnly,
      type: "checkbox",
    });
    const resolvedReadOnly = Boolean(formBinding.readOnly);
    const resolvedDisabled = formBinding.disabled ?? disabled;
    const formChecked = formBinding.bound ? Boolean(formBinding.checked) : undefined;
    const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
      value: formChecked ?? checked,
      defaultValue: Boolean(defaultChecked),
    });
    const [squeezeToken, setSqueezeToken] = useState(0);
 
    useLayoutEffect(() => {
      fieldCtx?.setMergedChecked(mergedChecked);
    }, [fieldCtx, mergedChecked]);
 
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (resolvedReadOnly) {
          e.preventDefault();
          return;
        }
        const next = e.target.checked;
        if (!isControlled) setMergedChecked(next);
        formBinding.onChange(e);
      },
      [formBinding, isControlled, resolvedReadOnly, setMergedChecked],
    );
 
    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLInputElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || resolvedDisabled || resolvedReadOnly) return;
        setSqueezeToken((t) => t + 1);
        fieldCtx?.setSqueezeToken((t) => t + 1);
      },
      [fieldCtx, onPointerDown, resolvedDisabled, resolvedReadOnly],
    );
 
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || resolvedDisabled || resolvedReadOnly || !isInteractivePressKey(e)) return;
        setSqueezeToken((t) => t + 1);
        fieldCtx?.setSqueezeToken((t) => t + 1);
      },
      [fieldCtx, onKeyDown, resolvedDisabled, resolvedReadOnly],
    );
 
    const { "aria-label": ariaLabelProp, ...inputRest } = rest;
 
    const trackDefaults = {
      size,
      thickness,
      checked: mergedChecked,
      disabled: resolvedDisabled,
      color,
      status,
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
        ref={ref as Ref<HTMLLabelElement>}
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
          ref={(node) => {
            formBinding.ref(node);
            if (typeof inputRef === "function") inputRef(node);
            else if (inputRef) inputRef.current = node;
          }}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-checked={mergedChecked}
          className={cn(
            SWITCH_INPUT_VISUALLY_HIDDEN_CLASS,
            slotClassNames.input,
          )}
          disabled={resolvedDisabled}
          name={formBinding.name ?? name}
          {...(value != null ? { value } : null)}
          required={required}
          aria-required={required || undefined}
          aria-invalid={fieldCtx?.isInvalid || formBinding["aria-invalid"] ? true : undefined}
          aria-readonly={resolvedReadOnly || undefined}
          form={form}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          readOnly={resolvedReadOnly || (isControlled && onChange === undefined && !formBinding.bound)}
          onClick={(event) => {
            if (resolvedReadOnly) event.preventDefault();
          }}
          onBlur={formBinding.onBlur}
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
          data-readonly={resolvedReadOnly ? "" : undefined}
        />
        {trackVisual}
      </ControlTag>
    );
  },
);
 
SwitchControl.displayName = "SwitchControl";
 
 