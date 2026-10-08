import { forwardRef, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from "react";
 
import { FieldLabelContext } from "@/components/core/Label";
 
import { injectSwitchControlProps } from "./switchAPI";
import { useSwitchTextMotion } from "./switchAnimations";
import { SwitchClassNamesProvider, SwitchFieldProvider, SwitchMotionProvider } from "./switchContext";
import { SwitchContent, SwitchControl, SwitchError, SwitchFill, SwitchHint, SwitchIcon, SwitchLabel, SwitchSimpleBody, SwitchThumb, SwitchTrack } from "./switchParts";
import { SWITCH_COMPOUND_FIELDSET_CLASS, SWITCH_ROOT_DISABLED_CLASS, switchRootGridClass } from "./switchStyles";
import type { SwitchControlProps, SwitchProps } from "./switchTypes";
import { useSwitchRootState } from "./useSwitchRootState";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
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
  SwitchProps,
  SwitchSimpleProps,
  SwitchMotion,
  SwitchCheckMotion,
  SwitchVariant,
  KitSwitchVariant,
} from "./switchTypes";

export { KIT_SWITCH_VARIANTS } from "./switchTypes";
export { SWITCH_LAYOUT } from "./switchStyles";
 
export const SwitchRoot = forwardRef<HTMLLabelElement, SwitchProps & Partial<SwitchControlProps>>(
  function SwitchRoot(
    {
      children,
      label,
      hint,
      error,
      invalid,
      labelPosition = "right",
      size = "base",
      disabled: disabledRoot,
      className,
      classNames,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      onPointerDown,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const state = useSwitchRootState({
      children,
      label,
      hint,
      error,
      invalid,
      labelPosition,
      size,
      disabled: disabledRoot,
      className,
      ...rest,
    });
 
    const { handlePointerDown, handleKeyDown } = useSwitchTextMotion({
      isDisabled: state.disabled,
      enableTextMotion: state.enableTextMotion,
      textMotionRef: state.textColRef,
      onPointerDown: onPointerDown as ((e: PointerEvent<HTMLElement>) => void) | undefined,
      onKeyDown: onKeyDown as ((e: KeyboardEvent<HTMLElement>) => void) | undefined,
    });
 
    const gridClass = cn(
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
 
    const providers = (node: ReactNode) => (
      <SwitchFieldProvider value={state.fieldCtx}>
        <SwitchClassNamesProvider classNames={classNames}>
          <SwitchMotionProvider motion={motion} controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}>
            {node}
          </SwitchMotionProvider>
        </SwitchClassNamesProvider>
      </SwitchFieldProvider>
    );
 
    if (state.isCompound) {
      return providers(
        <FieldLabelContext.Provider value={state.fieldLabelContext}>
          <fieldset
            ref={ref as Ref<HTMLFieldSetElement>}
            aria-labelledby={
              state.fieldCtx.labelConnected ? state.fieldCtx.labelId : undefined
            }
            className={cn(gridClass, SWITCH_COMPOUND_FIELDSET_CLASS)}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            {...dataVariantProps({ size: state.fieldCtx.size })}
          >
            {injectSwitchControlProps(children, state.controlRest)}
          </fieldset>
        </FieldLabelContext.Provider>,
      );
    }
 
    return providers(
      <label
        ref={ref}
        htmlFor={state.fieldCtx.switchId}
        className={gridClass}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...dataVariantProps({ size: state.fieldCtx.size })}
      >
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
          controlProps={
            {
              ...state.controlRest,
              motionController,
              motionState,
              motionPayload,
              playInitialState,
            } as SwitchControlProps
          }
        />
      </label>,
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
 