import { createContext, useContext, useMemo } from "react";
 
import { createMotionScope } from "@/components/core/utils/slotMotion";
 
import type {
  TabsClassNames,
  TabsClassNamesProviderProps,
  TabsContextValue,
} from "./tabsTypes";
 
const TabsContext = createContext<TabsContextValue | null>(null);
const TabsClassNamesContext = createContext<TabsClassNames>({});
const TabsListFallbackContext = createContext<string | null>(null);

export function TabsListFallbackProvider({
  value,
  children,
}: {
  value: string | null;
  children: React.ReactNode;
}) {
  return (
    <TabsListFallbackContext.Provider value={value}>
      {children}
    </TabsListFallbackContext.Provider>
  );
}

export function useTabsListFallbackValue(): string | null {
  return useContext(TabsListFallbackContext);
}
 
export function TabsClassNamesProvider({
  classNames,
  children,
}: TabsClassNamesProviderProps) {
  const parent = useContext(TabsClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );
 
  return (
    <TabsClassNamesContext.Provider value={merged}>
      {children}
    </TabsClassNamesContext.Provider>
  );
}
 
export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Components Tabs must be inside <Tabs>.");
  }
  return ctx;
}
 
export function useTabsClassNames(): TabsClassNames {
  return useContext(TabsClassNamesContext);
}
 
/** Scope only. Defaults and host play live in `tabsAnimations.ts`. */
export const {
  MotionScopeProvider: TabsMotionProvider,
  useMotionScope: useTabsMotionScope,
  useOptionalMotionScope: useOptionalTabsMotionScope,
} = createMotionScope("Tabs");
 
export { TabsContext };
 