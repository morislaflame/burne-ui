import { useMemo } from "react";

import { useSkinVariant } from "@/skins/skinContext";
import { cn } from "@/utils/cn";
 
import { useKbdClassNames } from "./kbdContext";
import { kbdRootClass } from "./kbdStyles";
import type { UseKbdRootStateProps } from "./kbdTypes";
 
export function useKbdRootState({
  variant: variantProp,
  size,
  className,
  classNames,
}: UseKbdRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const parentClassNames = useKbdClassNames();
  const slotRoot = cn(parentClassNames.root, classNames?.root);
  const rootClass = useMemo(
    () =>
      kbdRootClass({
        variant,
        size,
        slotRoot,
        className,
      }),
    [className, size, slotRoot, variant],
  );
 
  return {
    variant,
    size,
    rootClass,
  };
}
 