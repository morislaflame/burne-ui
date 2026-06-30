import { createContext, useContext } from "react";

import type { AccordionContextValue } from "./accordionTypes";

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion components must be inside <Accordion>.");
  }
  return ctx;
}

export { AccordionContext };
