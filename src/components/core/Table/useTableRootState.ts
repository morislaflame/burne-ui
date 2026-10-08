import { useSkinVariant } from "@/skins/skinContext";

import type { UseTableRootStateProps } from "./tableTypes";

export function useTableRootState({ variant: variantProp }: UseTableRootStateProps) {
  const variant = useSkinVariant(variantProp);
  return { variant };
}
