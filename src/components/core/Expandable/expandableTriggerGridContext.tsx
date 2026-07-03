import { createContext, useContext } from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

const ExpandableTriggerGridContext = createContext<MessageBannerGridSlots | null>(null);

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
