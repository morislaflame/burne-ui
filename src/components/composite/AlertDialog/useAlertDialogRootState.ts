import { Children, isValidElement, useCallback, useId, useMemo, useState } from "react";
 
import { resolveAlertStatus, resolveAlertVariant } from "@/components/core/Alert/alertAPI";
import { useSkinVariant } from "@/skins/skinContext";
import { useControllableState } from "@/components/core/utils/useControllableState";
 
import { ALERT_DIALOG_SIZE, footerButtonSizeForAlertDialog } from "./alertDialogStyles";
import type { AlertDialogContextValue, AlertDialogOverlayProps, UseAlertDialogRootStateProps } from "./alertDialogTypes";
 
export function useAlertDialogRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  status,
  variant: variantProp,
  size = "base",
  closeOnEscape = true,
  closeOnInteractOutside = false,
  onEscapeKeyDown,
  onInteractOutside,
  initialFocus,
  portalContainer,
}: UseAlertDialogRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const titleId = useId();
  const descriptionId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const rootOverlayProps = useMemo(() => {
    let found: AlertDialogOverlayProps | undefined;
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      if ((child.type as { displayName?: string }).displayName !== "AlertDialog.Overlay") return;
      found = child.props as AlertDialogOverlayProps;
    });
    return found;
  }, [children]);
 
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
    closeOnInteractOutside,
    onEscapeKeyDown,
    onInteractOutside,
    initialFocus,
    variant: resolvedVariant,
    variantProp,
    rootOverlayProps,
    status: resolvedStatus,
    size,
    sizePreset,
    footerButtonSize: footerButtonSizeForAlertDialog(size),
    portalContainer,
  };
 
  return { contextValue };
}
 