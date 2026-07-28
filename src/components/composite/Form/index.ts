import { FormActions, FormAnnounce, FormDescription, FormErrorSummary, FormField, FormHeader, FormRoot, FormSection, FormTitle } from "./Form";

export const Form = Object.assign(FormRoot, {
  Section: FormSection,
  Header: FormHeader,
  Title: FormTitle,
  Description: FormDescription,
  Actions: FormActions,
  ErrorSummary: FormErrorSummary,
  Announce: FormAnnounce,
  Field: FormField,
});

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
