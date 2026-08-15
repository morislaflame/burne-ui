import { forwardRef, useEffect, useMemo, type ForwardedRef, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { mergeMotionSlotMaps } from "@/components/core/utils/slotMotion";
import { useOptionalFormBindingContext } from "./formContext";

import { formErrorEntries } from "./formAPI";
import { useFormSlotMotion } from "./formAnimations";
import {
  FormMotionProvider,
  useFormClassNames,
  useFormShellIds,
  useFormSize,
  useOptionalFormMotionScope,
} from "./formContext";
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
  function FormSection({ className = "", classNames, motion, ...rest }, ref) {
    const parentScope = useOptionalFormMotionScope();
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { section: motion } : undefined,
    );
    const motionDefaults = useMemo(() => ({}), []);

    return (
      <FormMotionProvider motion={mergedMotion} defaults={motionDefaults}>
        <FormSectionSurface
          forwardedRef={ref}
          className={className}
          classNames={classNames}
          itemMotion={motion}
          rest={rest}
        />
      </FormMotionProvider>
    );
  },
);

function FormSectionSurface({
  forwardedRef,
  className,
  classNames,
  itemMotion,
  rest,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  className: string;
  classNames: FormSectionProps["classNames"];
  itemMotion?: FormSectionProps["motion"];
  rest: Omit<FormSectionProps, "className" | "classNames" | "motion">;
}) {
  const rootClassNames = useFormClassNames();
  const size = useFormSize();
  const part = useFormSlotMotion<HTMLDivElement>("section", {
    motion: itemMotion,
    forwardedRef,
  });
  return (
    <div
      ref={part.setRef}
      className={formSectionClass(size, className, {
        ...rootClassNames,
        section: classNames?.section,
      })}
      {...part.pointerHandlers}
      {...rest}
    />
  );
}

FormSection.displayName = "Form.Section";

export const FormHeader = forwardRef<HTMLDivElement, FormHeaderProps>(
  function FormHeader({ className = "", classNames, motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const size = useFormSize();
    const part = useFormSlotMotion<HTMLDivElement>("header", {
      motion,
      forwardedRef: ref,
    });
    return (
      <div
        ref={part.setRef}
        className={formHeaderClass(size, className, {
          ...rootClassNames,
          header: classNames?.header,
        })}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  },
);

FormHeader.displayName = "Form.Header";

export const FormTitle = forwardRef<HTMLHeadingElement, FormTitleProps>(
  function FormTitle({ className = "", id, motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const size = useFormSize();
    const part = useFormSlotMotion<HTMLHeadingElement>("title", {
      motion,
      forwardedRef: ref,
    });
    return (
      <Text
        ref={part.setRef as Ref<HTMLElement>}
        as="h2"
        variant={formTitleVariant(size)}
        id={id ?? shellIds?.titleId}
        className={formTitleClass(size, className, rootClassNames)}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  },
);

FormTitle.displayName = "Form.Title";

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  function FormDescription({ className = "", id, motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const size = useFormSize();
    const part = useFormSlotMotion<HTMLParagraphElement>("description", {
      motion,
      forwardedRef: ref,
    });
    return (
      <p
        ref={part.setRef}
        id={id ?? shellIds?.descriptionId}
        className={formDescriptionClass(size, className, rootClassNames)}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  },
);

FormDescription.displayName = "Form.Description";

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  function FormActions({ className = "", motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const size = useFormSize();
    const part = useFormSlotMotion<HTMLDivElement>("actions", {
      motion,
      forwardedRef: ref,
    });
    return (
      <div
        ref={part.setRef}
        className={formActionsClass(size, className, rootClassNames)}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  },
);

FormActions.displayName = "Form.Actions";

export const FormErrorSummary = forwardRef<HTMLDivElement, FormErrorSummaryProps>(
  function FormErrorSummary({ className = "", id, children, motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const form = useOptionalFormBindingContext();
    const errors = form?.getErrors() ?? {};
    const entries = formErrorEntries(errors);
    const part = useFormSlotMotion<HTMLDivElement>("errorSummary", {
      motion,
      forwardedRef: ref,
    });

    if (entries.length === 0) return null;

    const content =
      typeof children === "function"
        ? children(entries)
        : (children ?? entries.map(([, message]) => message).join(". "));

    return (
      <div
        ref={part.setRef}
        id={id ?? shellIds?.errorSummaryId}
        role="alert"
        className={formErrorSummaryClass(className, rootClassNames)}
        {...part.pointerHandlers}
        {...rest}
      >
        {content}
      </div>
    );
  },
);

FormErrorSummary.displayName = "Form.ErrorSummary";

export const FormAnnounce = forwardRef<HTMLDivElement, FormAnnounceProps>(
  function FormAnnounce({ className = "", id, message, motion, ...rest }, ref) {
    const rootClassNames = useFormClassNames();
    const shellIds = useFormShellIds();
    const part = useFormSlotMotion<HTMLDivElement>("announce", {
      motion,
      forwardedRef: ref,
    });
    if (!message) return null;

    return (
      <div
        ref={part.setRef}
        id={id ?? shellIds?.announceId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={formAnnounceClass(className, rootClassNames)}
        {...part.pointerHandlers}
        {...rest}
      >
        {message}
      </div>
    );
  },
);

FormAnnounce.displayName = "Form.Announce";

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ name, rules, className = "", classNames, children, motion, ...rest }, ref) {
    const parentScope = useOptionalFormMotionScope();
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { field: motion } : undefined,
    );
    const motionDefaults = useMemo(() => ({}), []);

    return (
      <FormMotionProvider motion={mergedMotion} defaults={motionDefaults}>
        <FormFieldSurface
          name={name}
          rules={rules}
          className={className}
          classNames={classNames}
          itemMotion={motion}
          forwardedRef={ref}
          rest={rest}
        >
          {children}
        </FormFieldSurface>
      </FormMotionProvider>
    );
  },
);

function FormFieldSurface({
  name,
  rules,
  className,
  classNames,
  children,
  itemMotion,
  forwardedRef,
  rest,
}: FormFieldProps & {
  itemMotion?: FormFieldProps["motion"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
  rest: Omit<FormFieldProps, "name" | "rules" | "className" | "classNames" | "children" | "motion">;
}) {
  const rootClassNames = useFormClassNames();
  const form = useOptionalFormBindingContext();
  const part = useFormSlotMotion<HTMLDivElement>("field", {
    motion: itemMotion,
    forwardedRef,
  });

  useEffect(() => {
    if (!form || !rules) return;
    form.registerFieldRules(name, rules);
    return () => form.unregisterFieldRules(name);
  }, [form, name, rules]);

  return (
    <div
      ref={part.setRef}
      className={formFieldClass(className, { ...rootClassNames, field: classNames?.field })}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </div>
  );
}

FormField.displayName = "Form.Field";
