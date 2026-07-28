import { forwardRef } from "react";

import { FormBindingContext } from "./formContext";

import { formRootDescribedBy, formRootLabelledBy } from "./formA11y";
import { FormClassNamesProvider, FormShellProvider } from "./formContext";
import { FormActions, FormAnnounce, FormDescription, FormErrorSummary, FormField, FormHeader, FormSection, FormTitle } from "./formParts";
import { formRootClass, resolveFormSize } from "./formStyles";
import type { FormProps } from "./formTypes";
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

  return (
    <FormClassNamesProvider classNames={classNames}>
      <FormBindingContext.Provider value={bindingValue}>
        <FormShellProvider shellIds={shellIds} size={resolvedSize}>
          <form
            ref={ref}
            noValidate
            onSubmit={handleSubmit}
            aria-labelledby={formRootLabelledBy(shellIds.titleId)}
            aria-describedby={formRootDescribedBy({
              descriptionId: shellIds.descriptionId,
              errorSummaryId: shellIds.errorSummaryId,
              hasErrors,
            })}
            className={formRootClass(resolvedSize, className, classNames)}
            {...rest}
          >
            <FormAnnounce message={announce} />
            <FormErrorSummary>{errorSummary}</FormErrorSummary>
            {children}
          </form>
        </FormShellProvider>
      </FormBindingContext.Provider>
    </FormClassNamesProvider>
  );
});

FormRoot.displayName = "Form";

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
