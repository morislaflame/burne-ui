import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
 
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { createMotionScope } from "@/components/core/utils/slotMotion";
 
import type {
  ExpandableClassNames,
  ExpandableClassNamesProviderProps,
  ExpandableContextValue,
} from "./expandableTypes";
 
const ExpandableContext = createContext<ExpandableContextValue | null>(null);
const ExpandableClassNamesContext = createContext<ExpandableClassNames>({});
const ExpandableTriggerGridContext = createContext<MessageBannerGridSlots | null>(null);
 
/** Scope only. Defaults and host play live in `expandableAnimations.ts`. */
export const {
  MotionScopeProvider: ExpandableMotionProvider,
  useMotionScope: useExpandableMotionScope,
  useOptionalMotionScope: useOptionalExpandableMotionScope,
} = createMotionScope("Expandable");
 
export function ExpandableProvider({
  value,
  children,
}: {
  value: ExpandableContextValue;
  children: ReactNode;
}) {
  return (
    <ExpandableContext.Provider value={value}>{children}</ExpandableContext.Provider>
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
 
export function useExpandableClassNames(): ExpandableClassNames {
  return useContext(ExpandableClassNamesContext);
}
 
export function ExpandableTriggerGridProvider({
  gridSlots,
  children,
}: {
  gridSlots: MessageBannerGridSlots;
  children: ReactNode;
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

const ExpandableOwnedTriggerContext = createContext(false);

/** The trigger simple mode renders itself. A user trigger outside this host is a nested duplicate. */
export function ExpandableOwnedTrigger({ children }: { children: ReactNode }) {
  return (
    <ExpandableOwnedTriggerContext.Provider value={true}>
      {children}
    </ExpandableOwnedTriggerContext.Provider>
  );
}

export function useExpandableSimpleModeGuard(part: "Expandable.Trigger" | "Accordion.Heading") {
  const expandable = useContext(ExpandableContext);
  const owned = useContext(ExpandableOwnedTriggerContext);
  const compound = expandable?.compound ?? true;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (compound || owned) return;
    console.error(
      `[burne-ui] ${part} mounted in simple mode. Put compound parts directly inside Expandable or Accordion.Item. A wrapper component hides them: render the whole item from the wrapper.`,
    );
  }, [compound, owned, part]);
}
 