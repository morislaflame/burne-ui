import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  BreadcrumbsClassNames,
  BreadcrumbsClassNamesProviderProps,
  BreadcrumbsCollapseProviderProps,
} from "./breadcrumbsTypes";

const BreadcrumbsCollapseContext = createContext(true);

const BreadcrumbsClassNamesContext = createContext<BreadcrumbsClassNames>({});

export function BreadcrumbsCollapseProvider({
  collapse,
  children,
}: BreadcrumbsCollapseProviderProps) {
  return (
    <BreadcrumbsCollapseContext.Provider value={collapse}>
      {children}
    </BreadcrumbsCollapseContext.Provider>
  );
}

export function useBreadcrumbsCollapse() {
  return useContext(BreadcrumbsCollapseContext);
}

export function BreadcrumbsClassNamesProvider({
  classNames,
  children,
}: BreadcrumbsClassNamesProviderProps) {
  const parent = useContext(BreadcrumbsClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <BreadcrumbsClassNamesContext.Provider value={merged}>
      {children}
    </BreadcrumbsClassNamesContext.Provider>
  );
}

export function useBreadcrumbsClassNames(): BreadcrumbsClassNames {
  return useContext(BreadcrumbsClassNamesContext);
}

/** Scope only. Defaults and host play live in `breadcrumbsAnimations.ts`. */
export const {
  MotionScopeProvider: BreadcrumbsMotionProvider,
  useMotionScope: useBreadcrumbsMotionScope,
  useOptionalMotionScope: useOptionalBreadcrumbsMotionScope,
} = createMotionScope("Breadcrumbs");
