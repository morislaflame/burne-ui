import type { ButtonSize } from "@/components/core/Button";

import type { AlertDialogSize } from "./alertDialogTypes";

const FOOTER_BUTTON_SIZE: Record<AlertDialogSize, ButtonSize> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

/** Button size for the given `size` modal (if you don't use `AlertDialog.Footer` with auto-substitution). */
export function footerButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return FOOTER_BUTTON_SIZE[dialogSize];
}
