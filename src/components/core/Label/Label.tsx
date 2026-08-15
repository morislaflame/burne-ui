import type { HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";
import { useMemo } from "react";

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
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: Omit<LabelProps, "classNames" | "motion">) {
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
        {...part.pointerHandlers}
        {...rest}
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
      {...part.pointerHandlers}
      {...spanRest}
    >
      <LabelContent required={required} variant={variant}>
        {children}
      </LabelContent>
    </span>
  );
}

export function Label({ classNames, motion, ...rest }: LabelProps) {
  const motionDefaults = useMemo(() => resolveLabelMotionDefaults(), []);
  return (
    <LabelClassNamesProvider classNames={classNames}>
      <LabelMotionProvider motion={motion} defaults={motionDefaults}>
        <LabelRoot {...rest} />
      </LabelMotionProvider>
    </LabelClassNamesProvider>
  );
}

export { LabelSlot };
