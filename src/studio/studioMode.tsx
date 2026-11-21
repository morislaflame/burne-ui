import { type ReactNode } from "react";

import { isLiveSkinSlot } from "./liveSkinSlots";
import { StudioSlotProvider } from "./studioModeContext";

/**
 * Studio canvas root. Kit parts carry `data-skin-slot` everywhere; inside this
 * provider marks narrow to live skin slots and `useStudioMode()` is true.
 */
export function StudioModeProvider({ children }: { children: ReactNode }) {
  return <StudioSlotProvider isLive={isLiveSkinSlot}>{children}</StudioSlotProvider>;
}
