import { createContext, useContext, useMemo } from "react";

import type {
  AccordionClassNames,
  AccordionClassNamesProviderProps,
  AccordionContextValue,
} from "./accordionTypes";

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionClassNamesContext = createContext<AccordionClassNames>({});

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion components must be inside <Accordion>.");
  }
  return ctx;
}

export function AccordionClassNamesProvider({
  classNames,
  children,
}: AccordionClassNamesProviderProps) {
  const parent = useContext(AccordionClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <AccordionClassNamesContext.Provider value={merged}>
      {children}
    </AccordionClassNamesContext.Provider>
  );
}

export function useAccordionClassNames(): AccordionClassNames {
  return useContext(AccordionClassNamesContext);
}

export { AccordionContext };
