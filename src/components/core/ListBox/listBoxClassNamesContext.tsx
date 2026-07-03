import { createContext, useContext, useMemo } from "react";

import type { ListBoxClassNames, ListBoxClassNamesProviderProps } from "./listBoxTypes";

const ListBoxClassNamesContext = createContext<ListBoxClassNames>({});

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
