import { useCallback, useId, useState } from "react";

import type { DialogContextValue, UseDialogRootStateProps } from "./dialogTypes";

export function useDialogRootState({
  open,
  onOpenChange,
}: UseDialogRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const contextValue: DialogContextValue = {
    open,
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
  };

  return { contextValue };
}
