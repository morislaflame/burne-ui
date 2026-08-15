import { forwardRef } from "react";

import { useRadioTextMotion } from "./radioAnimations";
import { RadioClassNamesProvider, RadioFieldProvider, RadioMotionProvider } from "./radioContext";
import { RadioSimpleBody } from "./radioParts";
import { RADIO_ROOT_DISABLED_CLASS, radioGridClass } from "./radioStyles";
import type { RadioProps } from "./radioTypes";
import { useRadioRootState } from "./useRadioRootState";

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
        <RadioMotionProvider motion={motion}>
          <label
            ref={ref}
            data-selected={state.mergedChecked ? true : undefined}
            className={gridClass}
            {...rest}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
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
