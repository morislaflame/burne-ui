import { useCallback, useMemo, useRef, useState } from "react";

import { accordionDefaultOpenId } from "./accordionAPI";
import type { AccordionContextValue, UseAccordionRootStateProps } from "./accordionTypes";

export function useAccordionRootState({
  defaultOpenId: defaultOpenIdProp = null,
  defaultOpenIndex = null,
  openId: openIdProp,
  onOpenIdChange,
  size = "base",
}: UseAccordionRootStateProps) {
  const controlled = openIdProp !== undefined;
  const defaultOpenId = accordionDefaultOpenId(defaultOpenIdProp, defaultOpenIndex);
  const [internalOpenId, setInternalOpenId] = useState<string | null>(defaultOpenId);
  const openId = controlled ? openIdProp : internalOpenId;
  const itemIndexRef = useRef(0);

  itemIndexRef.current = 0;

  const getItemId = useCallback((explicit?: string) => {
    if (explicit != null) return explicit;
    const id = String(itemIndexRef.current);
    itemIndexRef.current += 1;
    return id;
  }, []);

  const setOpenId = useCallback(
    (next: string | null) => {
      if (!controlled) setInternalOpenId(next);
      onOpenIdChange?.(next);
    },
    [controlled, onOpenIdChange],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      openId,
      setOpenId,
      getItemId,
      size,
    }),
    [getItemId, openId, setOpenId, size],
  );

  return { contextValue };
}
