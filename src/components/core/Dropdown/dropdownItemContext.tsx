import { createContext, useContext, type ReactNode } from "react";

export type DropdownItemContextValue = {
  showIndicatorSlot: boolean;
  selected: boolean;
  indicatorMode: "radio" | "multi";
  disabled: boolean;
};

const DropdownItemContext = createContext<DropdownItemContextValue | null>(null);

export function DropdownItemContextProvider({
  value,
  children,
}: {
  value: DropdownItemContextValue;
  children: ReactNode;
}) {
  return (
    <DropdownItemContext.Provider value={value}>{children}</DropdownItemContext.Provider>
  );
}

export function useDropdownItemContext(): DropdownItemContextValue {
  const ctx = useContext(DropdownItemContext);
  if (!ctx) {
    throw new Error("Dropdown.ItemIndicator must be used within Dropdown.Item");
  }
  return ctx;
}
