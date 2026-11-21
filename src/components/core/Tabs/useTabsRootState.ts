import { useCallback, useId, useMemo, useRef } from "react";
 
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useSkinVariant } from "@/skins/skinContext";
 
import type { TabsContextValue, UseTabsRootStateProps } from "./tabsTypes";
 
export function useTabsRootState({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  size = "base",
  variant: variantProp,
  disabled = false,
  activationMode = "automatic",
  keepMounted = true,
}: UseTabsRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const baseId = useId();
  const [value, setInternalValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? null,
  });
  const tabElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const layoutListenersRef = useRef<Set<() => void>>(new Set());
 
  const setValue = useCallback(
    (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange, setInternalValue],
  );
 
  const subscribeTabLayout = useCallback((listener: () => void) => {
    layoutListenersRef.current.add(listener);
    return () => {
      layoutListenersRef.current.delete(listener);
    };
  }, []);

  const notifyTabLayout = useCallback(() => {
    for (const listener of layoutListenersRef.current) {
      listener();
    }
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
      activationMode,
      keepMounted,
      tabElementsRef,
      subscribeTabLayout,
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
      activationMode,
      keepMounted,
      tabElementsRef,
      subscribeTabLayout,
      notifyTabLayout,
    ],
  );
 
  return { contextValue };
}
 