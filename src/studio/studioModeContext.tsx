import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

import { bindStudioNode, unbindStudioNode } from "./studioNodes";

export type StudioSlotCheck = (id: string) => boolean;

const StudioModeContext = createContext<StudioSlotCheck | null>(null);

export function StudioSlotProvider({
  isLive,
  children,
}: {
  isLive: StudioSlotCheck;
  children: ReactNode;
}) {
  return <StudioModeContext.Provider value={isLive}>{children}</StudioModeContext.Provider>;
}

export function useStudioMode(): boolean {
  return useContext(StudioModeContext) !== null;
}

export function useStudioSlotCheck(): StudioSlotCheck | null {
  return useContext(StudioModeContext);
}

/** `Button` + `root` → `button.root`, matching the live skin slot list. */
export function skinSlotId(debugName: string, slot: string): string {
  return `${debugName.slice(0, 1).toLowerCase()}${debugName.slice(1)}.${slot}`;
}

export type StudioSlotMark = {
  node: HTMLElement;
  ids: string[];
  scope: object | null;
};

function slotTokens(node: HTMLElement): string[] {
  return (node.getAttribute("data-skin-slot") ?? "").split(/\s+/).filter(Boolean);
}

function addSkinSlotToken(node: HTMLElement, id: string): void {
  const tokens = slotTokens(node);
  if (!tokens.includes(id)) tokens.push(id);
  node.setAttribute("data-skin-slot", tokens.join(" "));
}

function removeSkinSlotToken(node: HTMLElement, id: string): void {
  const tokens = slotTokens(node).filter((token) => token !== id);
  if (tokens.length === 0) node.removeAttribute("data-skin-slot");
  else node.setAttribute("data-skin-slot", tokens.join(" "));
}

function clearStudioSlotMark(mark: StudioSlotMark): void {
  for (const id of mark.ids) removeSkinSlotToken(mark.node, id);
  if (mark.scope) unbindStudioNode(mark.node, mark.scope);
}

/**
 * Space-separated `data-skin-slot`. A motion id and a target id can share one node
 * (`popover.content popover.panel`). Each mark removes only the ids it added.
 */
export function applyStudioSlotMark(
  previous: StudioSlotMark | null,
  node: HTMLElement | null,
  ids: readonly string[],
  scope: object | null,
): StudioSlotMark | null {
  if (previous && previous.node !== node) {
    clearStudioSlotMark(previous);
    previous = null;
  }
  if (!node || ids.length === 0) {
    if (previous) clearStudioSlotMark(previous);
    return null;
  }
  if (previous) clearStudioSlotMark(previous);
  for (const id of ids) addSkinSlotToken(node, id);
  if (scope) bindStudioNode(node, scope);
  return { node, ids: [...ids], scope };
}

/** Motion id plus an extra target id, when both are in the live set. */
export function studioSlotIds(
  debugName: string | undefined,
  slot: string,
  studioSlot: string | undefined,
  isLive: StudioSlotCheck,
): string[] {
  const ids: string[] = [];
  if (debugName) {
    const motionId = skinSlotId(debugName, slot);
    if (isLive(motionId)) ids.push(motionId);
  }
  if (studioSlot && isLive(studioSlot) && !ids.includes(studioSlot)) ids.push(studioSlot);
  return ids;
}

/**
 * Marks a node whose motion slot id is not the skin target id
 * (`alertDialog.panel`, `disclosure.trigger`, …). No-op outside `StudioModeProvider`.
 * Binding runs in the ref callback, so a swapped node (`asChild`) is marked and the previous one is cleared.
 */
export function useStudioSlotRef<T extends HTMLElement>(
  slotId: string,
  scope?: object | null,
): (node: T | null) => void {
  const isLive = useStudioSlotCheck();
  const markRef = useRef<StudioSlotMark | null>(null);

  return useCallback((node: T | null) => {
    const ids = node && isLive?.(slotId) ? [slotId] : [];
    markRef.current = applyStudioSlotMark(markRef.current, node, ids, scope ?? null);
  }, [isLive, scope, slotId]);
}
