import { useMemo } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { kbdRootClass } from "./kbdStyles";
import type { UseKbdRootStateProps } from "./kbdTypes";
 
export function useKbdRootState({
  variant: variantProp,
  size,
  className,
  classNames,
}: UseKbdRootStateProps) {
  const variant = useSkinVariant(variantProp);
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
 