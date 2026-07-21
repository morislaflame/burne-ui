import { useCallback, useId, useRef, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import type { DrawerContextValue, DrawerPlacement, UseDrawerRootStateProps } from "./drawerTypes";

const DEFAULT_PLACEMENT: DrawerPlacement = "right";

export function useDrawerRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = DEFAULT_PLACEMENT,
}: UseDrawerRootStateProps & { placement?: DrawerPlacement }) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const titleId = useId();
  const descriptionId = useId();
  const [hasDescription, setHasDescription] = useState(false);

  // Placeholder refs — overridden by DrawerPanel's context inside the portal.
  const placeholderOverlayRef = useRef<HTMLDivElement | null>(null);
  const placeholderPanelRef = useRef<HTMLDivElement | null>(null);
  const placeholderSkipCloseAnimRef = useRef(false);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const contextValue: DrawerContextValue = {
    open,
    titleId,
    descriptionId,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange: setOpen,
    placement,
    overlayRef: placeholderOverlayRef,
    panelRef: placeholderPanelRef,
    skipCloseAnimRef: placeholderSkipCloseAnimRef,
  };

  return { contextValue };
}
