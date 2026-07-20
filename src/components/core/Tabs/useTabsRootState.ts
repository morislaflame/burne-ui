import { useCallback, useId, useMemo, useRef, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import type { TabsContextValue, UseTabsRootStateProps } from "./tabsTypes";

export function useTabsRootState({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  size = "base",
  variant = "default",
  disabled = false,
}: UseTabsRootStateProps) {
  const baseId = useId();
  const [value, setInternalValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? "",
  });
  const tabElementsRef = useRef<Map<string, HTMLButtonElement>>(null!);
  if (!tabElementsRef.current) tabElementsRef.current = new Map();
  const [layoutEpoch, setLayoutEpoch] = useState(0);

  const setValue = useCallback(
    (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange, setInternalValue],
  );

  const notifyTabLayout = useCallback(() => {
    setLayoutEpoch((epoch) => epoch + 1);
  }, []);

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      value,
      setValue,
      orientation,
      size,
      variant,
      baseId,
      disabled,
      tabElementsRef,
      layoutEpoch,
      notifyTabLayout,
    }),
    [
      value,
      setValue,
      orientation,
      size,
      variant,
      baseId,
      disabled,
      tabElementsRef,
      layoutEpoch,
      notifyTabLayout,
    ],
  );

  return { contextValue };
}
