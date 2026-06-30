import { forwardRef, type LabelHTMLAttributes } from "react";

import { mergeSwitchSlotClass } from "./switchAPI";
import { useSwitchTextMotion } from "./switchAnimations";
import { SwitchClassNamesProvider, SwitchFieldProvider } from "./switchContext";
import {
  SwitchContent,
  SwitchControl,
  SwitchError,
  SwitchFill,
  SwitchHint,
  SwitchIcon,
  SwitchLabel,
  SwitchSimpleBody,
  SwitchThumb,
  SwitchTrack,
} from "./switchParts";
import { SWITCH_ROOT_DISABLED_CLASS, switchRootGridClass } from "./switchStyles";
import type { SwitchControlProps, SwitchRootProps } from "./switchTypes";
import { useSwitchRootState } from "./useSwitchRootState";

export type {
  SwitchClassNames,
  SwitchControlProps,
  SwitchTrackProps,
  SwitchFillProps,
  SwitchThumbProps,
  SwitchIconProps,
  SwitchIconWhen,
  SwitchSize,
  SwitchLabelPosition,
  SwitchContentProps,
  SwitchLabelProps,
  SwitchHintProps,
  SwitchErrorProps,
  SwitchRootProps,
  SwitchSimpleProps,
} from "./switchTypes";

export { SWITCH_LAYOUT } from "./switchStyles";

export const SwitchRoot = forwardRef<HTMLLabelElement, SwitchRootProps & Partial<SwitchControlProps>>(
  function SwitchRoot(
    {
      children,
      label,
      hint,
      error,
      labelPosition = "right",
      size = "base",
      disabled: disabledRoot,
      className,
      classNames,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const state = useSwitchRootState({
      children,
      label,
      hint,
      error,
      labelPosition,
      size,
      disabled: disabledRoot,
      className,
      ...rest,
    });

    const { handlePointerDown } = useSwitchTextMotion({
      isDisabled: state.disabled,
      enableTextMotion: state.enableTextMotion,
      textMotionRef: state.textColRef,
      onPointerDown,
    });

    const gridClass = mergeSwitchSlotClass(
      switchRootGridClass({
        hasTextColumn: state.hasTextColumn,
        secondaryLines: state.secondaryLines,
        gap: state.sz.gap,
        labelPosition: state.labelPosition,
        slotClass: classNames?.root,
        className,
      }),
      state.disabled && SWITCH_ROOT_DISABLED_CLASS,
    );

    return (
      <SwitchFieldProvider value={state.fieldCtx}>
        <SwitchClassNamesProvider classNames={classNames}>
          <label
            ref={ref}
            className={gridClass}
            onPointerDown={handlePointerDown}
            {...(state.isCompound ? (rest as LabelHTMLAttributes<HTMLLabelElement>) : {})}
          >
            {state.isCompound ? (
              children
            ) : (
              <SwitchSimpleBody
                label={state.label}
                hint={state.hint}
                error={state.error}
                hasTextColumn={state.hasTextColumn}
                hasHint={state.hasHint}
                hasError={state.hasError}
                secondaryLines={state.secondaryLines}
                textColRef={state.textColRef}
                size={state.fieldCtx.size}
                disabled={state.disabled}
                labelPosition={state.labelPosition}
                hintId={state.hintId}
                errorId={state.errorId}
                controlProps={state.controlRest as SwitchControlProps}
              />
            )}
          </label>
        </SwitchClassNamesProvider>
      </SwitchFieldProvider>
    );
  },
);

SwitchRoot.displayName = "SwitchRoot";

export {
  SwitchControl,
  SwitchTrack,
  SwitchFill,
  SwitchThumb,
  SwitchIcon,
  SwitchContent,
  SwitchLabel,
  SwitchHint,
  SwitchError,
};
