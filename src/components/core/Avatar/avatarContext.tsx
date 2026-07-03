import { createContext, useContext, useMemo } from "react";

import type {
  AvatarClassNames,
  AvatarClassNamesProviderProps,
  AvatarContextValue,
} from "./avatarTypes";

const AvatarContext = createContext<AvatarContextValue | null>(null);
const AvatarClassNamesContext = createContext<AvatarClassNames>({});

export function useAvatarContext(component: string): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error(`${component} must be used inside <Avatar>`);
  }
  return ctx;
}

export function AvatarClassNamesProvider({
  classNames,
  children,
}: AvatarClassNamesProviderProps) {
  const parent = useContext(AvatarClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <AvatarClassNamesContext.Provider value={merged}>
      {children}
    </AvatarClassNamesContext.Provider>
  );
}

export function useAvatarClassNames(): AvatarClassNames {
  return useContext(AvatarClassNamesContext);
}

export { AvatarContext };
