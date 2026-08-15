import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type FormValues = Record<string, unknown>;

export type FormValidateMode = "onSubmit" | "onBlur" | "onChange";

/** Form chrome size — Header / Title / Description / Section / Actions. Not cascaded to fields. */
export type FormSize = ComponentSize;

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

export type FormPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};

export type FormMotion = {
  root?: FormPartMotion;
  header?: FormPartMotion;
  title?: FormPartMotion;
  description?: FormPartMotion;
  actions?: FormPartMotion;
  errorSummary?: FormPartMotion;
  announce?: FormPartMotion;
  section?: FormPartMotion;
  field?: FormPartMotion;
};

export type FormClassNames = {
  root?: string;
  header?: string;
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
  classNames?: Prettify<FormClassNames>;
  defaultValues?: FormValues;
  values?: FormValues;
  onValuesChange?: (values: FormValues) => void;
  rules?: Record<string, FormFieldRules>;
  resolver?: FormResolver;
  validateMode?: FormValidateMode;
  readOnly?: boolean;
  disabled?: boolean;
  /**
   * Scales Form chrome only (`Header`, `Title`, `Description`, `Section`, `Actions`).
   * Does not cascade into embedded controls (`Input`, `Button`, …) — set their `size` explicitly.
   */
  size?: FormSize;
  onSubmit?: (values: FormValues) => void | Promise<void>;
  onSubmitError?: (errors: Record<string, string>) => void;
  /** Passed to the auto-rendered `Form.ErrorSummary` (`children` / render prop). */
  errorSummary?: ReactNode | ((entries: Array<[string, string]>) => ReactNode);
  /**
   * Per-slot motion (`root`, `header`, `title`, `description`, `actions`, `errorSummary`,
   * `announce`, `section`, `field`). Does not steal child Input motion. Defaults are empty.
   */
  motion?: Prettify<FormMotion>;
};

export type FormSectionProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Prettify<Pick<FormClassNames, "section">>;
  motion?: Prettify<FormPartMotion>;
};

export type FormHeaderProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Prettify<Pick<FormClassNames, "header">>;
  motion?: Prettify<FormPartMotion>;
};

export type FormTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  motion?: Prettify<FormPartMotion>;
};
export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  motion?: Prettify<FormPartMotion>;
};
export type FormActionsProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<FormPartMotion>;
};
export type FormErrorSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * Custom summary body. Function receives `[fieldName, message][]` from form context
   * (e.g. list with links to fields). Default: messages joined with `". "`.
   */
  children?: ReactNode | ((entries: Array<[string, string]>) => ReactNode);
  motion?: Prettify<FormPartMotion>;
};
export type FormAnnounceProps = HTMLAttributes<HTMLDivElement> & {
  message?: string | null;
  motion?: Prettify<FormPartMotion>;
};

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  rules?: FormFieldRules;
  classNames?: Prettify<Pick<FormClassNames, "field">>;
  motion?: Prettify<FormPartMotion>;
};

export type UseFormRootStateProps = FormProps;

export type FormShellIds = {
  titleId: string;
  descriptionId: string;
  errorSummaryId: string;
  announceId: string;
};

export type FormShellValue = {
  shellIds: FormShellIds;
  size: FormSize;
};
