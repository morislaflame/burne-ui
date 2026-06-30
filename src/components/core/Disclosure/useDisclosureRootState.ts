import { useCallback, useId, useMemo, useRef, useState } from "react";

import { disclosurePanelId, disclosureTriggerId } from "./disclosureA11y";
import { orderDragHandleChildren } from "./disclosureAPI";
import { useDisclosureGroupContext } from "./disclosureContext";
import { disclosureGroupedCardShell } from "./disclosureStyles";
import type {
  DisclosureContextValue,
  UseDisclosureRootStateProps,
} from "./disclosureTypes";

export function useDisclosureRootState({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value,
  variant: variantProp,
  size: sizeProp,
  disabled = false,
  iconPos = "right",
  dragHandle = false,
}: UseDisclosureRootStateProps) {
  const groupCtx = useDisclosureGroupContext();

  const isGrouped = groupCtx !== null && value !== undefined && groupCtx.accordion;
  const groupOpen = isGrouped ? groupCtx!.openValue === value : undefined;

  const [internal, setInternal] = useState(defaultOpen);

  const open = isGrouped ? groupOpen! : openProp !== undefined ? openProp : internal;

  const setOpen = useCallback(
    (next: boolean) => {
      if (isGrouped) {
        groupCtx!.setOpenValue(next ? (value ?? null) : null);
      } else {
        if (openProp === undefined) setInternal(next);
        onOpenChange?.(next);
      }
    },
    [isGrouped, groupCtx, value, openProp, onOpenChange],
  );

  const autoId = useId();
  const triggerId = disclosureTriggerId(autoId);
  const panelId = disclosurePanelId(autoId);
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const skipContentAnimRef = useRef(false);

  const variant = variantProp ?? groupCtx?.variant ?? "default";
  const size = sizeProp ?? groupCtx?.size ?? "base";
  const groupedCardShell = disclosureGroupedCardShell(groupCtx);

  const contextValue: DisclosureContextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerId,
      panelId,
      variant,
      size,
      disabled,
      iconPos,
      dragHandle,
      shellRef,
      innerRef,
      chevronRef,
      skipContentAnimRef,
    }),
    [disabled, dragHandle, iconPos, open, panelId, setOpen, size, triggerId, variant],
  );

  const orderedChildren =
    dragHandle && variant === "card" ? orderDragHandleChildren(children) : children;

  return {
    contextValue,
    variant,
    groupedCardShell,
    orderedChildren,
  };
}
