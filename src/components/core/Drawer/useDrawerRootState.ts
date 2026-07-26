import { useCallback, useId, useRef, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import { DRAWER_SIZE, footerButtonSizeForDrawer } from "./drawerStyles";
import type {
  DrawerContextValue,
  DrawerPlacement,
  UseDrawerRootStateProps,
} from "./drawerTypes";

const DEFAULT_PLACEMENT: DrawerPlacement = "right";

export function useDrawerRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = DEFAULT_PLACEMENT,
  size = "base",
  portalContainer,
}: UseDrawerRootStateProps & { placement?: DrawerPlacement }) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const titleId = useId();
  const descriptionId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  // Placeholder refs — overridden by DrawerPanel's context inside the portal.
  const placeholderOverlayRef = useRef<HTMLDivElement | null>(null);
  const placeholderPanelRef = useRef<HTMLDivElement | null>(null);
  const placeholderSkipCloseAnimRef = useRef(false);

  const setHasTitleStable = useCallback((value: boolean) => {
    setHasTitle(value);
  }, []);

  const setHasDescriptionStable = useCallback((value: boolean) => {
    setHasDescription(value);
  }, []);

  const sizePreset = DRAWER_SIZE[size];

  const contextValue: DrawerContextValue = {
    open,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle: setHasTitleStable,
    hasDescription,
    setHasDescription: setHasDescriptionStable,
    onOpenChange: setOpen,
    placement,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForDrawer(size),
    overlayRef: placeholderOverlayRef,
    panelRef: placeholderPanelRef,
    skipCloseAnimRef: placeholderSkipCloseAnimRef,
    portalContainer,
  };

  return { contextValue };
}
