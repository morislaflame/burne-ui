import type { FormHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

/** Вертикальная раскладка полей (герлей между дочерними `Input` и блоками). */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className = "", ...rest },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cn("flex w-full max-w-full flex-col gap-4", className)}
      {...rest}
    />
  );
});
