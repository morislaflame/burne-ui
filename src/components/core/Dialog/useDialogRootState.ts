import { useCallback, useId, useState } from "react";

import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";

import type { DialogContextValue, UseDialogRootStateProps } from "./dialogTypes";

export function useDialogRootState({
  open,
  onOpenChange,
  themeAnchor,
}: UseDialogRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  const contextValue: DialogContextValue = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
  };

  return {
    contextValue,
    portalTheme,
    lightUi,
    titleId,
    descriptionId,
    hasDescription,
  };
}
