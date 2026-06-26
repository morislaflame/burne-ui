import type { FormHTMLAttributes, HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utils/cn";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export type FormSectionProps = HTMLAttributes<HTMLDivElement>;

/** Группа полей: плотный `gap-small` между дочерними элементами внутри секции. */
export function FormSection({ className = "", ...rest }: FormSectionProps) {
  return (
    <div
      className={cn("flex flex-col gap-small", className)}
      {...rest}
    />
  );
}

/** Вертикальная раскладка: `gap-mid` между секциями и прочими дочерними блоками. */
export const FormRoot = forwardRef<HTMLFormElement, FormProps>(function FormRoot(
  { className = "", ...rest },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cn("flex w-full max-w-full flex-col gap-mid text-left", className)}
      {...rest}
    />
  );
});

export const Form = Object.assign(FormRoot, {
  Section: FormSection,
});
