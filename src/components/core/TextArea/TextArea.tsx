import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { TextAreaClassNamesProvider, TextAreaFieldProvider, TextAreaMotionProvider } from "./textAreaContext";
import { TextAreaSimpleBody } from "./textAreaParts";
import type { TextAreaSimpleProps } from "./textAreaTypes";
import { useTextAreaRootState } from "./useTextAreaRootState";

import { cn } from "@/utils/cn";

export type {
  TextAreaClassNames,
  TextAreaErrorProps,
  TextAreaHintProps,
  TextAreaControlProps,
  TextAreaProps,
  TextAreaSimpleProps,
  TextAreaSize,
  TextAreaStatus,
  TextAreaVariant,
  TextAreaMotion,
  TextAreaPartMotion,
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
  required = false,
  status = "default",
  size = "base",
  motion,
  ...rest
}: TextAreaSimpleProps) {
  const state = useTextAreaRootState({
    children,
    label,
    hint,
    error,
    id: idProp,
    required,
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
        <TextAreaMotionProvider motion={motion}>
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field className={cn(classNames?.root, className)} size={state.size}>
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </TextAreaMotionProvider>
      </TextAreaClassNamesProvider>
    </TextAreaFieldProvider>
  );
}

TextAreaRoot.displayName = "TextArea";
