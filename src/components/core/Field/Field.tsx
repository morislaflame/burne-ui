import { forwardRef, useId } from "react";

import {
  FieldError,
  FieldHint,
  FieldLabel,
  FieldLegend,
  FieldLegendHeader,
  FieldRoot,
  FieldSetActions,
  FieldSetGroup,
  FieldSetRootInner,
} from "./fieldParts";
import { FieldSetClassNamesProvider, FieldSetSizeProvider } from "./fieldContext";
import type { FieldSetProps } from "./fieldTypes";
import { useFieldSetRootState } from "./useFieldSetRootState";

export type {
  FieldRootProps,
  FieldHintProps,
  FieldHintStatus,
  FieldLabelProps,
  FieldErrorProps,
  FieldSetProps,
  FieldSetGroupProps,
  FieldSetActionsProps,
  FieldLegendProps,
  FieldLegendHeaderProps,
  FieldSetSize,
  FieldClassNames,
  FieldSetClassNames,
} from "./fieldTypes";

export { FieldRoot };

export const FieldSetRoot = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  function FieldSetRoot(
    {
      children,
      className,
      classNames,
      hintId,
      errorId,
      disabled,
      size = "base",
      ...rest
    },
    ref,
  ) {
    const state = useFieldSetRootState(children);

    return (
      <FieldSetSizeProvider size={size}>
        <FieldSetClassNamesProvider classNames={classNames}>
          <FieldSetRootInner
            ref={ref}
            className={className}
            hintId={hintId}
            errorId={errorId}
            disabled={disabled}
            state={state}
            {...rest}
          />
        </FieldSetClassNamesProvider>
      </FieldSetSizeProvider>
    );
  },
);

FieldSetRoot.displayName = "FieldSet";

export function useFieldSetHintId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-hint`;
}

export function useFieldSetErrorId(providedId?: string) {
  const autoId = useId();
  return providedId ?? `${autoId}-error`;
}

export {
  FieldHint,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldLegendHeader,
  FieldSetGroup,
  FieldSetActions,
};
