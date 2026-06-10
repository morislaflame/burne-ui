import { forwardRef, type HTMLAttributes, type Ref } from "react";

import { cn } from "@/utils/cn";

export type SeparatorOrientation = "horizontal" | "vertical";

export type SeparatorProps = Omit<
  HTMLAttributes<HTMLElement>,
  "role"
> & {
  /** Линия или столбец. По умолчанию горизонтальная линия во всю ширину. */
  orientation?: SeparatorOrientation;
};

/**
 * Разделитель списков и блоков — по теме (`border-base`).
 */
export const Separator = forwardRef<HTMLElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      className = "",
      ...rest
    },
    ref,
  ) {
    const sharedClassName = cn(
      "box-border shrink-0",
      orientation === "horizontal"
        ? "my-xsmall h-0 w-full min-w-0 max-w-full border-t-token"
        : "mx-xsmall min-h-[1.5rem] w-0 self-stretch border-l-token",
      className,
    );

    if (orientation === "horizontal") {
      return <hr ref={ref as Ref<HTMLHRElement>} className={sharedClassName} {...rest} />;
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        role="separator"
        aria-orientation="vertical"
        className={sharedClassName}
        {...rest}
      />
    );
  },
);

Separator.displayName = "Separator";
