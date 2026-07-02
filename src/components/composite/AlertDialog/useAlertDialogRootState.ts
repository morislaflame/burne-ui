import { useCallback, useId, useState } from "react";

import {
  resolveAlertStatus,
  resolveAlertVariant,
} from "@/components/core/Alert/alertAPI";

import { ALERT_DIALOG_SIZE, footerButtonSizeForAlertDialog } from "./alertDialogStyles";
import type { AlertDialogContextValue, UseAlertDialogRootStateProps } from "./alertDialogTypes";

export function useAlertDialogRootState({
  open,
  onOpenChange,
  status,
  variant = "default",
  size = "base",
}: UseAlertDialogRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const resolvedVariant = resolveAlertVariant(variant);
  const resolvedStatus = resolveAlertStatus(status);
  const sizePreset = ALERT_DIALOG_SIZE[size];

  const contextValue: AlertDialogContextValue = {
    open,
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    variant: resolvedVariant,
    status: resolvedStatus,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForAlertDialog(size),
  };

  return { contextValue };
}
