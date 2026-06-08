import type { ButtonSize } from "@/components/core/Button";

import type { AlertDialogSize } from "./alertDialogTypes";

/** Размер `Button` в `AlertDialog.Footer` по размеру модалки (имена ступеней совпадают). */
const FOOTER_BUTTON_SIZE: Record<AlertDialogSize, ButtonSize> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

/** Размер кнопок футера для заданного `size` модалки (если не используете `AlertDialog.Footer` с авто-подстановкой). */
export function footerButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return FOOTER_BUTTON_SIZE[dialogSize];
}
