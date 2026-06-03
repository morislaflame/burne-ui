import { createContext, useContext, type RefObject } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsVariant = "default" | "outline" | "secondary";

export type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  size: ComponentSize;
  variant: TabsVariant;
  baseId: string;
  disabled: boolean;
  tabElementsRef: RefObject<Map<string, HTMLButtonElement>>;
  layoutEpoch: number;
  notifyTabLayout: () => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Компоненты Tabs должны быть внутри <Tabs>.");
  }
  return ctx;
}

export { TabsContext };
