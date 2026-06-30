import { useCallback, useId, useState } from "react";

import { hasExpandableCompoundChildren } from "./expandableAPI";
import type {
  ExpandableContextValue,
  UseExpandableRootStateProps,
} from "./expandableTypes";

export function useExpandableRootState({
  children,
  compound: compoundProp,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  size = "base",
  variant = "default",
}: UseExpandableRootStateProps) {
  const panelId = useId();
  const headerId = useId();
  const controlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [hasPanel, setHasPanelState] = useState(false);

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
    size,
    variant,
    toggle,
    headerId,
    panelId,
    setHasPanel,
  };

  const isCompound =
    compoundProp === true || hasExpandableCompoundChildren(children);

  return {
    contextValue,
    isCompound,
    isGloss: variant === "gloss",
  };
}
