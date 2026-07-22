import { forwardRef } from "react";

import { cn } from "@/utils/cn";

import { LOADING_DEFAULT_LABEL, loadingStatusProps } from "./loadingA11y";
import { LoadingDots, LoadingSpinner } from "./loadingParts";
import { LOADING_ROOT_CLASS } from "./loadingStyles";
import type { LoadingProps } from "./loadingTypes";

export type {
  LoadingClassNames,
  LoadingColor,
  LoadingProps,
  LoadingSize,
  LoadingType,
} from "./loadingTypes";

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(function Loading(
  {
    type = "spinner",
    size = "base",
    color = "primary",
    label = LOADING_DEFAULT_LABEL,
    className = "",
    classNames,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      {...loadingStatusProps(label)}
      className={cn(LOADING_ROOT_CLASS, classNames?.root, className)}
      {...rest}
    >
      {type === "dots" ? (
        <LoadingDots
          size={size}
          color={color}
          className={classNames?.dots}
          dotClassName={classNames?.dot}
        />
      ) : (
        <LoadingSpinner size={size} color={color} className={classNames?.spinner} />
      )}
    </span>
  );
});

Loading.displayName = "Loading";
