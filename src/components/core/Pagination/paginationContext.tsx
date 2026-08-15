import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  PaginationClassNames,
  PaginationClassNamesProviderProps,
  PaginationContextValue,
} from "./paginationTypes";

const PaginationContext = createContext<PaginationContextValue | null>(null);
const PaginationClassNamesContext = createContext<PaginationClassNames>({});

export function PaginationProvider({
  value,
  children,
}: {
  value: PaginationContextValue;
  children: React.ReactNode;
}) {
  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
}

export function PaginationClassNamesProvider({
  classNames,
  children,
}: PaginationClassNamesProviderProps) {
  const parent = useContext(PaginationClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <PaginationClassNamesContext.Provider value={merged}>
      {children}
    </PaginationClassNamesContext.Provider>
  );
}

export function usePagination(): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error("Pagination components must be inside <Pagination>.");
  }
  return ctx;
}

export function useOptionalPagination() {
  return useContext(PaginationContext);
}

export function usePaginationClassNames(): PaginationClassNames {
  return useContext(PaginationClassNamesContext);
}

/** Scope only. Defaults and host play live in `paginationAnimations.ts`. */
export const {
  MotionScopeProvider: PaginationMotionProvider,
  useMotionScope: usePaginationMotionScope,
  useOptionalMotionScope: useOptionalPaginationMotionScope,
} = createMotionScope("Pagination");
