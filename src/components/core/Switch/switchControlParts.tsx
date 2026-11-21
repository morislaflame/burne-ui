import { cloneElement, forwardRef, isValidElement, useCallback, useId, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, type Ref } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useSkinVariant } from "@/skins/skinContext";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useControllableState } from "@/components/core/utils/useControllableState";
 
import { hasSwitchThumbChild, partitionSwitchControlChildren } from "./switchAPI";
import { switchFallbackAriaLabel, switchInputId } from "./switchA11y";
import { useOptionalSwitchFieldContext, useSwitchClassNames } from "./switchContext";
import { SWITCH_INPUT_VISUALLY_HIDDEN_CLASS, switchControlCellClass, switchControlClass } from "./switchStyles";
import type { SwitchControlProps, SwitchTrackProps } from "./switchTypes";
import { SwitchFill, SwitchTrack } from "./switchTrackParts";
 
import { dataFlag, dataOnState, dataVariantProps } from "@/components/core/utils/dataContract";
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
      disabled: disabledProp,
      checked,
      defaultChecked,
      onChange,
      onClick,
      id: idProp,
      name,
      value,
      required: requiredProp,
      form,
      autoFocus,
      tabIndex,
      readOnly: readOnlyProp,
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
    const resolvedDisabledInput = disabledProp ?? fieldCtx?.disabledProp;
    const resolvedReadOnlyInput = readOnlyProp ?? fieldCtx?.readOnlyProp;
    const resolvedRequired = Boolean(requiredProp ?? fieldCtx?.required);
 
    const formBinding = useFormFieldBinding({
      name: typeof name === "string" ? name : undefined,
      value: checked,
      disabled: resolvedDisabledInput,
      readOnly: resolvedReadOnlyInput,
    });
    const formBound = formBinding.bound;
    const resolvedReadOnly = Boolean(resolvedReadOnlyInput ?? formBinding.readOnly);
    const resolvedDisabled = Boolean(resolvedDisabledInput ?? formBinding.disabled);
    const formChecked = formBound ? Boolean(formBinding.value) : undefined;
    const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
      value: formChecked ?? checked,
      defaultValue: Boolean(defaultChecked),
    });
    const [squeezeToken, setSqueezeToken] = useState(0);
    const inputElementRef = useRef<HTMLInputElement | null>(null);
 
    useNativeFormReset(
      inputElementRef,
      () => {
        setMergedChecked(Boolean(defaultChecked));
      },
      !isControlled && !formBound,
    );
 
    useLayoutEffect(() => {
      fieldCtx?.setMergedChecked(mergedChecked);
    }, [fieldCtx, mergedChecked]);
 
    const isInvalid = useResolvedFieldInvalid({
      invalid: fieldCtx?.invalidProp,
      errorConnected: fieldCtx?.errorConnected ?? false,
      formInvalid: Boolean(formBound && formBinding.error),
    });
 
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (resolvedReadOnly || resolvedDisabled) {
          e.preventDefault();
          return;
        }
        const next = e.target.checked;
        if (!isControlled) setMergedChecked(next);
        onChange?.(e);
        if (e.defaultPrevented) return;
        if (formBound) formBinding.setValue(next);
      },
      [formBinding, formBound, isControlled, onChange, resolvedDisabled, resolvedReadOnly, setMergedChecked],
    );
 
    const handleClick = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        if (resolvedReadOnly) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [onClick, resolvedReadOnly],
    );
 
    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        if (formBound) formBinding.onBlur();
      },
      [formBinding, formBound, onBlur],
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
 
    const trackDefaults: SwitchTrackProps = {
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
      if (isValidElement<SwitchTrackProps>(compoundTrack)) {
        const childProps = compoundTrack.props;
        trackVisual = cloneElement(compoundTrack, {
          ...trackDefaults,
          ...childProps,
          size: childProps.size ?? trackDefaults.size,
          checked: childProps.checked ?? trackDefaults.checked,
          disabled: childProps.disabled ?? trackDefaults.disabled,
          variant: childProps.variant ?? trackDefaults.variant,
          squeezeToken: childProps.squeezeToken ?? trackDefaults.squeezeToken,
          classNames: {
            ...trackDefaults.classNames,
            ...childProps.classNames,
          },
          motionController: childProps.motionController ?? motionController,
          motionState: childProps.motionState ?? motionState,
          motionPayload: childProps.motionPayload ?? motionPayload,
          playInitialState: childProps.playInitialState ?? playInitialState,
        });
      } else {
        trackVisual = compoundTrack;
      }
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
        data-state={dataOnState(mergedChecked)}
        data-disabled={dataFlag(resolvedDisabled)}
        data-readonly={dataFlag(resolvedReadOnly)}
        data-invalid={dataFlag(isInvalid)}
        data-required={dataFlag(resolvedRequired)}
      >
        <input
          {...inputRest}
          ref={(node) => {
            inputElementRef.current = node;
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
          required={resolvedRequired || undefined}
          aria-required={resolvedRequired || undefined}
          aria-invalid={isInvalid ? true : undefined}
          aria-readonly={resolvedReadOnly || undefined}
          form={form}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          readOnly={resolvedReadOnly || (isControlled && onChange === undefined && !formBound)}
          onClick={handleClick}
          onBlur={handleBlur}
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
          {...dataVariantProps({ size, variant })}
          data-state={dataOnState(mergedChecked)}
          data-disabled={dataFlag(resolvedDisabled)}
          data-readonly={dataFlag(resolvedReadOnly)}
          data-invalid={dataFlag(isInvalid)}
          data-required={dataFlag(resolvedRequired)}
        />
        {trackVisual}
      </ControlTag>
    );
  },
);
 
SwitchControl.displayName = "SwitchControl";
 
 