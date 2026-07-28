import type { TextVariant } from "@/components/core/Text";
import { resolveComponentSize } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";
import type { Prettify } from "@/utils/prettify";

import type { FormClassNames, FormSize } from "./formTypes";

export type { FormSize };

export type FormSizeLayout = {
  rootGap: string;
  headingGap: string;
  sectionGap: string;
  actionsGap: string;
  actionsPaddingTop: string;
  titleVariant: TextVariant;
  titleClassName: string;
  descClassName: string;
};

export const FORM_SIZE_LAYOUT: Record<FormSize, FormSizeLayout> = {
  small: {
    rootGap: "gap-large",
    headingGap: "gap-xsmall",
    sectionGap: "gap-small",
    actionsGap: "gap-xsmall",
    actionsPaddingTop: "pt-xsmall",
    titleVariant: "base",
    titleClassName: "font-w-mid text-foreground",
    descClassName: "text-small text-muted",
  },
  base: {
    rootGap: "gap-2xlarge",
    headingGap: "gap-small",
    sectionGap: "gap-base",
    actionsGap: "gap-small",
    actionsPaddingTop: "pt-small",
    titleVariant: "mid",
    titleClassName: "font-w-mid text-foreground",
    descClassName: "text-base text-muted",
  },
  mid: {
    rootGap: "gap-2xlarge",
    headingGap: "gap-base",
    sectionGap: "gap-base",
    actionsGap: "gap-small",
    actionsPaddingTop: "pt-base",
    titleVariant: "mid",
    titleClassName: "font-w-mid text-foreground",
    descClassName: "text-base text-muted",
  },
  large: {
    rootGap: "gap-3xlarge",
    headingGap: "gap-base",
    sectionGap: "gap-mid",
    actionsGap: "gap-base",
    actionsPaddingTop: "pt-base",
    titleVariant: "large",
    titleClassName: "font-w-mid text-foreground",
    descClassName: "text-mid text-muted",
  },
};

export function resolveFormSize(size?: FormSize): FormSize {
  return resolveComponentSize(size);
}

export function formSizeLayout(size?: FormSize): FormSizeLayout {
  return FORM_SIZE_LAYOUT[resolveFormSize(size)];
}

export function formRootClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  return cn(
    "flex w-full max-w-full flex-col text-left",
    formSizeLayout(size).rootGap,
    classNames?.root,
    className,
  );
}

export function formHeaderClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  return cn(
    "flex flex-col",
    formSizeLayout(size).headingGap,
    classNames?.header,
    className,
  );
}

export function formSectionClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  return cn("flex flex-col", formSizeLayout(size).sectionGap, classNames?.section, className);
}

export function formTitleClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  return cn(formSizeLayout(size).titleClassName, classNames?.title, className);
}

export function formTitleVariant(size?: FormSize): TextVariant {
  return formSizeLayout(size).titleVariant;
}

export function formDescriptionClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  return cn(formSizeLayout(size).descClassName, classNames?.description, className);
}

export function formActionsClass(
  size?: FormSize,
  className?: string,
  classNames?: Prettify<FormClassNames>,
): string {
  const layout = formSizeLayout(size);
  return cn(
    "flex flex-wrap items-center justify-end",
    layout.actionsGap,
    layout.actionsPaddingTop,
    classNames?.actions,
    className,
  );
}

export function formErrorSummaryClass(className?: string, classNames?: Prettify<FormClassNames>): string {
  return cn("sr-only", classNames?.errorSummary, className);
}

export function formAnnounceClass(className?: string, classNames?: Prettify<FormClassNames>): string {
  return cn("sr-only", classNames?.announce, className);
}

export function formFieldClass(className?: string, classNames?: Prettify<FormClassNames>): string {
  return cn(className, classNames?.field);
}
