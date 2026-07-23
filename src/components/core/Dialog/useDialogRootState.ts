import { useCallback, useId, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import { DIALOG_SIZE, footerButtonSizeForDialog } from "./dialogStyles";
import type { DialogContextValue, UseDialogRootStateProps } from "./dialogTypes";

export function useDialogRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  size = "base",
  portalContainer,
}: UseDialogRootStateProps) {
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

  const sizePreset = DIALOG_SIZE[size];

  const contextValue: DialogContextValue = {
    open,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle: setHasTitleStable,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange: setOpen,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForDialog(size),
    portalContainer,
  };

  return { contextValue };
}
