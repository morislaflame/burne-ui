import type { ReactNode } from "react";

import { partitionFieldSetBody, splitFieldSetChildren } from "./fieldAPI";
import type { UseFieldSetRootStateResult } from "./fieldTypes";

export function useFieldSetRootState(children: ReactNode): UseFieldSetRootStateResult {
  const { legend, body } = splitFieldSetChildren(children);
  const { loose, groups, actions } = partitionFieldSetBody(body);

  return { legend, loose, groups, actions };
}
