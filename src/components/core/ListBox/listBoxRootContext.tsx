import { createContext, useContext } from "react";

import type { ListBoxContextValue } from "./listBoxTypes";

const ListBoxContext = createContext<ListBoxContextValue | null>(null);

export function ListBoxProvider({
  value,
  children,
}: {
  value: ListBoxContextValue;
  children: React.ReactNode;
}) {
  return (
    <ListBoxContext.Provider value={value}>{children}</ListBoxContext.Provider>
  );
}

export function useListBox(who: string): ListBoxContextValue {
  const ctx = useContext(ListBoxContext);
  if (!ctx) throw new Error(`${who} must be inside <ListBox>.`);
  return ctx;
}
