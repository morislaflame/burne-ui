import { createContext, useContext, useMemo } from "react";

import type { LinkClassNames, LinkClassNamesProviderProps } from "./linkTypes";

const LinkClassNamesContext = createContext<LinkClassNames>({});

export function LinkClassNamesProvider({
  classNames,
  children,
}: LinkClassNamesProviderProps) {
  const parent = useContext(LinkClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <LinkClassNamesContext.Provider value={merged}>
      {children}
    </LinkClassNamesContext.Provider>
  );
}

export function useLinkClassNames(): LinkClassNames {
  return useContext(LinkClassNamesContext);
}
