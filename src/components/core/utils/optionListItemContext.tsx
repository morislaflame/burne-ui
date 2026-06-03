import { createContext, useContext, type ReactNode } from "react";

export type OptionListItemContextValue = {
  showIndicatorSlot: boolean;
  hasHint: boolean;
  hasIcon: boolean;
  selected: boolean;
  indicatorMode: "radio" | "multi";
  disabled: boolean;
  mutedHint: boolean;
};

const OptionListItemContext = createContext<OptionListItemContextValue | null>(null);

export function OptionListItemContextProvider({
  value,
  children,
}: {
  value: OptionListItemContextValue;
  children: ReactNode;
}) {
  return <OptionListItemContext.Provider value={value}>{children}</OptionListItemContext.Provider>;
}

export function useOptionListItemContext(who: string): OptionListItemContextValue {
  const ctx = useContext(OptionListItemContext);
  if (!ctx) {
    throw new Error(`${who} должен быть внутри пункта списка (Dropdown.Item / ListBox.Item).`);
  }
  return ctx;
}
