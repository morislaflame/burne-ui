import { createContext, useContext } from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import type { AlertStatus } from "./alertUtils";

export type AlertContextValue = {
  status: AlertStatus;
  titleId: string;
  descriptionId: string;
  gridSlots: MessageBannerGridSlots;
};

const AlertContext = createContext<AlertContextValue | null>(null);

function useAlertContext() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("Alert.* должны быть внутри <Alert>.");
  }
  return ctx;
}

function useOptionalAlertContext() {
  return useContext(AlertContext);
}

export { AlertContext };

void useAlertContext;
void useOptionalAlertContext;
