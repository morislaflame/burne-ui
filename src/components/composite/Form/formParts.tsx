import { forwardRef, useEffect, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { useOptionalFormBindingContext } from "./formContext";

import { formErrorEntries } from "./formAPI";
import { useFormClassNames, useFormShellIds } from "./formContext";
import { formActionsClass, formAnnounceClass, formDescriptionClass, formErrorSummaryClass, formFieldClass, formSectionClass, formTitleClass } from "./formStyles";
import type {
  FormActionsProps,
  FormAnnounceProps,
  FormDescriptionProps,
  FormErrorSummaryProps,
  FormFieldProps,
  FormSectionProps,
  FormTitleProps,
} from "./formTypes";

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  function FormSection({ className = "", classNames, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    return (
      <div
        ref={ref}
        className={formSectionClass(className, { ...rootClassNames, section: classNames?.section })}
        {...rest}
      />
    );
  },
);

FormSection.displayName = "Form.Section";

export const FormTitle = forwardRef<HTMLHeadingElement, FormTitleProps>(
  function FormTitle({ className = "", id, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant="mid"
        id={id ?? shellIds?.titleId}
        className={formTitleClass(className, rootClassNames)}
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
    return (
      <p
        ref={ref}
        id={id ?? shellIds?.descriptionId}
        className={formDescriptionClass(className, rootClassNames)}
        {...rest}
      />
    );
  },
);

FormDescription.displayName = "Form.Description";

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  function FormActions({ className = "", ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    return (
      <div
        ref={ref}
        className={formActionsClass(className, rootClassNames)}
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
        aria-live="polite"
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
