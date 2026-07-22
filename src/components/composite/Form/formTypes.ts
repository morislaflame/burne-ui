import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type FormValues = Record<string, unknown>;

export type FormValidateMode = "onSubmit" | "onBlur" | "onChange";

export type FormFieldRules = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: unknown, values: FormValues) => string | undefined;
};

export type FormResolverResult<TValues extends FormValues = FormValues> = {
  values?: TValues;
  errors?: Partial<Record<string, string>>;
};

export type FormResolver<TValues extends FormValues = FormValues> = (
  values: TValues,
) => FormResolverResult<TValues> | Promise<FormResolverResult<TValues>>;

export type FormBindingContextValue = {
  disabled: boolean;
  readOnly: boolean;
  size?: ComponentSize;
  validateMode: FormValidateMode;
  isSubmitting: boolean;
  submitCount: number;
  getValue: (name: string) => unknown;
  setValue: (name: string, value: unknown, options?: { shouldValidate?: boolean }) => void;
  getError: (name: string) => string | undefined;
  getErrors: () => Record<string, string>;
  getFieldRules: (name: string) => FormFieldRules | undefined;
  setTouched: (name: string, touched: boolean) => void;
  isTouched: (name: string) => boolean;
  registerRef: (name: string, node: HTMLElement | null) => void;
  registerFieldRules: (name: string, rules?: FormFieldRules) => void;
  unregisterFieldRules: (name: string) => void;
  validateField: (name: string) => string | undefined;
  validateForm: () => Record<string, string>;
  focusFirstInvalid: () => void;
  announce: string | null;
  clearAnnounce: () => void;
};

export type UseFormControlPropsOptions = {
  name?: string;
  value?: unknown;
  defaultValue?: unknown;
  onChange?: (event: unknown) => void;
  onBlur?: (event: unknown) => void;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  rules?: FormFieldRules;
};

export type UseFormFieldBindingOptions = {
  name?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  disabled?: boolean;
  readOnly?: boolean;
  rules?: FormFieldRules;
};

export type FormClassNames = {
  root?: string;
  section?: string;
  title?: string;
  description?: string;
  actions?: string;
  errorSummary?: string;
  announce?: string;
  field?: string;
};

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  children?: ReactNode;
  classNames?: FormClassNames;
  defaultValues?: FormValues;
  values?: FormValues;
  onValuesChange?: (values: FormValues) => void;
  rules?: Record<string, FormFieldRules>;
  resolver?: FormResolver;
  validateMode?: FormValidateMode;
  readOnly?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  onSubmit?: (values: FormValues) => void | Promise<void>;
  onSubmitError?: (errors: Record<string, string>) => void;
};

export type FormSectionProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Pick<FormClassNames, "section">;
};

export type FormTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type FormActionsProps = HTMLAttributes<HTMLDivElement>;
export type FormErrorSummaryProps = HTMLAttributes<HTMLDivElement>;
export type FormAnnounceProps = HTMLAttributes<HTMLDivElement> & {
  message?: string | null;
};

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  rules?: FormFieldRules;
  classNames?: Pick<FormClassNames, "field">;
};

export type UseFormRootStateProps = FormProps;

export type FormShellIds = {
  titleId: string;
  descriptionId: string;
  errorSummaryId: string;
  announceId: string;
};
