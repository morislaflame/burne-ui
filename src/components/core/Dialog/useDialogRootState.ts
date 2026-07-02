import { useCallback, useId, useState } from "react";

import { DIALOG_SIZE, footerButtonSizeForDialog } from "./dialogStyles";
import type { DialogContextValue, UseDialogRootStateProps } from "./dialogTypes";

export function useDialogRootState({
  open,
  onOpenChange,
  size = "base",
}: UseDialogRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const sizePreset = DIALOG_SIZE[size];

  const contextValue: DialogContextValue = {
    open,
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForDialog(size),
  };

  return { contextValue };
}
