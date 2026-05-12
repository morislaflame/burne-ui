import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export type SeparatorOrientation = "horizontal" | "vertical";

export type SeparatorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "role"
> & {
  /** Линия или столбец. По умолчанию горизонтальная линия во всю ширину. */
  orientation?: SeparatorOrientation;
};

/**
 * Разделитель списков и блоков — по теме (`border-base`).
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      className = "",
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation === "vertical" ? "vertical" : undefined}
        className={cn(
          "box-border shrink-0 border-solid border-base",
          orientation === "horizontal"
            ? "my-xsmall h-0 w-full min-w-0 max-w-full border-t"
            : "mx-xsmall min-h-[1.5rem] w-0 self-stretch border-l",
          className,
        )}
        {...rest}
      />
    );
  },
);

Separator.displayName = "Separator";
