import { useCallback, useId, useState } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { hasExpandableCompoundChildren, hasExpandablePanelChildren } from "./expandableAPI";
import type {
  ExpandableContextValue,
  UseExpandableRootStateProps,
} from "./expandableTypes";
 
export function useExpandableRootState({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  size = "base",
  variant: variantProp,
}: UseExpandableRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const panelId = useId();
  const headerId = useId();
  const controlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isCompound = hasExpandableCompoundChildren(children);
  const childrenHasPanel = isCompound
    ? hasExpandablePanelChildren(children)
    : children != null;
  const [mountedHasPanel, setHasPanelState] = useState<boolean | null>(null);
  const hasPanel = childrenHasPanel || Boolean(mountedHasPanel);
 
  const setHasPanel = useCallback((value: boolean) => {
    setHasPanelState(value);
  }, []);
 
  const open = controlled ? openProp! : internalOpen;

  const toggle = useCallback(() => {
    if (disabled || !hasPanel) return;
    const next = !open;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [controlled, disabled, hasPanel, open, onOpenChange]);
 
  const contextValue: ExpandableContextValue = {
    open,
    disabled,
    hasPanel,
    compound: isCompound,
    size,
    variant,
    toggle,
    headerId,
    panelId,
    setHasPanel,
  };

  return {
    contextValue,
    isCompound,
  };
}
 