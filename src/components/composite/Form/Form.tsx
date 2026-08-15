import { forwardRef, useMemo, type FormEventHandler, type ForwardedRef, type ReactNode } from "react";

import { FormBindingContext } from "./formContext";

import { formRootDescribedBy, formRootLabelledBy } from "./formA11y";
import { resolveFormMotionDefaults, useFormSlotMotion } from "./formAnimations";
import { FormClassNamesProvider, FormMotionProvider, FormShellProvider } from "./formContext";
import { FormActions, FormAnnounce, FormDescription, FormErrorSummary, FormField, FormHeader, FormSection, FormTitle } from "./formParts";
import { formRootClass, resolveFormSize } from "./formStyles";
import type { FormProps, FormSize } from "./formTypes";
import { useFormRootState } from "./useFormRootState";

export type {
  FormProps,
  FormSectionProps,
  FormHeaderProps,
  FormTitleProps,
  FormDescriptionProps,
  FormActionsProps,
  FormErrorSummaryProps,
  FormAnnounceProps,
  FormFieldProps,
  FormClassNames,
  FormSize,
  FormMotion,
  FormPartMotion,
} from "./formTypes";

export const FormRoot = forwardRef<HTMLFormElement, FormProps>(function FormRoot(
  {
    children,
    className = "",
    classNames,
    defaultValues,
    values,
    onValuesChange,
    rules,
    resolver,
    validateMode,
    readOnly,
    size,
    disabled,
    onSubmit,
    onSubmitError,
    errorSummary,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const resolvedSize = resolveFormSize(size);
  const {
    shellIds,
    bindingValue,
    handleSubmit,
    hasErrors,
    announce,
  } = useFormRootState({
    defaultValues,
    values,
    onValuesChange,
    rules,
    resolver,
    validateMode,
    readOnly,
    disabled,
    onSubmit,
    onSubmitError,
    classNames,
  });
  const motionDefaults = useMemo(() => resolveFormMotionDefaults(), []);

  return (
    <FormClassNamesProvider classNames={classNames}>
      <FormBindingContext.Provider value={bindingValue}>
        <FormShellProvider shellIds={shellIds} size={resolvedSize}>
          <FormMotionProvider motion={motion} defaults={motionDefaults}>
            <FormRootSurface
              forwardedRef={ref}
              handleSubmit={handleSubmit}
              titleId={shellIds.titleId}
              descriptionId={shellIds.descriptionId}
              errorSummaryId={shellIds.errorSummaryId}
              hasErrors={hasErrors}
              resolvedSize={resolvedSize}
              className={className}
              classNames={classNames}
              announce={announce}
              errorSummary={errorSummary}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              rest={rest}
            >
              {children}
            </FormRootSurface>
          </FormMotionProvider>
        </FormShellProvider>
      </FormBindingContext.Provider>
    </FormClassNamesProvider>
  );
});

FormRoot.displayName = "Form";

function FormRootSurface({
  forwardedRef,
  handleSubmit,
  titleId,
  descriptionId,
  errorSummaryId,
  hasErrors,
  resolvedSize,
  className,
  classNames,
  announce,
  errorSummary,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLFormElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  titleId: string;
  descriptionId: string;
  errorSummaryId: string;
  hasErrors: boolean;
  resolvedSize: FormSize;
  className: string;
  classNames: FormProps["classNames"];
  announce: string | null;
  errorSummary: FormProps["errorSummary"];
  onPointerOver: FormProps["onPointerOver"];
  onPointerOut: FormProps["onPointerOut"];
  onPointerDown: FormProps["onPointerDown"];
  onPointerUp: FormProps["onPointerUp"];
  rest: Omit<
    FormProps,
    | "children"
    | "className"
    | "classNames"
    | "defaultValues"
    | "values"
    | "onValuesChange"
    | "rules"
    | "resolver"
    | "validateMode"
    | "readOnly"
    | "size"
    | "disabled"
    | "onSubmit"
    | "onSubmitError"
    | "errorSummary"
    | "motion"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
  children: ReactNode;
}) {
  const part = useFormSlotMotion<HTMLFormElement>("root", {
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    changeIdentity: hasErrors,
  });

  return (
    <form
      ref={part.setRef}
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={formRootLabelledBy(titleId)}
      aria-describedby={formRootDescribedBy({
        descriptionId,
        errorSummaryId,
        hasErrors,
      })}
      className={formRootClass(resolvedSize, className, classNames)}
      {...part.pointerHandlers}
      {...rest}
    >
      <FormAnnounce message={announce} />
      <FormErrorSummary>{errorSummary}</FormErrorSummary>
      {children}
    </form>
  );
}

export {
  FormSection,
  FormHeader,
  FormTitle,
  FormDescription,
  FormActions,
  FormErrorSummary,
  FormAnnounce,
  FormField,
};
