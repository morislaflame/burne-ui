import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { mergeTextAreaSlotClass } from "./textAreaAPI";
import {
  TextAreaClassNamesProvider,
  TextAreaFieldProvider,
} from "./textAreaContext";
import {
  TextAreaSimpleBody,
} from "./textAreaParts";
import type { TextAreaSimpleProps } from "./textAreaTypes";
import { useTextAreaRootState } from "./useTextAreaRootState";

export type {
  TextAreaClassNames,
  TextAreaErrorProps,
  TextAreaHintProps,
  TextAreaProps,
  TextAreaRootProps,
  TextAreaSimpleProps,
  TextAreaSize,
  TextAreaStatus,
  TextAreaVariant,
} from "./textAreaTypes";

export { TextAreaControl, TextAreaError, TextAreaHint, TextAreaLabel } from "./textAreaParts";

export function TextAreaRoot({
  children,
  label,
  hint,
  error,
  className,
  classNames,
  id: idProp,
  isRequired = false,
  status = "default",
  size = "base",
  ...rest
}: TextAreaSimpleProps) {
  const state = useTextAreaRootState({
    children,
    label,
    hint,
    error,
    id: idProp,
    isRequired,
    status,
    size,
  });

  const body = state.isCompound ? (
    children
  ) : (
    <TextAreaSimpleBody
      label={state.label}
      hint={state.hint}
      error={state.error}
      textareaId={state.textareaId}
      labelId={state.fieldCtx.labelId}
      size={state.size}
      status={state.status}
      controlProps={rest}
    />
  );

  return (
    <TextAreaFieldProvider value={state.fieldCtx}>
      <TextAreaClassNamesProvider classNames={classNames}>
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <FieldRoot className={mergeTextAreaSlotClass(classNames?.root, className)}>
            {body}
          </FieldRoot>
        </FieldLabelContext.Provider>
      </TextAreaClassNamesProvider>
    </TextAreaFieldProvider>
  );
}

TextAreaRoot.displayName = "TextArea";
