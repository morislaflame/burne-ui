import { useEffect } from "react";

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

export function FormSection({ className = "", classNames, ...rest }: FormSectionProps) {
  const rootClassNames = useFormClassNames();
  return (
    <div
      className={formSectionClass(className, { ...rootClassNames, section: classNames?.section })}
      {...rest}
    />
  );
}

FormSection.displayName = "Form.Section";

export function FormTitle({ className = "", id, ...rest }: FormTitleProps) {
  const rootClassNames = useFormClassNames();
  const shellIds = useFormShellIds();
  return (
    <Text
      as="h2"
      variant="mid"
      id={id ?? shellIds?.titleId}
      className={formTitleClass(className, rootClassNames)}
      {...rest}
    />
  );
}

FormTitle.displayName = "Form.Title";

export function FormDescription({ className = "", id, ...rest }: FormDescriptionProps) {
  const rootClassNames = useFormClassNames();
  const shellIds = useFormShellIds();
  return (
    <p
      id={id ?? shellIds?.descriptionId}
      className={formDescriptionClass(className, rootClassNames)}
      {...rest}
    />
  );
}

FormDescription.displayName = "Form.Description";

export function FormActions({ className = "", ...rest }: FormActionsProps) {
  const rootClassNames = useFormClassNames();
  return <div className={formActionsClass(className, rootClassNames)} {...rest} />;
}

FormActions.displayName = "Form.Actions";

export function FormErrorSummary({ className = "", id, ...rest }: FormErrorSummaryProps) {
  const rootClassNames = useFormClassNames();
  const shellIds = useFormShellIds();
  const form = useOptionalFormBindingContext();
  const errors = form?.getErrors() ?? {};
  const entries = formErrorEntries(errors);

  if (entries.length === 0) return null;

  const summaryText = entries.map(([, message]) => message).join(". ");

  return (
    <div
      id={id ?? shellIds?.errorSummaryId}
      role="alert"
      aria-live="polite"
      className={formErrorSummaryClass(className, rootClassNames)}
      {...rest}
    >
      {summaryText}
    </div>
  );
}

FormErrorSummary.displayName = "Form.ErrorSummary";

export function FormAnnounce({ className = "", id, message }: FormAnnounceProps & { message?: string | null }) {
  const rootClassNames = useFormClassNames();
  const shellIds = useFormShellIds();
  if (!message) return null;

  return (
    <div
      id={id ?? shellIds?.announceId}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={formAnnounceClass(className, rootClassNames)}
    >
      {message}
    </div>
  );
}

FormAnnounce.displayName = "Form.Announce";

export function FormField({ name, rules, className = "", classNames, children }: FormFieldProps) {
  const rootClassNames = useFormClassNames();
  const form = useOptionalFormBindingContext();

  useEffect(() => {
    if (!form || !rules) return;
    form.registerFieldRules(name, rules);
    return () => form.unregisterFieldRules(name);
  }, [form, name, rules]);

  return (
    <div className={formFieldClass(className, { ...rootClassNames, field: classNames?.field })}>
      {children}
    </div>
  );
}

FormField.displayName = "Form.Field";
