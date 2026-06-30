import { forwardRef } from "react";

import { FormBindingContext } from "./formContext";

import { formRootDescribedBy, formRootLabelledBy } from "./formA11y";
import { FormClassNamesProvider, FormShellProvider } from "./formContext";
import {
  FormActions,
  FormAnnounce,
  FormDescription,
  FormErrorSummary,
  FormField,
  FormSection,
  FormTitle,
} from "./formParts";
import { formRootClass } from "./formStyles";
import type { FormProps } from "./formTypes";
import { useFormRootState } from "./useFormRootState";

export type {
  FormProps,
  FormSectionProps,
  FormTitleProps,
  FormDescriptionProps,
  FormActionsProps,
  FormErrorSummaryProps,
  FormAnnounceProps,
  FormFieldProps,
  FormClassNames,
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
  ...rest
}, ref,
) {
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
    size,
    disabled,
    onSubmit,
    onSubmitError,
    classNames,
  });

  return (
    <FormClassNamesProvider classNames={classNames}>
      <FormBindingContext.Provider value={bindingValue}>
        <FormShellProvider shellIds={shellIds}>
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
          className={formRootClass(className, classNames)}
          {...rest}
        >
          <FormAnnounce message={announce} />
          <FormErrorSummary />
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
  FormTitle,
  FormDescription,
  FormActions,
  FormErrorSummary,
  FormAnnounce,
  FormField,
};
