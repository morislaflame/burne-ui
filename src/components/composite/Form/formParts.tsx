import { forwardRef, useEffect, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { useOptionalFormBindingContext } from "./formContext";

import { formErrorEntries } from "./formAPI";
import { useFormClassNames, useFormShellIds, useFormSize } from "./formContext";
import {
  formActionsClass,
  formAnnounceClass,
  formDescriptionClass,
  formErrorSummaryClass,
  formFieldClass,
  formHeaderClass,
  formSectionClass,
  formTitleClass,
  formTitleVariant,
} from "./formStyles";
import type {
  FormActionsProps,
  FormAnnounceProps,
  FormDescriptionProps,
  FormErrorSummaryProps,
  FormFieldProps,
  FormHeaderProps,
  FormSectionProps,
  FormTitleProps,
} from "./formTypes";

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  function FormSection({ className = "", classNames, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const size = useFormSize();
    return (
      <div
        ref={ref}
        className={formSectionClass(size, className, {
          ...rootClassNames,
          section: classNames?.section,
        })}
        {...rest}
      />
    );
  },
);

FormSection.displayName = "Form.Section";

export const FormHeader = forwardRef<HTMLDivElement, FormHeaderProps>(
  function FormHeader({ className = "", classNames, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const size = useFormSize();
    return (
      <div
        ref={ref}
        className={formHeaderClass(size, className, {
          ...rootClassNames,
          header: classNames?.header,
        })}
        {...rest}
      />
    );
  },
);

FormHeader.displayName = "Form.Header";

export const FormTitle = forwardRef<HTMLHeadingElement, FormTitleProps>(
  function FormTitle({ className = "", id, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const size = useFormSize();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant={formTitleVariant(size)}
        id={id ?? shellIds?.titleId}
        className={formTitleClass(size, className, rootClassNames)}
        {...rest}
      />
    );
  },
);

FormTitle.displayName = "Form.Title";

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  function FormDescription({ className = "", id, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const size = useFormSize();
    return (
      <p
        ref={ref}
        id={id ?? shellIds?.descriptionId}
        className={formDescriptionClass(size, className, rootClassNames)}
        {...rest}
      />
    );
  },
);

FormDescription.displayName = "Form.Description";

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  function FormActions({ className = "", ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const size = useFormSize();
    return (
      <div
        ref={ref}
        className={formActionsClass(size, className, rootClassNames)}
        {...rest}
      />
    );
  },
);

FormActions.displayName = "Form.Actions";

export const FormErrorSummary = forwardRef<HTMLDivElement, FormErrorSummaryProps>(
  function FormErrorSummary({ className = "", id, children, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const form = useOptionalFormBindingContext();
    const errors = form?.getErrors() ?? {};
    const entries = formErrorEntries(errors);

    if (entries.length === 0) return null;

    const content =
      typeof children === "function"
        ? children(entries)
        : (children ?? entries.map(([, message]) => message).join(". "));

    return (
      <div
        ref={ref}
        id={id ?? shellIds?.errorSummaryId}
        role="alert"
        className={formErrorSummaryClass(className, rootClassNames)}
        {...rest}
      >
        {content}
      </div>
    );
  },
);

FormErrorSummary.displayName = "Form.ErrorSummary";

export const FormAnnounce = forwardRef<HTMLDivElement, FormAnnounceProps>(
  function FormAnnounce({ className = "", id, message, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    if (!message) return null;

    return (
      <div
        ref={ref}
        id={id ?? shellIds?.announceId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={formAnnounceClass(className, rootClassNames)}
        {...rest}
      >
        {message}
      </div>
    );
  },
);

FormAnnounce.displayName = "Form.Announce";

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ name, rules, className = "", classNames, children, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const form = useOptionalFormBindingContext();

    useEffect(() => {
      if (!form || !rules) return;
      form.registerFieldRules(name, rules);
      return () => form.unregisterFieldRules(name);
    }, [form, name, rules]);

    return (
      <div
        ref={ref}
        className={formFieldClass(className, { ...rootClassNames, field: classNames?.field })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FormField.displayName = "Form.Field";
