import type { ForwardedRef, HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";
import { forwardRef, useMemo } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { resolveLabelMotionDefaults, useLabelRootMotion } from "./labelAnimations";
import { LabelClassNamesProvider, LabelMotionProvider, useLabelClassNames, useLabelMotionScope } from "./labelContext";
import { labelRootClass } from "./labelStyles";
import { LabelContent, LabelSlot } from "./labelParts";
import type { LabelProps } from "./labelTypes";
import { useLabelRootState } from "./useLabelRootState";
 
export type {
  LabelProps,
  LabelClassNames,
  LabelMotion,
  LabelPartMotion,
  FieldLabelContextValue,
} from "./labelTypes";
 
export function LabelRoot({
  children,
  className,
  required: requiredProp,
  htmlFor: htmlForProp,
  id: idProp,
  variant = "base",
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: Omit<LabelProps, "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & {
  forwardedRef?: ForwardedRef<HTMLElement>;
}) {
  const { htmlFor, id, required } = useLabelRootState({
    required: requiredProp,
    htmlFor: htmlForProp,
    id: idProp,
  });
  const slotClassNames = useLabelClassNames();
  const rootClass = labelRootClass({
    className,
    slotClass: slotClassNames.root,
  });
  const scope = useLabelMotionScope();
  const part = useLabelRootMotion({
    forwardedRef,
    motion: scope.getRootMotion()?.root,
    onPointerOver: onPointerOver as ((e: ReactPointerEvent<HTMLElement>) => void) | undefined,
    onPointerOut: onPointerOut as ((e: ReactPointerEvent<HTMLElement>) => void) | undefined,
    onPointerDown: onPointerDown as ((e: ReactPointerEvent<HTMLElement>) => void) | undefined,
    onPointerUp: onPointerUp as ((e: ReactPointerEvent<HTMLElement>) => void) | undefined,
  });
 
  if (htmlFor != null) {
    return (
      <label
        ref={part.setRef}
        id={id}
        htmlFor={htmlFor}
        className={rootClass}
        {...rest}
        {...part.pointerHandlers}
        {...dataVariantProps({ variant })}
      >
        <LabelContent required={required} variant={variant}>
          {children}
        </LabelContent>
      </label>
    );
  }
 
  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;
 
  return (
    <span
      ref={part.setRef}
      id={id}
      className={rootClass}
      {...spanRest}
      {...part.pointerHandlers}
      {...dataVariantProps({ variant })}
    >
      <LabelContent required={required} variant={variant}>
        {children}
      </LabelContent>
    </span>
  );
}
 
export const Label = forwardRef<HTMLElement, LabelProps>(function Label(
  { classNames, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const motionDefaults = useMemo(() => resolveLabelMotionDefaults(), []);
  return (
    <LabelClassNamesProvider classNames={classNames}>
      <LabelMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        <LabelRoot forwardedRef={ref} {...rest} />
      </LabelMotionProvider>
    </LabelClassNamesProvider>
  );
});
 
export { LabelSlot };
 