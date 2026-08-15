import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  AvatarClassNames,
  AvatarClassNamesProviderProps,
  AvatarContextValue,
  AvatarGroupMotionProviderProps,
  AvatarMotion,
} from "./avatarTypes";

/** Scope only. Defaults and host play live in `avatarAnimations.ts`. */
export const {
  MotionScopeProvider: AvatarMotionProvider,
  useMotionScope: useAvatarMotionScope,
  useOptionalMotionScope: useOptionalAvatarMotionScope,
} = createMotionScope("Avatar");

const AvatarContext = createContext<AvatarContextValue | null>(null);
const AvatarClassNamesContext = createContext<AvatarClassNames>({});
const AvatarGroupMotionContext = createContext<AvatarMotion | undefined>(undefined);

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

export function AvatarGroupMotionProvider({
  motion,
  children,
}: AvatarGroupMotionProviderProps) {
  return (
    <AvatarGroupMotionContext.Provider value={motion}>
      {children}
    </AvatarGroupMotionContext.Provider>
  );
}

export function useAvatarGroupMotion(): AvatarMotion | undefined {
  return useContext(AvatarGroupMotionContext);
}

export { AvatarContext };
