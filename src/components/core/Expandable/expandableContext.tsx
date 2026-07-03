import { createContext, useContext, useMemo } from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import type {
  ExpandableClassNames,
  ExpandableClassNamesProviderProps,
  ExpandableContextValue,
} from "./expandableTypes";

const ExpandableContext = createContext<ExpandableContextValue | null>(null);
const ExpandableClassNamesContext = createContext<ExpandableClassNames>({});
const ExpandableTriggerGridContext = createContext<MessageBannerGridSlots | null>(null);

export function ExpandableProvider({
  value,
  children,
}: {
  value: ExpandableContextValue;
  children: React.ReactNode;
}) {
  return (
    <ExpandableContext.Provider value={value}>{children}</ExpandableContext.Provider>
  );
}

export function ExpandableClassNamesProvider({
  classNames,
  children,
}: ExpandableClassNamesProviderProps) {
  const parent = useContext(ExpandableClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ExpandableClassNamesContext.Provider value={merged}>
      {children}
    </ExpandableClassNamesContext.Provider>
  );
}

export function useExpandable(): ExpandableContextValue {
  const ctx = useContext(ExpandableContext);
  if (!ctx) {
    throw new Error("Expandable components must be used inside <Expandable>.");
  }
  return ctx;
}

export { useExpandable as useExpandableContext };

export function useExpandableClassNames(): ExpandableClassNames {
  return useContext(ExpandableClassNamesContext);
}

export function ExpandableTriggerGridProvider({
  gridSlots,
  children,
}: {
  gridSlots: MessageBannerGridSlots;
  children: React.ReactNode;
}) {
  return (
    <ExpandableTriggerGridContext.Provider value={gridSlots}>
      {children}
    </ExpandableTriggerGridContext.Provider>
  );
}

export function useExpandableTriggerGrid(): MessageBannerGridSlots {
  const ctx = useContext(ExpandableTriggerGridContext);
  if (!ctx) {
    throw new Error("Expandable trigger parts must be inside <Expandable.Trigger>.");
  }
  return ctx;
}

export function useOptionalExpandableTriggerGrid(): MessageBannerGridSlots | null {
  return useContext(ExpandableTriggerGridContext);
}
