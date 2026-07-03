import { createContext, useContext } from "react";

const ListBoxSectionLabelContext = createContext<
  ((id: string | undefined) => void) | null
>(null);

export function ListBoxSectionLabelProvider({
  value,
  children,
}: {
  value: (id: string | undefined) => void;
  children: React.ReactNode;
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
