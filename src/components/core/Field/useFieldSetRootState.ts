import { useMemo, type ReactNode } from "react";
 
import { partitionFieldSetBody, splitFieldSetChildren, fieldSetHasError, fieldSetHasHint } from "./fieldAPI";
import type { UseFieldSetRootStateResult } from "./fieldTypes";
 
export function useFieldSetRootState(children: ReactNode): UseFieldSetRootStateResult {
  return useMemo(() => {
    const { legend, body } = splitFieldSetChildren(children);
    const { loose, groups, actions } = partitionFieldSetBody(body);
    return {
      legend,
      loose,
      groups,
      actions,
      hasHint: fieldSetHasHint(children),
      hasError: fieldSetHasError(children),
    };
  }, [children]);
}
 