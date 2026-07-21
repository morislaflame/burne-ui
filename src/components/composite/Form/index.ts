import { FormActions, FormAnnounce, FormDescription, FormErrorSummary, FormField, FormRoot, FormSection, FormTitle } from "./Form";

export const Form = Object.assign(FormRoot, {
  Section: FormSection,
  Title: FormTitle,
  Description: FormDescription,
  Actions: FormActions,
  ErrorSummary: FormErrorSummary,
  Announce: FormAnnounce,
  Field: FormField,
});

export {
  FormRoot,
  FormSection,
  FormTitle,
  FormDescription,
  FormActions,
  FormErrorSummary,
  FormAnnounce,
  FormField,
  type FormProps,
  type FormSectionProps,
  type FormTitleProps,
  type FormDescriptionProps,
  type FormActionsProps,
  type FormErrorSummaryProps,
  type FormAnnounceProps,
  type FormFieldProps,
  type FormClassNames,
} from "./Form";

export {
  useFormField,
  useFormControlProps,
} from "./useFormControlProps";
export { useFormFieldBinding } from "./useFormFieldBinding";
export {
  useOptionalFormBindingContext,
  useFormBindingContext,
} from "./formContext";
export type {
  FormValues,
  FormFieldRules,
  FormResolver,
  FormValidateMode,
  UseFormControlPropsOptions,
  UseFormFieldBindingOptions,
  FormBindingContextValue,
} from "./formTypes";
