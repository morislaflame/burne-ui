import { createContext, useContext, useMemo, type ReactNode } from "react";

import type {
  ListBoxClassNames,
  ListBoxClassNamesProviderProps,
  ListBoxContextValue,
} from "./listBoxTypes";

const ListBoxContext = createContext<ListBoxContextValue | null>(null);
const ListBoxClassNamesContext = createContext<ListBoxClassNames>({});
const ListBoxSectionLabelContext = createContext<
  ((id: string | undefined) => void) | null
>(null);

export function ListBoxProvider({
  value,
  children,
}: {
  value: ListBoxContextValue;
  children: ReactNode;
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

export function ListBoxClassNamesProvider({
  classNames,
  children,
}: ListBoxClassNamesProviderProps) {
  const parent = useContext(ListBoxClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ListBoxClassNamesContext.Provider value={merged}>
      {children}
    </ListBoxClassNamesContext.Provider>
  );
}

export function useListBoxClassNames(): ListBoxClassNames {
  return useContext(ListBoxClassNamesContext);
}

export function ListBoxSectionLabelProvider({
  value,
  children,
}: {
  value: (id: string | undefined) => void;
  children: ReactNode;
}) {
  return (
    <ListBoxSectionLabelContext.Provider value={value}>
      {children}
    </ListBoxSectionLabelContext.Provider>
  );
}

export function useListBoxSectionLabelRegister() {
  return useContext(ListBoxSectionLabelContext);
}
