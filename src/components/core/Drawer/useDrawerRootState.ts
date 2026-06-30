import { useCallback, useId, useMemo, useState } from "react";

import {
  burneLightThemePortalProps,
  useBurneLightTheme,
  usePortalThemeAnchor,
} from "@/components/core/utils/burneLightTheme";

import { partitionDrawerChildren } from "./drawerAPI";
import type { UseDrawerRootStateProps } from "./drawerTypes";

export function useDrawerRootState({
  open,
  onOpenChange,
  themeAnchor,
  children,
}: UseDrawerRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const portalThemeAnchor = usePortalThemeAnchor(open, themeAnchor);
  const lightUi = useBurneLightTheme(portalThemeAnchor);
  const portalTheme = burneLightThemePortalProps(portalThemeAnchor);

  const { backdropIsDismissable, panelSegments } = useMemo(
    () => partitionDrawerChildren(children),
    [children],
  );

  const contextBase = {
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange,
  };

  return {
    contextBase,
    portalTheme,
    lightUi,
    titleId,
    descriptionId,
    hasDescription,
    backdropIsDismissable,
    panelSegments,
  };
}
