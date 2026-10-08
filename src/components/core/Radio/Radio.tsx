import { forwardRef } from "react";
 
import { useRadioTextMotion } from "./radioAnimations";
import { RadioClassNamesProvider, RadioFieldProvider, RadioMotionProvider } from "./radioContext";
import { RadioSimpleBody } from "./radioParts";
import { RADIO_ROOT_DISABLED_CLASS, radioGridClass } from "./radioStyles";
import type { RadioProps } from "./radioTypes";
import { useRadioRootState } from "./useRadioRootState";
 
import { dataCheckedState, dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
export type {
  RadioProps,
  RadioControlProps,
  RadioIndicatorProps,
  RadioContentProps,
  RadioLabelProps,
  RadioHintProps,
  RadioErrorProps,
  RadioSize,
  RadioVariant,
  RadioClassNames,
  RadioMotion,
  RadioCheckMotion,
} from "./radioTypes";
 
export const RadioRoot = forwardRef<HTMLLabelElement, RadioProps>(function RadioRoot(
  {
    children,
    label,
    hint,
    error,
    invalid,
    size,
    variant,
    danger,
    disabled,
    checked,
    defaultChecked,
    onChange,
    id,
    name,
    value,
    required,
    form,
    autoFocus,
    tabIndex,
    readOnly,
    onBlur,
    onFocus,
    className,
      classNames,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      onPointerDown,
    onKeyDown,
    onClick,
    ...rest
  },
  ref,
) {
  const state = useRadioRootState(
    {
      size,
      variant,
      danger,
      disabled,
      checked,
      defaultChecked,
      onChange,
      id,
      name,
      value,
      required,
      form,
      autoFocus,
      tabIndex,
      readOnly,
      onBlur,
      onFocus,
      label,
      hint,
      error,
      invalid,
    },
    children,
    className,
    onClick,
  );
 
  const { handlePointerDown, handleKeyDown } = useRadioTextMotion({
    isDisabled: state.isDisabled,
    enableTextMotion: state.enableTextMotion,
    textMotionRef: state.textColRef,
    onPointerDown,
    onKeyDown,
  });
 
  const gridClass = cn(
    radioGridClass(state.secondaryLines, state.sz.gridGap, className),
    state.isDisabled && RADIO_ROOT_DISABLED_CLASS,
    classNames?.root,
  );
 
  return (
    <RadioFieldProvider value={state.contextValue}>
      <RadioClassNamesProvider classNames={classNames}>
        <RadioMotionProvider motion={motion} controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}>
          <label
            ref={ref}
            className={gridClass}
            {...rest}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            {...dataVariantProps({
              size: state.contextValue.size,
              variant: state.contextValue.variant,
            })}
            data-selected={state.mergedChecked ? "true" : undefined}
            data-state={dataCheckedState(state.mergedChecked)}
          >
            {state.isCompound ? (
              children
            ) : (
              <RadioSimpleBody
                label={state.label}
                hint={state.hint}
                error={state.error}
                hasHint={state.hasHint}
                hasError={state.hasError}
                secondaryLines={state.secondaryLines}
                textColRef={state.textColRef}
                size={state.contextValue.size}
                isDisabled={state.isDisabled}
                danger={state.danger}
                hintId={state.hintId}
                errorId={state.errorId}
                motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}
              />
            )}
          </label>
        </RadioMotionProvider>
      </RadioClassNamesProvider>
    </RadioFieldProvider>
  );
});
 
RadioRoot.displayName = "RadioRoot";
 
export {
  RadioControl,
  RadioIndicator,
  RadioContent,
  RadioLabel,
  RadioHint,
  RadioError,
} from "./radioParts";
 