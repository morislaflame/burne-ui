import { useMemo } from "react";

import { kbdRootClass } from "./kbdStyles";
import type { UseKbdRootStateProps } from "./kbdTypes";

export function useKbdRootState({
  variant,
  size,
  className,
  classNames,
}: UseKbdRootStateProps) {
  const rootClass = useMemo(
    () =>
      kbdRootClass({
        variant,
        size,
        slotRoot: classNames?.root,
        className,
      }),
    [className, classNames?.root, size, variant],
  );

  return {
    variant,
    size,
    rootClass,
  };
}
