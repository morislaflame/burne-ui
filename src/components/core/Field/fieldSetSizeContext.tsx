import { createContext, useContext } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

const FieldSetSizeContext = createContext<ComponentSize>("base");

export function FieldSetSizeProvider({
  size,
  children,
}: {
  size: ComponentSize;
  children: React.ReactNode;
}) {
  return (
    <FieldSetSizeContext.Provider value={size}>{children}</FieldSetSizeContext.Provider>
  );
}

export function useFieldSetSize(): ComponentSize {
  return useContext(FieldSetSizeContext);
}
