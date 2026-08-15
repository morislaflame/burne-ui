import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  DropdownClassNames,
  DropdownClassNamesProviderProps,
  DropdownContextValue,
  DropdownSubContextValue,
} from "./dropdownTypes";

const DropdownContext = createContext<DropdownContextValue | null>(null);
const DropdownClassNamesContext = createContext<DropdownClassNames>({});
const DropdownIndicatorPreferenceContext = createContext(false);
const DropdownGroupLabelRegisterContext = createContext<
  ((id: string | undefined) => void) | null
>(null);
const DropdownSubContext = createContext<DropdownSubContextValue | null>(null);

export function DropdownProvider({
  value,
  children,
}: {
  value: DropdownContextValue;
  children: React.ReactNode;
}) {
  return (
    <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>
  );
}

export function DropdownClassNamesProvider({
  classNames,
  children,
}: DropdownClassNamesProviderProps) {
  const parent = useContext(DropdownClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <DropdownClassNamesContext.Provider value={merged}>
      {children}
    </DropdownClassNamesContext.Provider>
  );
}

export function DropdownIndicatorPreferenceProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownIndicatorPreferenceContext.Provider value={value}>
      {children}
    </DropdownIndicatorPreferenceContext.Provider>
  );
}

export function DropdownGroupLabelRegisterProvider({
  value,
  children,
}: {
  value: (id: string | undefined) => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownGroupLabelRegisterContext.Provider value={value}>
      {children}
    </DropdownGroupLabelRegisterContext.Provider>
  );
}

export function DropdownSubProvider({
  value,
  children,
}: {
  value: DropdownSubContextValue;
  children: React.ReactNode;
}) {
  return (
    <DropdownSubContext.Provider value={value}>{children}</DropdownSubContext.Provider>
  );
}

export function useDropdown(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("Dropdown.* components must be inside <Dropdown>.");
  }
  return ctx;
}

export function useDropdownClassNames(): DropdownClassNames {
  return useContext(DropdownClassNamesContext);
}

export function useDropdownIndicatorPreference() {
  return useContext(DropdownIndicatorPreferenceContext);
}

export function useDropdownGroupLabelRegister() {
  return useContext(DropdownGroupLabelRegisterContext);
}

export function useDropdownSub(): DropdownSubContextValue {
  const ctx = useContext(DropdownSubContext);
  if (!ctx) {
    throw new Error("DropdownSub.* components must be inside <DropdownSub>.");
  }
  return ctx;
}

/** Scope only. Defaults and host play live in `dropdownAnimations.ts`. */
export const {
  MotionScopeProvider: DropdownMotionProvider,
  useMotionScope: useDropdownMotionScope,
  useOptionalMotionScope: useOptionalDropdownMotionScope,
} = createMotionScope("Dropdown");
