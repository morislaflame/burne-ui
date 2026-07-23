import { useCallback, useId, useState } from "react";

import { resolveAlertStatus, resolveAlertVariant } from "@/components/core/Alert/alertAPI";
import { useControllableState } from "@/components/core/utils/useControllableState";

import { ALERT_DIALOG_SIZE, footerButtonSizeForAlertDialog } from "./alertDialogStyles";
import type { AlertDialogContextValue, UseAlertDialogRootStateProps } from "./alertDialogTypes";

export function useAlertDialogRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  status,
  variant = "default",
  size = "base",
  closeOnEscape = true,
  portalContainer,
}: UseAlertDialogRootStateProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const titleId = useId();
  const descriptionId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const setHasTitleStable = useCallback((value: boolean) => {
    setHasTitle(value);
  }, []);

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
    hasTitle,
    setHasTitle: setHasTitleStable,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange: setOpen,
    closeOnEscape,
    variant: resolvedVariant,
    status: resolvedStatus,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForAlertDialog(size),
    portalContainer,
  };

  return { contextValue };
}
