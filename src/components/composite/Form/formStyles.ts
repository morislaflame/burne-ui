import { cn } from "@/utils/cn";

import type { FormClassNames } from "./formTypes";

export function formRootClass(className?: string, classNames?: FormClassNames): string {
  return cn(
    "flex w-full max-w-full flex-col gap-large text-left",
    classNames?.root,
    className,
  );
}

export function formSectionClass(className?: string, classNames?: FormClassNames): string {
  return cn("flex flex-col gap-base", classNames?.section, className);
}

export function formTitleClass(className?: string, classNames?: FormClassNames): string {
  return cn("text-base font-w-mid text-foreground", classNames?.title, className);
}

export function formDescriptionClass(className?: string, classNames?: FormClassNames): string {
  return cn("text-base text-muted", classNames?.description, className);
}

export function formActionsClass(className?: string, classNames?: FormClassNames): string {
  return cn("flex flex-wrap items-center justify-end gap-small pt-small", classNames?.actions, className);
}

export function formErrorSummaryClass(className?: string, classNames?: FormClassNames): string {
  return cn("sr-only", classNames?.errorSummary, className);
}

export function formAnnounceClass(className?: string, classNames?: FormClassNames): string {
  return cn("sr-only", classNames?.announce, className);
}

export function formFieldClass(className?: string, classNames?: FormClassNames): string {
  return cn(className, classNames?.field);
}
