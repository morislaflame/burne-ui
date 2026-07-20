import { useMemo, type ReactNode } from "react";

import { injectFooterButtonSize } from "./dialogAPI";
import { useDialog } from "./dialogContext";

export function useDialogFooterState(children: ReactNode): ReactNode {
  const { footerButtonSize } = useDialog();

  return useMemo(
    () => injectFooterButtonSize(children, footerButtonSize),
    [children, footerButtonSize],
  );
}
